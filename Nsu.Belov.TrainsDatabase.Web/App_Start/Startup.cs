using System;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Nsu.Belov.TrainsDatabase.Web;
using Owin;

[assembly: OwinStartup(typeof(Startup))]

namespace Nsu.Belov.TrainsDatabase.Web
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCookieAuthentication(new CookieAuthenticationOptions()
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                CookieName = "auth2",
                LoginPath = new PathString("/Auth/Login"),
                LogoutPath = new PathString("/Auth/Logout"),
                SlidingExpiration = true,
                ExpireTimeSpan = TimeSpan.FromHours(2),
                ReturnUrlParameter = "returnUrl"
            });
        }
    }
}