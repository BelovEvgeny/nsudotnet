using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nsu.Belov.TrainsDatabase.Database.DatabaseEntities
{
    public class RoutePoint
    {
        public int RouteId { get; set; }
       
        public int StationOrder { get; set; }

        public virtual Route Route { get; set; }

        public virtual Station Station { get; set; }

        public int StationId { get; set; }
    }
}