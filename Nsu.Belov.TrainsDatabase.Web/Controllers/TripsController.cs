using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.Ajax.Utilities;
using Nsu.Belov.TrainsDatabase.Database;
using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;
using Nsu.Belov.TrainsDatabase.Web.Models;
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
    public class TripsController : Controller
    {
        private readonly TrainsDataContext _context;

        public TripsController(TrainsDataContext context)
        {
            _context = context;
        }

        public ActionResult Index(int? trainId = null)
        {
            var vm = new TripEditViewModel()
            {
                TrainId = trainId,
                RouteIds = (from route in _context.Routes
                    orderby route.RouteId
                    select new SelectListItem()
                    {
                        Text = route.RouteId.ToString(),
                        Value = route.RouteId.ToString()
                    }).ToArray(),
                TrainIds = (from train in _context.Trains
                    orderby train.TrainId
                    select new SelectListItem()
                    {
                        Text = train.TrainId.ToString(),
                        Value = train.TrainId.ToString()
                    }).ToArray(),
                Configurator = new Configurator<Trip, TripRow>()
                    .Configure()
                    .Url(Url.Action(nameof(HandleTrips), new {trainid = trainId}))
            };
            return View("Index",vm);
        }

        public ActionResult HandleTrips(int? trainId)
        {
            var conf = new Configurator<Trip, TripRow>().Configure();
            var handler = conf.CreateMvcHandler(ControllerContext);
            handler.AddEditHandler(EditTrip);
            handler.AddCommandHandler("Remove", RemoveTrip);
            if (!trainId.HasValue)
            {
                return handler.Handle(_context.Trips);
            }

            return handler.Handle(_context.Trips.Where(x => x.TrainId == trainId.Value));
        }

        public TableAdjustment EditTrip(LatticeData<Trip, TripRow> latticeData, TripRow tripRow)
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
            if (!_context.Routes.Any(x => x.RouteId == tripRow.RouteId))
            {
                return latticeData.Adjust(x => x
                    .Message(LatticeMessage.User("failure", "Editing",
                        $"There is no route with id {tripRow.RouteId}"))
                );
            }

            if (!_context.Trains.Any(x => x.TrainId == tripRow.TrainId))
            {
                return latticeData.Adjust(x => x
                    .Message(LatticeMessage.User("failure", "Editing",
                        $"There is no train with id {tripRow.TrainId}"))
                );
            }

            trip.RouteId = tripRow.RouteId;
            trip.TrainId = tripRow.TrainId;
            _context.SaveChanges();
            return latticeData.Adjust(x => x
                .Update(trip)
                .Message(LatticeMessage.User("success", "Editing", "Trip saved"))
            );
        }

        public TableAdjustment RemoveTrip(LatticeData<Trip, TripRow> latticeData)
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

        public ActionResult TripPointsForTrip(int tripId)
        {
            var vm = new TripPointForViewModel()
            {
                Configurator = new Configurator<TripPoint, TripPointForRow>()
                    .Configure()
                    .Url(Url.Action(nameof(HandleTripPoints), new {tripId = tripId}))
            };
            return View(vm);
        }

        public ActionResult HandleTripPoints(int tripId)
        {
            var conf = new Configurator<TripPoint, TripPointForRow>().Configure();
            var handler = conf.CreateMvcHandler(ControllerContext);
            handler.AddEditHandler((data, row) => EditTripPoint(data, row, tripId));
            handler.AddCommandHandler("Remove", RemoveTripPoint);
            return handler.Handle(_context.TripPoints.Where(point => point.TripId == tripId));
        }

        public TableAdjustment EditTripPoint(LatticeData<TripPoint, TripPointForRow> latticeData,
            TripPointForRow tripPointRow, int tripId)
        {
            TripPoint tripPoint;
            if (tripPointRow.TripId == 0)
            {
                tripPoint = new TripPoint()
                {
                    TripId = tripId,
                    StationOrder = _context.TripPoints.Where(x => x.TripId == tripId).Max(x => x.StationOrder) + 1
                };
                int routeId = _context.Trips.FirstOrDefault(t => t.TripId == tripId).RouteId;
                if (_context.RoutePoints.Where(rp => rp.RouteId == routeId)
                    .Any(rp => rp.StationOrder == tripPoint.StationOrder))
                {
                    _context.TripPoints.Add(tripPoint);
                }
                else
                {
                    return latticeData.Adjust(x => x
                        .Message(LatticeMessage.User("failure", "Editing",
                            "There are not more stationsin the route"))
                    );
                }
            }
            else
            {
                tripPoint = _context.TripPoints
                    .FirstOrDefault(x => x.TripId == tripId && x.StationOrder == tripPointRow.StationOrder);
            }

            Delay delay = tripPoint.Delay;
            if (tripPointRow.DelayinMinutes.HasValue && tripPointRow.DelayinMinutes != 0)
            {
                if (delay != null)
                {
                    delay.MinutesDelaySpan = tripPointRow.DelayinMinutes.Value;
                }
                else
                {
                    tripPoint.Delay = new Delay()
                    {
                        TripPoint = tripPoint,
                        MinutesDelaySpan = tripPointRow.DelayinMinutes.Value
                    };
                }
            }
            else
            {
                if (delay != null)
                {
                    _context.Delays.Remove(delay);
                }
            }

            if (tripPointRow.DepartureTime.HasValue
                && tripPointRow.ArrivalTime.HasValue
                && tripPointRow.DepartureTime < tripPointRow.ArrivalTime)
            {
                return latticeData.Adjust(x => x
                    .Message(LatticeMessage.User("failure", "Editing",
                        "Depatrure time can not be less then ArrivialTime"))
                );
            }

            if (tripPoint.StationOrder > 1
                && tripPointRow.ArrivalTime.HasValue)
            {
                TripPoint previousPoint = _context.TripPoints
                    .FirstOrDefault(x => x.TripId == tripId && x.StationOrder == tripPointRow.StationOrder - 1);
                if (previousPoint != null && tripPointRow.ArrivalTime < previousPoint.DepartureTime)
                {
                    return latticeData.Adjust(x => x
                        .Message(LatticeMessage.User("failure", "Editing",
                            "Arrivial time less then previous departure"))
                    );
                }
            }

            try
            {
                tripPoint.DepartureTime = tripPointRow.DepartureTime;
                tripPoint.ArrivalTime = tripPointRow.ArrivalTime;
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                return latticeData.Adjust(x => x
                    .Message(LatticeMessage.User("failure", "Editing", $"Save exception: {e.Message}"))
                );
            }

            tripPointRow.TripId = tripPoint.TripId;

            var mpd = latticeData.Configuration.MapRange(latticeData.Source.Where(tp =>
                tp.TripId == tripPoint.TripId && tp.StationOrder == tripPoint.StationOrder));

            return latticeData.Adjust(x => x.Update(mpd)
                .Message(LatticeMessage.User("success", "Editing", "TripPoint saved"))
            );
        }

        public TableAdjustment RemoveTripPoint(LatticeData<TripPoint, TripPointForRow> latticeData)
        {
            var subj = latticeData.CommandSubject();
            if (_context.TripPoints.Any(x => x.TripId == subj.TripId && x.StationOrder == subj.StationOrder + 1))
            {
                return latticeData.Adjust(x => x
                    .Message(LatticeMessage.User("failure", "Remove", "Can not delete point from the middle of route"))
                );
            }

            var tripPoint = _context.TripPoints
                .FirstOrDefault(x => x.TripId == subj.TripId && x.StationOrder == subj.StationOrder);

            _context.TripPoints.Remove(tripPoint);
            _context.SaveChanges();
            return latticeData.Adjust(x => x
                .Remove(subj)
                .Message(LatticeMessage.User("success", "Remove", "RoutePoint removed"))
            );
        }

        [Authorize(Roles = "operator")]
        public ActionResult GenerateNew(int trainId)
        {
            var lastTrainTrip = (from train in _context.Trains
                    where train.TrainId == trainId
                    from lastTrip in (
                        from trip in train.Trips
                        orderby trip.TripId descending
                        select trip).Take(1)
                    select lastTrip).Include(trip => trip.TripPoints)
                .FirstOrDefault();
            if (lastTrainTrip == null)
            {
                ModelState.AddModelError("wrongtrain", "У этого поезда еще небыло поездок");
                return Index(trainId);
            }

            Trip newTrip = new Trip()
            {
                RouteId = lastTrainTrip.RouteId,
                TripId = lastTrainTrip.TripId,
                TrainId = trainId
            };
            _context.Trips.Add(newTrip);
            if (lastTrainTrip.TripPoints.Count != 0)
            {
                var lastTripStartDate = lastTrainTrip.TripPoints
                    .OrderBy(point => point.StationOrder)
                    .FirstOrDefault()
                    .DepartureTime.Value.Date;
                var newTripStartDate = lastTrainTrip.TripPoints
                                           .Where(point => point.ArrivalTime.HasValue)
                                           .OrderByDescending(point => point.StationOrder)
                                           .FirstOrDefault().ArrivalTime.Value.Date + TimeSpan.FromDays(1);


                newTrip.TripPoints = new List<TripPoint>();
                foreach (var tripPoint in lastTrainTrip.TripPoints)
                {
                    newTrip.TripPoints.Add(new TripPoint()
                    {
                        StationOrder = tripPoint.StationOrder,
                        ArrivalTime = (tripPoint.ArrivalTime.HasValue)
                            ? newTripStartDate + (tripPoint.ArrivalTime.Value - lastTripStartDate)
                            : (DateTime?) null,
                        DepartureTime = (tripPoint.DepartureTime.HasValue)
                            ? newTripStartDate + (tripPoint.DepartureTime.Value - lastTripStartDate)
                            : (DateTime?) null
                    });
                }
            }

            _context.SaveChanges();
            return Index(trainId);
        }
    }
}