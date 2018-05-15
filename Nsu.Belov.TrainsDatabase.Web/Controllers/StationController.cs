using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Nsu.Belov.TrainsDatabase.Database;
using Nsu.Belov.TrainsDatabase.Web.Models.TablesRows;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Mvc;

namespace Nsu.Belov.TrainsDatabase.Web.Controllers
{
    public class StationController : Controller
    {
        private readonly TrainsDataContext _context;

        public StationController(TrainsDataContext context)
        {
            _context = context;
        }

        // GET: Station
        public ActionResult Index()
        {
            var stationViewModel = new StationViewModel()
            {
                Table = new Configurator<Station, StationRow>()
                    .Configure()
                    .Url(Url.Action("HandleTable"))
            };
            return View(stationViewModel);
        }

        public ActionResult HandleTable()
        {
            // First, create our configurator and configure it
            // (we do not set .Url as it is not needed anymore)
            var conf = new Configurator<Station, StationRow>().Configure();
            // Then, create MVC handler from our configurator
            var handler = conf.CreateMvcHandler(ControllerContext);
            // Call handler.Handle - it will return necessary ActionResult
            return handler.Handle(_context.Stations.OrderBy(x => x.StationId));
        }
    }
}