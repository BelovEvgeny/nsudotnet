using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.Ajax.Utilities;
using Nsu.Belov.TrainsDatabase.Database;
using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;
using Nsu.Belov.TrainsDatabase.Web.Models.CrudViewModels;
using Reinforced.Lattice;
using Reinforced.Lattice.Adjustments;
using Reinforced.Lattice.Commands;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Editing;
using Reinforced.Lattice.Mvc;
using Reinforced.Lattice.Processing;

namespace Nsu.Belov.TrainsDatabase.Web.Controllers
{
    public class TripsEditController : Controller
    {
        private readonly TrainsDataContext _context;

        public TripsEditController(TrainsDataContext context)
        {
            this._context = context;
        }

        public ActionResult Index()
        {
            
            var vm = new TripEditViewModel()
            {
                RouteIds = _context.Routes.Select(r => r.RouteId).OrderBy(x => x).ToArray(),
                TrainIds = _context.Trains.Select(r => r.TrainId).OrderBy(x => x).ToArray(),
                Configurator = new Configurator<Trip, TripEditRow>()
                    .Configure()
                    .Url(Url.Action(nameof(HandleTrips)))
            };
            return View(vm);
        }

        public ActionResult HandleTrips()
        {
            var conf = new Configurator<Trip, TripEditRow>().Configure();
            var handler = conf.CreateMvcHandler(ControllerContext);
            handler.AddEditHandler(EditTrip);
            handler.AddCommandHandler("Remove", RemoveTrip);

            #region first

            IQueryable<TripEditRow> tripEditRows = from trip in _context.Trips
                from depatrure in ((
                    from tripPoint in trip.TripPoints
                    where tripPoint.StationOrder == trip.TripPoints.Min(tp => tp.StationOrder)
                    from routePoint in trip.Route.RoutePoints
                    where routePoint.StationOrder == tripPoint.StationOrder
                    select new
                    {
                        routePoint.StationOrder,
                        routePoint.Station.StationName,
                        DepartureTime = (DateTime?) tripPoint.DepartureTime
                    }).DefaultIfEmpty(new
                {
                    StationOrder = -1,
                    StationName = (string) null,
                    DepartureTime = (DateTime?) null
                }).Take(1))
                from arrival in (
                    from tripPoint in trip.TripPoints
                    where tripPoint.StationOrder == trip.TripPoints.Max(tp => tp.StationOrder)
                          && tripPoint.StationOrder != depatrure.StationOrder
                    from routePoint in trip.Route.RoutePoints
                    where routePoint.StationOrder == tripPoint.StationOrder
                    select new
                    {
                        routePoint.Station.StationName,
                        ArrivalTime = (DateTime?) tripPoint.ArrivalTime
                    }).DefaultIfEmpty(new
                {
                    StationName = (string) null,
                    ArrivalTime = (DateTime?) null
                }).Take(1)
                select new TripEditRow()
                {
                    TripId = trip.TripId,
                    RouteId = trip.RouteId,
                    TrainId = trip.TrainId,
                    RouteName = trip.Route.RouteName,
                    DepatrureStationName = depatrure.StationName,
                    DepatrureDate = depatrure.DepartureTime,
                    ArrivalStationName = arrival.StationName,
                    ArrivalDate = arrival.ArrivalTime,
                };

            #endregion

            #region second

            /*  IQueryable<TripEditRow> tripEditRows = _context.Trips.GroupJoin(_context.RoutePoints,
                 t => t.RouteId, rp => rp.RouteId, (trip, routePoints) =>
                     new TripEditRow()
                     {
                         TripId = trip.TripId,
                         RouteId = trip.RouteId,
                         TrainId = trip.TripId,
                         RouteName = routePoints.FirstOrDefault().Route.RouteName,

                         DepatrureStationName = (trip.TripPoints.Any())
                             ? routePoints.FirstOrDefault(rp =>
                                 rp.StationOrder == trip.TripPoints.OrderBy(tp => tp.StationOrder).FirstOrDefault()
                                     .StationOrder).Station.StationName
                             : null,

                         DepatrureDate =
                             (trip.TripPoints.Any())
                                 ? trip.TripPoints.OrderBy(tp => tp.StationOrder).FirstOrDefault().DepartureTime
                                 : (DateTime?) null,

                         ArrivalStationName = (trip.TripPoints.Count() > 1)
                             ? routePoints.FirstOrDefault(rp =>
                                 rp.StationOrder == trip.TripPoints.OrderByDescending(tp => tp.StationOrder)
                                     .FirstOrDefault()
                                     .StationOrder).Station.StationName
                             : null,

                         ArrivalDate =
                             (trip.TripPoints.Count() > 1)
                                 ? trip.TripPoints.OrderByDescending(tp => tp.StationOrder).FirstOrDefault().ArrivalTime
                                 : (DateTime?) null,
                     });*/

            //            string s = tripEditRows.ToString();

            #endregion

            return handler.Handle(_context.Trips);
        }

        public TableAdjustment EditTrip(LatticeData<Trip, TripEditRow> latticeData, TripEditRow tripRow)
        {
            Trip trip;
            if (tripRow.TripId == 0)
            {
                trip = new Trip();
                _context.Trips.Add(trip);
            }

            else
            {
                trip = _context.Trips
                    .FirstOrDefault(x => x.TripId == tripRow.TripId);
            }

            //на всякий случай(по идее, если сделано через форму то никогда не сработает)
            Route rowRoute = _context.Routes.FirstOrDefault(x => x.RouteId == tripRow.RouteId);
            if (rowRoute == null)
            {
                return latticeData.Adjust(x => x
                    .Message(LatticeMessage.User("failure", "Editing",
                        $"There is no route with id {tripRow.RouteId}"))
                );
            }

            bool routeChanged = (rowRoute.RouteId != trip.Route.RouteId);
            trip.Route = rowRoute;
            trip.TrainId = tripRow.TrainId;
            _context.SaveChanges();
            return latticeData.Adjust(x => x
                .Update(trip)
                .Message(LatticeMessage.User("success", "Editing", "Trip saved"))
            );
        }

        public TableAdjustment RemoveTrip(LatticeData<Trip, TripEditRow> latticeData)
        {
            var subj = latticeData.CommandSubject();
            var trip = _context.Trips.FirstOrDefault(x => x.TripId == subj.TripId);
            _context.Trips.Remove(trip);
            _context.SaveChanges();
            return latticeData.Adjust(x => x
                .Remove(subj)
                .Message(LatticeMessage.User("success", "Remove", "Trip removed"))
            );
        }
    }
}