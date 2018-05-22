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
        public ActionResult Routes()
        {
            var vm = new RouteViewModel()
            {
                Configurator = new Configurator<Route, RouteRow>()
                    .Configure()
                    .Url(Url.Action(nameof(HandleRoutes)))
            };
            return View(vm);
        }

        public ActionResult HandleRoutes()
        {
            var conf = new Configurator<Route, RouteRow>().Configure();
            var handler = conf.CreateMvcHandler(ControllerContext);
            handler.AddEditHandler(EditRoute);
            handler.AddCommandHandler("Remove", RemoveRoute);
            return handler.Handle(_context.Routes.OrderBy(x => x.RouteId));
        }

        public TableAdjustment EditRoute(LatticeData<Route, RouteRow> latticeData, RouteRow routeRow)
        {
            Route route;
            if (routeRow.RouteId == 0)
            {
                route = new Route();
                _context.Routes.Add(route);
            }
            else
            {
                route = _context.Routes
                    .FirstOrDefault(x => x.RouteId == routeRow.RouteId);
            }

            route.RouteName = routeRow.RouteName;
            _context.SaveChanges();
            routeRow.RouteId = route.RouteId;
            return latticeData.Adjust(x => x
                .Update(routeRow)
                .Message(LatticeMessage.User("success", "Editing", "Route saved"))
            );
        }

        public TableAdjustment RemoveRoute(LatticeData<Route, RouteRow> latticeData)
        {
            var subj = latticeData.CommandSubject();
            var route = _context.Routes.FirstOrDefault(x => x.RouteId == subj.RouteId);
            _context.Routes.Remove(route);
            _context.SaveChanges();
            return latticeData.Adjust(x => x
                .Remove(subj)
                .Message(LatticeMessage.User("success", "Remove", "Route removed"))
            );
        }
    }
}