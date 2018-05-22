using System;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
using Nsu.Belov.TrainsDatabase.Database;
using Nsu.Belov.TrainsDatabase.Web.Models;
using Reinforced.Lattice.Configuration;
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

        public ActionResult SelectTrip()
        {
            var firstOrDefault = _context.CrewMembers.FirstOrDefault();
            SelectTicketViewModel stvm = new SelectTicketViewModel()
            {
                StationNames = _context.Stations.Select(x => new SelectListItem()
                    {
                        Text = x.StationName,
                        Value = x.StationId.ToString()
                    }
                )
            };
            return View(stvm);
        }

        public ActionResult SelectTicket(SelectTicketViewModel vm)
        {
            vm.Configurator = new Configurator<SelectTripRow, SelectTripRow>()
                .Configure()
                .Url(Url.Action(nameof(HandleSelTicTable), new
                {
                    depStationId = vm.DepartureStationId,
                    arrStationId = vm.ArrivalStationId,
                    date = vm.Date
                }));
            return View(vm);
        }

        public ActionResult HandleSelTicTable(int depStationId, int arrStationId, string date)
        {
            var conf = new Configurator<SelectTripRow, SelectTripRow>().Configure();
            var handler = conf.CreateMvcHandler(ControllerContext);
            DateTime departureDate =
                DateTime.ParseExact(date, "dd.MM.yyyy", System.Globalization.CultureInfo.InvariantCulture);


            #region SecondVariant

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

            var fitRoutes = _context.RoutePoints
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
                .Where(s => DbFunctions.TruncateTime(s.DepartureTime) == departureDate);
            return handler.Handle(q);
        }
    }
}