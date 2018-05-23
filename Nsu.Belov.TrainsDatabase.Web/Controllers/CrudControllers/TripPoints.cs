using System;
using System.Linq;
using System.Web.Mvc;
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

namespace Nsu.Belov.TrainsDatabase.Web.Controllers.CrudControllers
{
    public partial class CrudController : Controller
    {
        public ActionResult TripPoints()
        {
            var vm = new TripPointViewModel()
            {
                Configurator = new Configurator<TripPoint, TripPoint>()
                    .Configure()
                    .Url(Url.Action(nameof(HandleTripPoints)))
            };
            return View(vm);
        }

        public ActionResult HandleTripPoints()
        {
            var conf = new Configurator<TripPoint, TripPoint>().Configure();
            var handler = conf.CreateMvcHandler(ControllerContext);
            handler.AddEditHandler(EditTripPoint);
            handler.AddCommandHandler("Remove", RemoveTripPoint);
            return handler.Handle(_context.TripPoints.OrderBy(x => x.TripId).ThenBy(x => x.StationOrder));
        }


        public TableAdjustment EditTripPoint(LatticeData<TripPoint, TripPoint> latticeData,
            TripPoint tripripPointRow)
        {
            TripPoint tripPoint = _context.TripPoints
                .FirstOrDefault(x => x.TripId == tripripPointRow.TripId
                                     && x.StationOrder == tripripPointRow.StationOrder);
            ;
            if (tripPoint == null)
            {
                tripPoint = new TripPoint()
                {
                    TripId = tripripPointRow.TripId,
                    StationOrder = tripripPointRow.StationOrder
                };
                _context.TripPoints.Add(tripPoint);
            }

            try
            {
                tripPoint.DepartureTime = tripripPointRow.DepartureTime;
                tripPoint.ArrivalTime = tripripPointRow.ArrivalTime;

                _context.SaveChanges();
            }
            catch (Exception e)
            {
                return latticeData.Adjust(x => x
                    .Message(LatticeMessage.User("failure", "Editing", $"Save exception: {e.Message}"))
                );
            }
            return latticeData.Adjust(x => x
                .UpdateRow(tripripPointRow)
                .Message(LatticeMessage.User("success", "Editing", "TripPoint saved"))
            );
        }

        public TableAdjustment RemoveTripPoint(LatticeData<TripPoint, TripPoint> latticeData)
        {
            var subj = latticeData.CommandSubject();
            var tripPoint = _context.TripPoints
                .FirstOrDefault(x => x.TripId == subj.TripId && x.StationOrder == subj.StationOrder);
            _context.TripPoints.Remove(tripPoint);
            _context.SaveChanges();
            return latticeData.Adjust(x => x
                .RemoveExact(subj)
                .Message(LatticeMessage.User("success", "Remove", "RoutePoint removed"))
            );
        }
    }
}