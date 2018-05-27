using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Nsu.Belov.TrainsDatabase.Database.Auth;
using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;


namespace Nsu.Belov.TrainsDatabase.Database.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<TrainsDataContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(Nsu.Belov.TrainsDatabase.Database.TrainsDataContext context)
        {
            UserStore<ApplicationUser> userStore = new UserStore<ApplicationUser>(context);
            RoleStore<IdentityRole> roleStore = new RoleStore<IdentityRole>(context);
            TrainsUserManager userManager = new TrainsUserManager(userStore);
            TrainsRoleManager roleManager = new TrainsRoleManager(roleStore);

            IdentityRole adminRole = context.Roles.FirstOrDefault(x => x.Name == "admin");
            if (adminRole == null)
            {
                roleManager.Create(new IdentityRole("admin"));
            }

            IdentityRole operatorRole = context.Roles.FirstOrDefault(x => x.Name == "operator");
            if (operatorRole == null)
            {
                roleManager.Create(new IdentityRole("operator"));
            }

            ApplicationUser admin = context.Users.FirstOrDefault(u => u.UserName == "admin");

            if (admin == null)
            {
                admin = new ApplicationUser()
                {
                    UserName = "admin"
                };
                userManager.Create(admin, "admin1");
                //незнаю можно ли не сохраная контекст достать еще раз через него
                admin = userManager.FindByName("admin");
            }

            userManager.AddToRole(admin.Id, "admin");
            userManager.AddToRole(admin.Id, "operator");
        }


        //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
        //  to avoid creating duplicate seed data.
    }
}