using System;
using System.Collections.Generic;

namespace Nsu.Belov.TrainsDatabase.Database.DatabaseEntities
{
    public class TripPoint
    {
        /*[Key]
          [ForeignKey("Trip")]
          [Column(Order = 0)]*/
        public int TripId { get; set; }

        /*[Key]
          [Column(Order = 1)]*/
        public int StationOrder { get; set; }
        public Trip Trip { get; set; }
        public DateTime? ArrivalTime { get; set; }
        public DateTime? DepartureTime { get; set; }

        public int FirstClassSeats { get; set; }

        public int SecondClassSeats { get; set; }

        public Delay Delay { get; set; }

        public virtual ICollection<Ticket> TicketsFromHere { get; set; }
        public virtual ICollection<Ticket> TicketsToHere { get; set; }
    }
}