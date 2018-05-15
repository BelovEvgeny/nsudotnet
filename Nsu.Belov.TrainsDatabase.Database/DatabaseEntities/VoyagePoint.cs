using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nsu.Belov.TrainsDatabase.Database
{
    public class VoyagePoint
    {
        [Key]
        [ForeignKey("Voyage")]
        [Column(Order = 0)]
        public int VoyageId { get; set; }

        [Key]
        [Column(Order = 1)]
        public int StationOrder { get; set; }

        public Voyage Voyage { get; set; }

        public DateTime DepartureTime { get; set; }

        public Delay Delay{ get; set; }
    }
}
