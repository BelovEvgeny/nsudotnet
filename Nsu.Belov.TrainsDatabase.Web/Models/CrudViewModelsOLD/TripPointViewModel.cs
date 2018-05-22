using System.Linq;
using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;
using Reinforced.Lattice.Configuration;

namespace Nsu.Belov.TrainsDatabase.Web.Models.CrudViewModels
{
    public class TripPointViewModel
    {
        public Configurator<TripPoint, TripPoint> Configurator { get; set; }
    }

    public static class TripPointTable
    {
        public static Configurator<TripPoint, TripPoint> Configure(
            this Configurator<TripPoint, TripPoint> conf)
        {
            conf.DefaultTable();
            conf.PrimaryKey(x => new {x.TripId, x.StationOrder});
            conf.NotAColumn(c => c.Delay);
            conf.NotAColumn(c => c.TicketsFromHere);
            conf.NotAColumn(c => c.TicketsToHere);
            return conf;
        }
    }
}