using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;
using Reinforced.Lattice.Configuration;

namespace Nsu.Belov.TrainsDatabase.Web.Models.CrudViewModels
{
    public class TrainViewModel
    {
        public Configurator<Train, Train> Configurator { get; set; }
    }

   
    public static class TrainTable
    {
        public static Configurator<Train, Train> Configure(this Configurator<Train, Train> conf)
        {
            conf.DefaultTable();
            conf.PrimaryKey(x => x.TrainId);
            conf.NotAColumn(train => train.Employees);
            conf.NotAColumn(train => train.Trips);
            return conf;
        }
    }
}