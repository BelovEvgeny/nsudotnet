using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nsu.Belov.TrainsDatabase.Database.DatabaseEntities
{
    public class Ticket
    {
        public int TicketId { get; set; }
        public int TripId { get; set; }
        public int StartStationOrder { get; set; }
        public int EndStationOrder { get; set; }

        public SeatsType SeatsType { get; set; }

        public virtual TripPoint FromTripPoint { get; set; }

        public virtual TripPoint ToTripPoint { get; set; }
    }
}