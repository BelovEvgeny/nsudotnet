using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nsu.Belov.TrainsDatabase.Database
{
    public class RoutePoint
    {
        [Key]
        [ForeignKey("Route")]
        [Column(Order = 0)]
        public int RouteId { get; set; }

        [Key]
        [Column(Order = 1)]
        public int StationOrder { get; set; }

        public Route Route { get; set; }

        public Station Station { get; set; }
    }
}