using Autofac;
using Autofac.Integration.Mvc;
using Nsu.Belov.TrainsDatabase.Database;

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
        }
    }
}