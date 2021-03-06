﻿using System;
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
                Configurator = new Configurator<Route, Route>()
                    .Configure()
                    .Url(Url.Action(nameof(HandleRoutes)))
            };
            return View(vm);
        }

        public ActionResult HandleRoutes()
        {
            var conf = new Configurator<Route, Route>().Configure();
            var handler = conf.CreateMvcHandler(ControllerContext);
            handler.AddEditHandler(EditRoute);
            handler.AddCommandHandler("Remove", RemoveRoute);
            return handler.Handle(_context.Routes.OrderBy(x => x.RouteId));
        }

        public TableAdjustment EditRoute(LatticeData<Route, Route> latticeData, Route routeRow)
        {
            Route route = _context.Routes.FirstOrDefault(x => x.RouteId == routeRow.RouteId);
            if (route == null)
            {
                route = new Route()
                {
                    RouteId = routeRow.RouteId
                };
                _context.Routes.Add(route);
            }
            else
            {
                route = _context.Routes
                    .FirstOrDefault(x => x.RouteId == routeRow.RouteId);
            }

            try
            {
                route.RouteName = routeRow.RouteName;
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                return latticeData.Adjust(x => x
                    .Message(LatticeMessage.User("failure", "Editing", $"Save exception: {e.Message}"))
                );
            }
            routeRow.RouteId = route.RouteId;
            return latticeData.Adjust(x => x
                .UpdateRow(routeRow)
                .Message(LatticeMessage.User("success", "Editing", "Route saved"))
            );
        }

        public TableAdjustment RemoveRoute(LatticeData<Route, Route> latticeData)
        {
            var subj = latticeData.CommandSubject();
            var route = _context.Routes.FirstOrDefault(x => x.RouteId == subj.RouteId);
            _context.Routes.Remove(route);
            _context.SaveChanges();
            return latticeData.Adjust(x => x
                .RemoveExact(subj)
                .Message(LatticeMessage.User("success", "Remove", "Route removed"))
            );
        }
    }
}