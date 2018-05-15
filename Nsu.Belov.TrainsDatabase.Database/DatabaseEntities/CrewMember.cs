using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nsu.Belov.TrainsDatabase.Database
{
    public class CrewMember
    {
        public int CrewMemberId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }
        public string Phone { get; set; }
        public string Function { get; set; }
        public Train Train { get; set; }
    }
}
