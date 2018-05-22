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
                Configurator = new Configurator<Station, StationRow>()
                    .Configure()
                    .Url(Url.Action(nameof(HandleStations)))
            };
            return View(stationViewModel);
        }

        public ActionResult HandleStations()
        {
            var conf = new Configurator<Station, StationRow>().Configure();
            var handler = conf.CreateMvcHandler(ControllerContext);
            handler.AddEditHandler(EditStaton);
            handler.AddCommandHandler("Remove", RemoveStation);
            return handler.Handle(_context.Stations.OrderBy(x => x.StationId));
        }

        public TableAdjustment EditStaton(LatticeData<Station, StationRow> latticeData, StationRow stationRow)
        {
            Station station;
            if (stationRow.StationId == 0)
            {
                station = new Station();
                _context.Stations.Add(station);
            }
            else
            {
                station = _context.Stations
                    .FirstOrDefault(x => x.StationId == stationRow.StationId);
            }

            station.StationName = stationRow.StationName;
            _context.SaveChanges();
            stationRow.StationId = station.StationId;
            return latticeData.Adjust(x => x
                .Update(stationRow)
                .Message(LatticeMessage.User("success", "Editing", "Station saved"))
            );
        }

        public TableAdjustment RemoveStation(LatticeData<Station, StationRow> latticeData)
        {
            var subj = latticeData.CommandSubject();
            var station = _context.Stations.FirstOrDefault(x => x.StationId == subj.StationId);
            _context.Stations.Remove(station);
            _context.SaveChanges();
            return latticeData.Adjust(x => x
                .Remove(subj)
                .Message(LatticeMessage.User("success", "Remove", "Station removed"))
            );
        }
    }
}