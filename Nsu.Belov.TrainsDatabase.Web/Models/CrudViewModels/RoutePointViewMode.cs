using System.Linq;
using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;
using Reinforced.Lattice.Configuration;

namespace Nsu.Belov.TrainsDatabase.Web.Models.CrudViewModels
{
    public class RoutePointViewModel
    {
        public Configurator<RoutePoint, RoutePoint> Configurator { get; set; }
    }

    public static class RoutePointTable
    {
        public static Configurator<RoutePoint, RoutePoint> Configure(
            this Configurator<RoutePoint, RoutePoint> conf)
        {
            conf.DefaultTable();
            conf.PrimaryKey(x => new {x.RouteId, x.StationOrder});
            conf.NotAColumn(x => x.Station);
            conf.NotAColumn(x => x.Route);
            return conf;
        }
    }
}