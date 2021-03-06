﻿using System;
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

        public ActionResult RoutePoints()
        {
            var vm = new RoutePointViewModel()
            {
                Configurator = new Configurator<RoutePoint, RoutePoint>()
                    .Configure()
                    .Url(Url.Action(nameof(HandleRoutePoints)))
            };
            return View(vm);
        }

        public ActionResult HandleRoutePoints()
        {
            var conf = new Configurator<RoutePoint, RoutePoint>().Configure();
            var handler = conf.CreateMvcHandler(ControllerContext);
            handler.AddEditHandler(EditRoutePoint);
            handler.AddCommandHandler("Remove", RemoveRoutePoint);
            var routePoints = _context.RoutePoints
                .OrderBy(x => x.StationOrder);
            return handler.Handle(routePoints);
        }


        public TableAdjustment EditRoutePoint(LatticeData<RoutePoint, RoutePoint> latticeData,
            RoutePoint routePointRow)
        {
        RoutePoint routePoint = _context.RoutePoints
            .FirstOrDefault(x => x.RouteId == routePointRow.RouteId
                                 && x.StationOrder == routePointRow.StationOrder);

       
            if (routePoint == null)
            {
                routePoint = new RoutePoint
                {
                    RouteId = routePointRow.RouteId,
                    StationOrder = routePointRow.StationOrder
                };
                _context.RoutePoints.Add(routePoint);
            }
            else
            {
                routePoint = _context.RoutePoints
                    .FirstOrDefault(x =>
                        x.RouteId == routePointRow.RouteId && x.StationOrder == routePointRow.StationOrder);
            }
            

            try
            {
                routePoint.StationId = routePointRow.StationId;
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                return latticeData.Adjust(x => x
                    .Message(LatticeMessage.User("failure", "Editing", $"Save exception: {e.Message}"))
                );
            }
            return latticeData.Adjust(x => x
                .UpdateRow(routePointRow)
                .Message(LatticeMessage.User("success", "Editing", "RoutePoint saved"))
            );
        }

        public TableAdjustment RemoveRoutePoint(LatticeData<RoutePoint, RoutePoint> latticeData)
        {
            var subj = latticeData.CommandSubject();
            var routePoint =
                _context.RoutePoints.FirstOrDefault(x =>
                    x.RouteId == subj.RouteId && x.StationOrder == subj.StationOrder);
            _context.RoutePoints.Remove(routePoint);
            _context.SaveChanges();
            return latticeData.Adjust(x => x
                .RemoveExact(subj)
                .Message(LatticeMessage.User("success", "Remove", "RoutePoint removed"))
            );
        }
    }
}