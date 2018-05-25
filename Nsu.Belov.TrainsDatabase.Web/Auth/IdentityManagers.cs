using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;

namespace Nsu.Belov.TrainsDatabase.Web.Auth
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

    public class TrainsSignInManager : SignInManager<ApplicationUser, string>
    {
        public TrainsSignInManager(TrainsUserManager userManager, IAuthenticationManager authenticationManager)
            : base(userManager, authenticationManager)
        {
        }
    }
}