using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Nsu.Belov.TrainsDatabase.Web.Models
{
    public class SelectTicketViewModel
    {
      //  public string FromStation { get; set; }

       // public string ToStation { get; set; }

        public IEnumerable<SelectListItem> StationNames { get; set; }
    }
}