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
        public ActionResult Stations()
        {
            var stationViewModel = new StationViewModel()
            {
                Configurator = new Configurator<Station, Station>()
                    .Configure()
                    .Url(Url.Action(nameof(HandleStations)))
            };
            return View(stationViewModel);
        }

        public ActionResult HandleStations()
        {
            var conf = new Configurator<Station, Station>().Configure();
            var handler = conf.CreateMvcHandler(ControllerContext);
            handler.AddEditHandler(EditStaton);
            handler.AddCommandHandler("Remove", RemoveStation);
            return handler.Handle(_context.Stations.OrderBy(x => x.StationId));
        }

        public TableAdjustment EditStaton(LatticeData<Station, Station> latticeData, Station stationRow)
        {
            Station station = _context.Stations
                .FirstOrDefault(x => x.StationId == stationRow.StationId);
            if (station == null)
            {
                station = new Station()
                {
                    StationId = stationRow.StationId
                };
                _context.Stations.Add(station);
            }

            try
            {
                station.StationName = stationRow.StationName;
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                return latticeData.Adjust(x => x
                    .Message(LatticeMessage.User("failure", "Editing", $"Save exception: {e.Message}"))
                );
            }

            stationRow.StationId = station.StationId;
            return latticeData.Adjust(x => x
                .UpdateRow(stationRow)
                .Message(LatticeMessage.User("success", "Editing", "Station saved"))
            );
        }

        public TableAdjustment RemoveStation(LatticeData<Station, Station> latticeData)
        {
            var subj = latticeData.CommandSubject();
            var station = _context.Stations.FirstOrDefault(x => x.StationId == subj.StationId);
            _context.Stations.Remove(station);
            _context.SaveChanges();
            return latticeData.Adjust(x => x
                .RemoveExact(subj)
                .Message(LatticeMessage.User("success", "Remove", "Station removed"))
            );
        }
    }
}