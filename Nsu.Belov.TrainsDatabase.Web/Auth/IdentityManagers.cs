using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Nsu.Belov.TrainsDatabase.Database.Auth;
using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;

namespace Nsu.Belov.TrainsDatabase.Web.Auth
{

    public class TrainsSignInManager : SignInManager<ApplicationUser, string>
    {
        public TrainsSignInManager(TrainsUserManager userManager, IAuthenticationManager authenticationManager)
            : base(userManager, authenticationManager)
        {
        }
    }
}