using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nsu.Belov.TrainsDatabase.Database
{
    public class Voyage
    {
        public int VoyageId { get; set; }
        public Route Route { get; set; }        
        public Train Train { get; set; }

        public virtual ICollection<VoyagePoint> VoyagePoints { get; set; }
    }
}