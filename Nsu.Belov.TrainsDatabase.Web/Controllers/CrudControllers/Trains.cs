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
        public ActionResult Trains()
        {
            var trainViewModel = new TrainViewModel()
            {
                Configurator = new Configurator<Train, Train>()
                    .Configure()
                    .Url(Url.Action(nameof(HandleTrains)))
            };
            return View(trainViewModel);
        }

        public ActionResult HandleTrains()
        {
            var conf = new Configurator<Train, Train>().Configure();
            var handler = conf.CreateMvcHandler(ControllerContext);
            handler.AddEditHandler(EditTrains);
            handler.AddCommandHandler("Remove", RemoveTrain);
            return handler.Handle(_context.Trains.OrderBy(x => x.TrainId));
        }

        public TableAdjustment EditTrains(LatticeData<Train, Train> latticeData, Train trainRow)
        {
            Train train = _context.Trains
                .FirstOrDefault(x => x.TrainId == trainRow.TrainId);
            if (train == null)
            {
                train = new Train()
                {
                    TrainId = trainRow.TrainId
                };
                _context.Trains.Add(train);
            }

            try
            {
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                return latticeData.Adjust(x => x
                    .Message(LatticeMessage.User("failure", "Editing", $"Save exception: {e.Message}"))
                );
            }

            trainRow.TrainId = train.TrainId;
            return latticeData.Adjust(x => x
                .UpdateRow(trainRow)
                .Message(LatticeMessage.User("success", "Editing", "Train saved"))
            );
        }

        public TableAdjustment RemoveTrain(LatticeData<Train, Train> latticeData)
        {
            var subj = latticeData.CommandSubject();
            var train = _context.Trains.FirstOrDefault(x => x.TrainId == subj.TrainId);
            _context.Trains.Remove(train);
            _context.SaveChanges();
            return latticeData.Adjust(x => x
                .RemoveExact(subj)
                .Message(LatticeMessage.User("success", "Remove", "Station removed"))
            );
        }
    }
}