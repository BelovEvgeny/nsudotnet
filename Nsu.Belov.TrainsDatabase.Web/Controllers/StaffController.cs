using System;
using System.Collections.Generic;
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
    public class RoutesController : Controller
    {
        private readonly TrainsDataContext _context;

        public RoutesController(TrainsDataContext context)
        {
            _context = context;
        }

        public ActionResult Routes()
        {
            var vm = new Models.RouteViewModel()
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

        public ActionResult RoutePointsForRoute(int routeId)
        {
            var vm = new Models.RoutePointViewModel()
            {
                SationsNames = (from station in _context.Stations
                    orderby station.StationId
                    select new SelectListItem()
                    {
                        Text = station.StationName,
                        Value = station.StationName
                    }).ToArray(),
                Configurator = new Configurator<RoutePoint, RoutePointRow>()
                    .Configure()
                    .Url(Url.Action(nameof(HandleRoutePoints), new {routeId}))
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
                                       .DefaultIfEmpty(0)
                                       .Max() + 1
                };
                _context.RoutePoints.Add(routePoint);
            }
            else
            {
                routePoint = _context.RoutePoints
                    .FirstOrDefault(x => x.RouteId == routePointRow.RouteId
                                         && x.StationOrder == routePointRow.StationOrder);
            }

            Station station = _context.Stations.FirstOrDefault(x => x.StationName == routePointRow.StationName);

            if (station == null)
            {
                return latticeData.Adjust(x => x
                    .Message(LatticeMessage.User("failure", "Editing",
                        $"There is no station with name {routePointRow.StationName}"))
                );
            }


            if (_context.RoutePoints.Any(x => x.RouteId == routeId
                                              && x.StationOrder != routePoint.StationOrder
                                              && x.Station.StationId == station.StationId))
            {
                return latticeData.Adjust(x => x
                    .Message(LatticeMessage.User("failure", "Editing",
                        $"The route already has station {station.StationName}"))
                );
            }

            routePoint.Station = station;


            _context.SaveChanges();
            return latticeData.Adjust(x => x
                .Update(routePoint)
                .Message(LatticeMessage.User("success", "Editing", "Route saved"))
            );
        }

        public TableAdjustment RemoveRoutePoint(LatticeData<RoutePoint, RoutePointRow> latticeData)
        {
            var subj = latticeData.CommandSubject();
            if (_context.RoutePoints.Any(x => x.RouteId == subj.RouteId && x.StationOrder == subj.StationOrder + 1))
            {
                return latticeData.Adjust(x => x
                    .Message(LatticeMessage.User("failure", "Remove", "Can not delete point from the middle of route"))
                );
            }

            var routePoint =
                _context.RoutePoints.FirstOrDefault(x => x.RouteId == subj.RouteId
                                                         && x.StationOrder == subj.StationOrder);
            _context.RoutePoints.Remove(routePoint);
            _context.SaveChanges();
            return latticeData.Adjust(x => x
                .Remove(subj)
                .Message(LatticeMessage.User("success", "Remove", "RoutePoint removed"))
            );
        }
    }
}