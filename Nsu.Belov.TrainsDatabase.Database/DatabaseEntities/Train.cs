using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nsu.Belov.TrainsDatabase.Database
{
    public class Train
    {
        public int TrainId { get; set; }
        public string Category { get; set; }
        public int Capasity { get; set; }
        public virtual ICollection<CrewMember> CrewMembers { get; set; }
        public virtual ICollection<Voyage> Voyages { get; set; }
    }
}