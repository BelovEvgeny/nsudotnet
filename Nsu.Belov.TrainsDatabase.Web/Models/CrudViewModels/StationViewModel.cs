using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;
using Reinforced.Lattice.Configuration;

namespace Nsu.Belov.TrainsDatabase.Web.Models.CrudViewModels
{
    public class StationViewModel
    {
        public Configurator<Station, StationRow> Configurator { get; set; }
    }

    public class StationRow
    {
        public int StationId { get; set; }
        public string StationName { get; set; }
    }

    public static class StationTable
    {
        public static Configurator<Station, StationRow> Configure(this Configurator<Station, StationRow> conf)
        {
            conf.DefaultTable();
            conf.PrimaryKey(x => x.StationId);
            return conf;
        }
    }
}