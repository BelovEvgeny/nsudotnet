using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Nsu.Belov.TrainsDatabase.Database.DatabaseEntities
{
    public class ApplicationUser : IdentityUser
    {
        public ApplicationUser()
        {
           
        }

        public virtual ICollection<Ticket> Tickets { get; set; }

        //        public string FirstName { get; set; }
    }
}
