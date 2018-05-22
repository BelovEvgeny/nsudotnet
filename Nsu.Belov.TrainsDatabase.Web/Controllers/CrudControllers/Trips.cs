using System.Linq;
using System.Web.Mvc;
using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;
using Nsu.Belov.TrainsDatabase.Web.Models.CrudViewModels;
using Reinforced.Lattice;
using Reinforced.Lattice.Adjustments;
using Reinforced.Lattice.Commands;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Editing;
using Reinforced.Lattice.Mvc;
using Reinforced.Lattice.Processing;

namespace Nsu.Belov.TrainsDatabase.Web.Controllers.CrudControllers
{
    public partial class CrudController
    {
        public ActionResult Trips()
        {
            var vm = new TripViewModel()
            {
                Configurator = new Configurator<Trip, Trip>()
                    .Configure()
                    .Url(Url.Action(nameof(HandleTrips)))
            };
            return View(vm);
        }

        public ActionResult HandleTrips()
        {
            var conf = new Configurator<Trip, Trip>().Configure();
            var handler = conf.CreateMvcHandler(ControllerContext);
            handler.AddEditHandler(EditTrip);
            handler.AddCommandHandler("Remove", RemoveTrip);
            return handler.Handle(_context.Trips.OrderBy(x => x.TripId));
        }

        public TableAdjustment EditTrip(LatticeData<Trip, Trip> latticeData, Trip tripRow)
        {
            Trip trip;
            if (tripRow.TripId == 0)
            {
                trip = new Trip();
                _context.Trips.Add(trip);
            }
            else
            {
                trip = _context.Trips.FirstOrDefault(x => x.TripId == tripRow.TripId);
            }

            if (!(_context.Routes.Any(x => x.RouteId == tripRow.RouteId)))
            {
                return latticeData.Adjust(x => x
                    .Message(LatticeMessage.User("failure", "Editing",
                        $"There is no route with id {tripRow.RouteId}"))
                );
            }

            if (!(_context.Trains.Any(x => x.TrainId == tripRow.TrainId)))
            {
                return latticeData.Adjust(x => x
                    .Message(LatticeMessage.User("failure", "Editing",
                        $"There is no train with id {tripRow.TrainId}"))
                );
            }

            trip.RouteId = trip.RouteId;
            trip.TrainId = tripRow.TrainId;
            _context.SaveChanges();

            tripRow.TripId = trip.TripId;
            return latticeData.Adjust(x => x
                .UpdateRow(tripRow)
                .Message(LatticeMessage.User("success", "Editing", "Trip saved"))
            );
        }

        public TableAdjustment RemoveTrip(LatticeData<Trip, Trip> latticeData)
        {
            var subj = latticeData.CommandSubject();
            var trip = _context.Trips.FirstOrDefault(x => x.TripId == subj.TripId);
            _context.Trips.Remove(trip);
            _context.SaveChanges();
            return latticeData.Adjust(x => x
                .RemoveExact(subj)
                .Message(LatticeMessage.User("success", "Remove", "Trip removed"))
            );
        }
    }
}