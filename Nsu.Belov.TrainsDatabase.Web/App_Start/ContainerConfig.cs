using System.Web;
using Autofac;
using Autofac.Integration.Mvc;
using Microsoft.AspNet.Identity.EntityFramework;
using Nsu.Belov.TrainsDatabase.Database;
using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;
using Nsu.Belov.TrainsDatabase.Web.Auth;

namespace Nsu.Belov.TrainsDatabase.Web
{
    public static class ContainerConfig
    {
        public static void ConfigureContainer(ContainerBuilder cb)
        {
            cb.RegisterControllers(typeof(ContainerConfig).Assembly);

            cb.RegisterType<TrainsDataContext>()
                .AsSelf()
                .AsImplementedInterfaces()
                .InstancePerRequest();

            cb.Register(c => new UserStore<ApplicationUser>(c.Resolve<TrainsDataContext>()))
                .AsSelf()
                .AsImplementedInterfaces()
                .InstancePerRequest();

            cb.Register(c => new RoleStore<IdentityRole>(c.Resolve<TrainsDataContext>()))
                .AsSelf()
                .AsImplementedInterfaces()
                .InstancePerRequest();

            cb.RegisterType<TrainsUserManager>()
                .AsSelf()
                .AsImplementedInterfaces()
                .InstancePerRequest();

            cb.RegisterType<TrainsSignInManager>()
                .AsSelf()
                .AsImplementedInterfaces()
                .InstancePerRequest();

            cb.RegisterType<TrainsRoleManager>()
                .AsSelf()
                .AsImplementedInterfaces()
                .InstancePerRequest();

            cb.Register(c => HttpContext.Current.GetOwinContext().Authentication);
        }
    }
}