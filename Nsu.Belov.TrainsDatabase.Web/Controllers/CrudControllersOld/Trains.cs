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
                Configurator = new Configurator<Train, TrainRow>()
                    .Configure()
                    .Url(Url.Action(nameof(HandleTrains)))
            };
            return View(trainViewModel);
        }

        public ActionResult HandleTrains()
        {
            var conf = new Configurator<Train, TrainRow>().Configure();
            var handler = conf.CreateMvcHandler(ControllerContext);
            handler.AddEditHandler(EditTrains);
            handler.AddCommandHandler("Remove", RemoveTrain);
            return handler.Handle(_context.Trains.OrderBy(x => x.TrainId));
        }

        public TableAdjustment EditTrains(LatticeData<Train, TrainRow> latticeData, TrainRow trainRow)
        {
            Train train;
            if (trainRow.TrainId == 0)
            {
                train = new Train();
                _context.Trains.Add(train);
            }
            else
            {
                train = _context.Trains
                    .FirstOrDefault(x => x.TrainId == trainRow.TrainId);
            }

            // train.Capacity = trainRow.Capacity;
//            train.Category = trainRow.Category;
            _context.SaveChanges();
            trainRow.TrainId = train.TrainId;
            return latticeData.Adjust(x => x
                .Update(trainRow)
                .Message(LatticeMessage.User("success", "Editing", "Train saved"))
            );
        }

        public TableAdjustment RemoveTrain(LatticeData<Train, TrainRow> latticeData)
        {
            var subj = latticeData.CommandSubject();
            var train = _context.Trains.FirstOrDefault(x => x.TrainId == subj.TrainId);
            _context.Trains.Remove(train);
            _context.SaveChanges();
            return latticeData.Adjust(x => x
                .Remove(subj)
                .Message(LatticeMessage.User("success", "Remove", "Station removed"))
            );
        }
    }
}