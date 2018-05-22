using System.Collections.Generic;

namespace Nsu.Belov.TrainsDatabase.Database.DatabaseEntities
{
    public class Train
    {
        public int TrainId { get; set; }

//        public string Category { get; set; }

//        public int Capacity { get; set; } 
        public virtual ICollection<CrewMember> CrewMembers { get; set; }
        public virtual ICollection<Trip> Trips { get; set; }
    }
}