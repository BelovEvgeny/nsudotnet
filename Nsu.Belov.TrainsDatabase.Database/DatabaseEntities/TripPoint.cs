using System;
using System.Collections.Generic;

namespace Nsu.Belov.TrainsDatabase.Database.DatabaseEntities
{
    public class TripPoint
    {
        public int TripId { get; set; }
        public int StationOrder { get; set; }
        public virtual Trip Trip { get; set; }
        public DateTime? ArrivalTime { get; set; }
        public DateTime? DepartureTime { get; set; }
        public virtual Delay Delay { get; set; }

        public virtual ICollection<Ticket> TicketsFromHere { get; set; }
        public virtual ICollection<Ticket> TicketsToHere { get; set; }
    }
}