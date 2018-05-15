using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nsu.Belov.TrainsDatabase.Database
{
    public class Delay
    {
        [Key]
        [ForeignKey("VoyagePoint")]
        [Column(Order = 0)]
        public int VoyageId { get; set; }

        [Key]
        [ForeignKey("VoyagePoint")]
        [Column(Order = 1)]
        public int StationOrder { get; set; }

        public VoyagePoint VoyagePoint { get; set; }

        public TimeSpan DelaySpan { get; set; }
    }
}