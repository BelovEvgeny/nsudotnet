using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nsu.Belov.TrainsDatabase.Database.DatabaseEntities
{
    public class Delay
    {
        public int TripId { get; set; }

        public int StationOrder { get; set; }

        public TripPoint TripPoint { get; set; }

        public int MinutesDelaySpan { get; set; }
    }
}