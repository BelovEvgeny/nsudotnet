using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nsu.Belov.TrainsDatabase.Database
{
    public class Route
    {
        public int RouteId { get; set; }

        public virtual ICollection<RoutePoint> RoutePoints { get; set; }
    }
}