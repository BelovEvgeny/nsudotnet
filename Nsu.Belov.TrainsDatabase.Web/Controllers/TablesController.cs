using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Nsu.Belov.TrainsDatabase.Web.Controllers
{
    public class TablesController : Controller
    {
        // GET: Tables
        [Authorize(Roles = "operator")]
        public ActionResult Index()
        {
            return View();
        }
    }
}