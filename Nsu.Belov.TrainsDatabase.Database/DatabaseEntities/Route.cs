using System.Collections.Generic;

namespace Nsu.Belov.TrainsDatabase.Database.DatabaseEntities
{
    public class Route
    {
        public int RouteId { get; set; }
        public string RouteName { get; set; }
        public virtual ICollection<RoutePoint> RoutePoints { get; set; }
    }
}