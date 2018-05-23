using System.Linq;
using System.Web.Mvc;
using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;
using Reinforced.Lattice.Configuration;

namespace Nsu.Belov.TrainsDatabase.Web.Models
{
    public class RouteViewModel
    {
        public Configurator<Route, RouteRow> Configurator { get; set; }
    }

    public class RouteRow
    {
        public int RouteId { get; set; }
        public string RouteName { get; set; }
    }

    public static class RouteTable
    {
        public static Configurator<Route, RouteRow> Configure(this Configurator<Route, RouteRow> conf)
        {
            conf.DefaultTable();
            conf.PrimaryKey(x => x.RouteId);
            return conf;
        }
    }

    public class RoutePointViewModel
    {
        public SelectListItem[] SationsNames;
        public Configurator<RoutePoint, RoutePointRow> Configurator { get; set; }
    }

    public class RoutePointRow
    {
        public int RouteId { get; set; }
        public int StationOrder { get; set; }
        public int StationId { get; set; }
        public string StationName { get; set; }
    }

    public static class RoutePointTable
    {
        public static Configurator<RoutePoint, RoutePointRow> Configure(
            this Configurator<RoutePoint, RoutePointRow> conf)
        {
            conf.DefaultTable();
            conf.Column(x => x.StationId).DataOnly();
            conf.PrimaryKey(x => new { x.RouteId, x.StationOrder });
            conf.ProjectDataWith(x => x.Select(rp => new RoutePointRow()
            {
                RouteId = rp.RouteId,
                StationOrder = rp.StationOrder,
                StationId = rp.StationId,
                StationName = rp.Station.StationName
            }));
            return conf;
        }
    }
}