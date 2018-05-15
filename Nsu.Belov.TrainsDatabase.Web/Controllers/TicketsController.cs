using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Web;
using System.Web.Mvc;
using Nsu.Belov.TrainsDatabase.Database;
using Nsu.Belov.TrainsDatabase.Web.Models;
using Nsu.Belov.TrainsDatabase.Web.Models.TablesRows;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Mvc;

namespace Nsu.Belov.TrainsDatabase.Web.Controllers
{
    public class TicketsController : Controller
    {
        private readonly TrainsDataContext _context;

        public TicketsController(TrainsDataContext context)
        {
            _context = context;
        }

        // GET: Station
        public ActionResult Index()
        {
//            var stationViewModel = new StationViewModel()
//            {
//                Table = new Configurator<Station, StationRow>()
//                    .Configure()
//                    .Url(Url.Action("HandleTable"))
//            };
            return null;
        }

        public ActionResult HandleTable()
        {
            var conf = new Configurator<Station, StationRow>().Configure();
            var handler = conf.CreateMvcHandler(ControllerContext);
            return handler.Handle(_context.Stations.OrderBy(x => x.StationId));
        }

        public ActionResult SelectTicket()
        {
            SelectTicketViewModel stvm = new SelectTicketViewModel()
            {
                StationNames = _context.Stations.Select(x => new SelectListItem()
                    {
                        Text = x.StationName
                    }
                )
            };
            return View(stvm);
        }

        public ActionResult BuyTicket(string fromStation)
        {
            var vm = new BuyTicketViewModel()
            {
                FromStation = fromStation
            };
            return View(vm);
        }
    }
}