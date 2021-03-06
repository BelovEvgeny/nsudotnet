﻿using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;
using Reinforced.Lattice.Configuration;

namespace Nsu.Belov.TrainsDatabase.Web.Models.CrudViewModels
{
    public class StationViewModel
    {
        public Configurator<Station, Station> Configurator { get; set; }
    }

    public static class StationTable
    {
        public static Configurator<Station, Station> Configure(this Configurator<Station, Station> conf)
        {
            conf.DefaultTable();
            conf.PrimaryKey(x => x.StationId);
            return conf;
        }
    }
}