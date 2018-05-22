using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;
using Reinforced.Lattice.Configuration;

namespace Nsu.Belov.TrainsDatabase.Web.Models.CrudViewModels
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
}