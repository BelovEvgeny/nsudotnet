﻿using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;
using Reinforced.Lattice.Configuration;

namespace Nsu.Belov.TrainsDatabase.Web.Models.CrudViewModels
{
    public class RouteViewModel
    {
        public Configurator<Route, Route> Configurator { get; set; }
    }
   

    public static class RouteTable
    {
        public static Configurator<Route, Route> Configure(this Configurator<Route, Route> conf)
        {
            conf.DefaultTable();
            conf.PrimaryKey(x => x.RouteId);
            conf.NotAColumn(x=>x .RoutePoints);
            return conf;
        }
    }
}