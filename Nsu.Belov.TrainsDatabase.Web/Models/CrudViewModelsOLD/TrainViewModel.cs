using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;
using Reinforced.Lattice.Configuration;

namespace Nsu.Belov.TrainsDatabase.Web.Models.CrudViewModels
{
    public class TrainViewModel
    {
        public Configurator<Train, TrainRow> Configurator { get; set; }
    }

    public class TrainRow
    {
        public int TrainId { get; set; }
        
//        public int Capacity { get; set; }
    }

    public static class TrainTable
    {
        public static Configurator<Train, TrainRow> Configure(this Configurator<Train, TrainRow> conf)
        {
            conf.DefaultTable();
            conf.PrimaryKey(x => x.TrainId);
            return conf;
        }
    }
}