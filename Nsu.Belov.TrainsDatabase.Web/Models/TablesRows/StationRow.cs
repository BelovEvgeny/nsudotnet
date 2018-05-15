using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nsu.Belov.TrainsDatabase.Database;
using Reinforced.Lattice.Configuration;

namespace Nsu.Belov.TrainsDatabase.Web.Models.TablesRows
{
    public class StationRow
    {
        public int StationId { get; set; }
        public string StationName { get; set; }
    }
    public class StationViewModel
    {
      public Configurator<Station, StationRow> Table { get; set; }
    }

    public static class StationTable
    {
        public static Configurator<Station, StationRow> Configure(this Configurator<Station, StationRow> conf)
        {
            conf.Column(c => c.StationId).Title("Id");
            conf.Column(c => c.StationName).Title("Station Name");
            return conf;
        }
    }

}