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
        private readonly TrainsDataContext _context;

        public CrudController(TrainsDataContext context)
        {
            this._context = context;
        }

        public ActionResult RoutePointsForRoute(int routeId)
        {
            var vm = new RoutePointViewModel()
            {
                Configurator = new Configurator<RoutePoint, RoutePointRow>()
                    .Configure()
                    .Url(Url.Action(nameof(HandleRoutePoints), new { routeId }))
            };
            return View(vm);
        }

        public ActionResult HandleRoutePoints(int routeId)
        {
            var conf = new Configurator<RoutePoint, RoutePointRow>().Configure();
            var handler = conf.CreateMvcHandler(ControllerContext);
            handler.AddEditHandler((latticeData, rpRow) => EditRoutePoint(latticeData, rpRow, routeId));
            handler.AddCommandHandler("Remove", RemoveRoutePoint);
            var routePoints = _context.RoutePoints
                .Where(x => x.RouteId == routeId)
                .OrderBy(x => x.StationOrder);
            return handler.Handle(routePoints);
        }


        public TableAdjustment EditRoutePoint(LatticeData<RoutePoint, RoutePointRow> latticeData,
            RoutePointRow routePointRow, int routeId)
        {
            RoutePoint routePoint;
            if (routePointRow.RouteId == 0)
            {
                routePoint = new RoutePoint
                {
                    RouteId = routeId,
                    StationOrder = _context.RoutePoints.Where(x => x.RouteId == routeId)
                                       .Select(x => x.StationOrder)
                                       .DefaultIfEmpty()
                                       .Max() + 1
                };
                _context.RoutePoints.Add(routePoint);
            }
            else
            {
                routePoint = _context.RoutePoints
                    .FirstOrDefault(x =>
                        x.RouteId == routePointRow.RouteId && x.StationOrder == routePointRow.StationOrder);
            }

            Station station = _context.Stations.FirstOrDefault(x => x.StationName == routePointRow.StationName);
            if (station == null)
            {
                return latticeData.Adjust(x => x
                    .Message(LatticeMessage.User("failure", "Editing",
                        $"There is no station with name {routePointRow.StationName}"))
                );
            }

            routePoint.Station = station;
            _context.SaveChanges();

            routePointRow.RouteId = routePoint.RouteId;
            routePointRow.StationOrder = routePoint.StationOrder;
            routePointRow.StationId = routePoint.StationId;
            return latticeData.Adjust(x => x
                .Update(routePointRow)
                .Message(LatticeMessage.User("success", "Editing", "Route saved"))
            );
        }

        public TableAdjustment RemoveRoutePoint(LatticeData<RoutePoint, RoutePointRow> latticeData)
        {
            var subj = latticeData.CommandSubject();
            var routePoint =
                _context.RoutePoints.FirstOrDefault(x =>
                    x.RouteId == subj.RouteId && x.StationOrder == subj.StationOrder);
            _context.RoutePoints.Remove(routePoint);
            _context.SaveChanges();
            return latticeData.Adjust(x => x
                .Remove(subj)
                .Message(LatticeMessage.User("success", "Remove", "RoutePoint removed"))
            );
        }
    }
}