using System;
using System.Data.Entity;
using System.Linq;
using System.Transactions;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Nsu.Belov.TrainsDatabase.Database;
using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;
using Nsu.Belov.TrainsDatabase.Web.Models;
using Reinforced.Lattice;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Filters;
using Reinforced.Lattice.Mvc;

namespace Nsu.Belov.TrainsDatabase.Web.Controllers
{
    public class TicketsController : Controller
    {
        private readonly TrainsDataContext _context;

        public TicketsController(TrainsDataContext context)
        {
            _context = context;
        }

        [Authorize]
        public ActionResult FindTickets()
        {
            SelectTicketViewModel stvm = new SelectTicketViewModel()
            {
                StationNames = GetStationNamesItem()
            };
            return View(stvm);
        }

        private SelectListItem[] GetStationNamesItem()
        {
            var selectListItems = _context.Stations.Select(x => new SelectListItem()
            {
                Text = x.StationName,
                Value = x.StationId.ToString()
            });
            return selectListItems.ToArray();
        }

        [Authorize]
        public ActionResult SelectTicket(SelectTicketViewModel vm)
        {
            if (!ModelState.IsValid)
            {
                vm.StationNames = GetStationNamesItem();
                return View("FindTickets", vm);
            }

            vm.Configurator = new Configurator<SelectTripRow, SelectTripRow>()
                .Configure()
                .Url(Url.Action(nameof(HandleSelTicTable), new
                {
                    depStationId = vm.DepartureStationId,
                    arrStationId = vm.ArrivalStationId,
                    startDate = vm.DateStart,
                    endDate = vm.DateEnd
                }));
            return View(vm);
        }


        public ActionResult HandleSelTicTable(int depStationId, int arrStationId, string startDate, string endDate)
        {
            var conf = new Configurator<SelectTripRow, SelectTripRow>().Configure();
            var handler = conf.CreateMvcHandler(ControllerContext);
            DateTime departureDateStart =
                DateTime.ParseExact(startDate, "dd.MM.yyyy", System.Globalization.CultureInfo.InvariantCulture);
            DateTime departureDateEnd =
                DateTime.ParseExact(endDate, "dd.MM.yyyy", System.Globalization.CultureInfo.InvariantCulture);


            #region FirstVariant

            /* var allDeps = _context.RoutePoints.Where(x => x.StationId == depStationId);
                        var allArrs = _context.RoutePoints.Where(x => x.StationId == arrStationId);
            
                        var fr = from start in allDeps
                                 from end in allArrs.Where(x=>x.RouteId==start.RouteId && start.StationOrder< x.StationOrder).Take(1)
                                 join tr in _context.Trips on end.RouteId equals tr.TripId
                                 from depTime in tr.TripPoints.Where(x=>x.StationOrder==start.StationOrder).Select(d=>d.DepartureTime).Take(1)
                                 from aTime in tr.TripPoints.Where(x=>x.StationOrder==end.StationOrder).Select(d=>d.ArrivalTime).Take(1)
                                where start.StationOrder < end.StationOrder
                                select new SelectTripRow()
                                {
                                    DepartureTime = depTime,
                                    ArrivalTime = aTime,
                                    TravelTime = SqlFunctions.DateDiff("n",aTime,depTime),
                                    RouteId = end.RouteId,
                                    TripId = tr.TripId,
                                    TrainId = tr.Train.TrainId
                                };*/

            #endregion

            #region SecondVariant

            /*    var fitRoutes = _context.RoutePoints
                    .Where(x => x.StationId == depStationId)
                    .Join(_context.RoutePoints
                            .Where(x => x.StationId == arrStationId),
                        rp => rp.RouteId,
                        rp => rp.RouteId,
                        (depRp, arrRp) => new
                        {
                            depRp.RouteId,
                            depStationOrder = depRp.StationOrder,
                            arrStationOrder = arrRp.StationOrder
                        })
                    .Where(x => x.depStationOrder < x.arrStationOrder);
             
                var q = _context.Trips
                    .Join(fitRoutes,
                        t => t.Route.RouteId,
                        fr => fr.RouteId,
                        (t, fr) => new SelectTripRow()
                        {
                            TripId = t.TripId,
                            RouteId = t.Route.RouteId,
                            TrainId = t.TrainId,
                            DepartureTime = t.TripPoints
                                .FirstOrDefault(tp => tp.StationOrder == fr.depStationOrder)
                                .DepartureTime,
                            ArrivalTime = t.TripPoints
                                .FirstOrDefault(tp => tp.StationOrder == fr.arrStationOrder)
                                .ArrivalTime
                        })
                    .Where(s => DbFunctions.TruncateTime(s.DepartureTime) >= departureDateStart
                                && DbFunctions.TruncateTime(s.DepartureTime) <= departureDateEnd);*/

            #endregion

            var q = from trip in _context.Trips
                join fitRoute in (
                        from startRP in _context.RoutePoints
                        join endRP in _context.RoutePoints
                            on startRP.RouteId equals endRP.RouteId
                        where startRP.StationId == depStationId
                              && endRP.StationId == arrStationId
                              && startRP.StationOrder < endRP.StationOrder
                        select new
                        {
                            startRP.RouteId,
                            depStationOrder = startRP.StationOrder,
                            arrStationOrder = endRP.StationOrder
                        })
                    on trip.RouteId equals fitRoute.RouteId
                where trip.TripPoints.Any(tp => tp.StationOrder == fitRoute.depStationOrder)
                      && trip.TripPoints.Any(tp => tp.StationOrder == fitRoute.arrStationOrder)
                select new
                {
                    TripId = trip.TripId,
                    RouteId = trip.RouteId,
                    TrainId = trip.TrainId,
                    DepartureStationOrder = fitRoute.depStationOrder,
                    ArrivalStationOrder = fitRoute.arrStationOrder,
                    DepartureTime = trip.TripPoints
                        .FirstOrDefault(tp => tp.StationOrder == fitRoute.depStationOrder)
                        .DepartureTime,
                    ArrivalTime = trip.TripPoints
                        .FirstOrDefault(tp => tp.StationOrder == fitRoute.arrStationOrder)
                        .ArrivalTime,
                    // этот селект чтоб два раза TouchedTickets не вычислять
                    TouchedTickets = trip.Tickets.Where(ticket =>
                        (ticket.StartStationOrder >= fitRoute.depStationOrder &&
                         ticket.StartStationOrder < fitRoute.arrStationOrder)
                        ||
                        (ticket.EndStationOrder > fitRoute.depStationOrder &&
                         ticket.EndStationOrder <= fitRoute.arrStationOrder)),
                    TrainFirstClassCapacity = trip.Train.FirstClassCapacity,
                    TrainSecondClassCapacity = trip.Train.SecondClassCapacity,
                }
                into z
                where DbFunctions.TruncateTime(z.DepartureTime) >= departureDateStart
                      && DbFunctions.TruncateTime(z.DepartureTime) <= departureDateEnd
                select new SelectTripRow()
                {
                    TripId = z.TripId,
                    RouteId = z.RouteId,
                    TrainId = z.TrainId,
                    DepartureStationOrder = z.DepartureStationOrder,
                    ArrivalStationOrder = z.ArrivalStationOrder,
                    NumberOfStations = z.ArrivalStationOrder - z.DepartureStationOrder + 1,
                    DepartureTime = z.DepartureTime,
                    ArrivalTime = z.ArrivalTime,
                    FirstClassTickets = z.TrainFirstClassCapacity -
                                        z.TouchedTickets.Count(ticket => ticket.SeatsType == SeatsType.FirstClass),
                    SecondClassTickets = z.TrainSecondClassCapacity -
                                         z.TouchedTickets.Count(ticket => ticket.SeatsType == SeatsType.SecondClass)
                };


            return handler.Handle(q);
        }

        [Authorize]
        public ActionResult Buy(int tripId, int depOrder, int arrOrder, SeatsType seatsType)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    Trip trip = _context.Trips.First(t => t.TripId == tripId);
                    int occupiedSeats = trip
                        .Tickets.Count(ticket => ticket.SeatsType == seatsType
                                                 && ((ticket.StartStationOrder >= depOrder
                                                      && ticket.StartStationOrder < arrOrder)
                                                     || (ticket.EndStationOrder > depOrder
                                                         && ticket.EndStationOrder <= arrOrder)));
                    int thisTypeTrainCapacity;

                    switch (seatsType)
                    {
                        //еще наверно собрать из имени enum + Capacity,
                        //но где гарантия что при добавлении полей в enum их назовут так же 
                        case SeatsType.FirstClass:
                            thisTypeTrainCapacity = trip.Train.FirstClassCapacity;
                            break;
                        case SeatsType.SecondClass:
                            thisTypeTrainCapacity = trip.Train.SecondClassCapacity;
                            break;
                        default:
                            throw new ArgumentOutOfRangeException(nameof(seatsType), seatsType, null);
                    }

                    if (thisTypeTrainCapacity > occupiedSeats)
                    {
                        Ticket ticket = new Ticket()
                        {
                            TripId = tripId,
                            StartStationOrder = depOrder,
                            EndStationOrder = arrOrder,
                            UserId = User.Identity.GetUserId(),
                            SeatsType = seatsType
                        };
                        _context.Tickets.Add(ticket);
                        _context.SaveChanges();
                        transaction.Commit();

                        // чет не понял как проверить результат транзакции
                        ViewBag.Success = true;
                    }
                    else
                    {
                        transaction.Rollback();
                        ViewBag.Success = false;
                    }
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    ViewBag.Success = false;
                }
            }

            return View();
        }
    }
}