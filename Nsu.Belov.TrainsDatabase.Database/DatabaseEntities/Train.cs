using System.Collections.Generic;

namespace Nsu.Belov.TrainsDatabase.Database.DatabaseEntities
{
    public class Train
    {
        public int TrainId { get; set; }
        public int FirstClassCapacity { get; set; } 
        public int SecondClassCapacity { get; set; } 
        public virtual ICollection<CrewMember> CrewMembers { get; set; }
        public virtual ICollection<Trip> Trips { get; set; }
    }
}