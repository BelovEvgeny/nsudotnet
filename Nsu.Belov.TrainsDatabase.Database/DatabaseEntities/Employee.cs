using System.ComponentModel.DataAnnotations.Schema;

namespace Nsu.Belov.TrainsDatabase.Database.DatabaseEntities
{
    public class Employee
    {
        public string Name { get; set; }
        public string UserId { get; set; }
        public virtual ApplicationUser ApplicationUser { get; set; }


        public int Age { get; set; }
        public string Phone { get; set; }
        public string Position { get; set; }
        public int? TrainId { get; set; }
        public virtual Train Train { get; set; }
    }
}