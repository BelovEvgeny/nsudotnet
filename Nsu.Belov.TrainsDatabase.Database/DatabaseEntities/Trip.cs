using System.Collections.Generic;

namespace Nsu.Belov.TrainsDatabase.Database.DatabaseEntities
{
    public class Trip
    {
        public int TripId { get; set; }
        public virtual Route Route { get; set; }
        public int RouteId { get; set; }
        public virtual Train Train { get; set; }

        public int TrainId { get; set; }

        public virtual ICollection<TripPoint> TripPoints { get; set; }

        public virtual ICollection<Ticket> Tickets { get; set; }
    }
}