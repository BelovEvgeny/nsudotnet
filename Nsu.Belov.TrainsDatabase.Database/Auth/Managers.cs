using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;

namespace Nsu.Belov.TrainsDatabase.Database.Auth
{
    public class TrainsUserManager : UserManager<ApplicationUser>
    {
        public TrainsUserManager(IUserStore<ApplicationUser> store) : base(store)
        {
        }
    }

    public class TrainsRoleManager : RoleManager<IdentityRole>
    {
        public TrainsRoleManager(IRoleStore<IdentityRole, string> store) : base(store)
        {
        }
    }
}