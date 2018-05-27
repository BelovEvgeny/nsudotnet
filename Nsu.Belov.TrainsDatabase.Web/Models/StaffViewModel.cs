using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web.Mvc;
using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;
using Reinforced.Lattice.Configuration;

namespace Nsu.Belov.TrainsDatabase.Web.Models
{
    public class StaffViewModel
    {
        public SelectListItem[] Roles { get; set; }
        public Configurator<Employee, EmployeeRow> Configurator { get; set; }
    }

    public class EmployeeRow
    {
        public string UserId { get; set; }
        public string Login { get; set; }
        public int Age { get; set; }
        public string Name { get; set; }
        public string Position { get; set; }
        public string Phone { get; set; }
        public int? TrainId { get; set; }

        //  public string Roles { get; set; }
    }

    public class NewEmployeeViewModel
    {
        public SelectListItem[] TrainsIds { get; set; }
        [Required] public string Login { get; set; }
        [Required] public string Password { get; set; }
        public int Age { get; set; }
        [Required] public string Name { get; set; }
        public string Phone { get; set; }
        [Required] public string Position { get; set; }
        public int? TrainId { get; set; }
    }

    /*conf.Command("AddToRoles", x => x.Window<AddToRoleCommandViewModel>("addToRole","#ltcModal",w =>
    {
        w.AutoForm(a =>
        {
            a.EditSelectList(d => d.TargetRole).FakeColumn(d=>d.Title("Role")).Items(Model.AllRoles);
        });
    }));

    conf.Toolbar("toolbar-rt", d =>
    {
        d.AddCommandButton("Assign roles", "AddToRoles").DisableIfNothingChecked();
    });*/

    public static class StaffTable
    {
        public static Configurator<Employee, EmployeeRow> Configure(this Configurator<Employee, EmployeeRow> conf)
        {
            conf.DefaultTable();
            conf.PrimaryKey(x => x.UserId);
            conf.ProjectDataWith(e => from employee in e
                select new EmployeeRow()
                {
                    TrainId = employee.TrainId,
                    UserId = employee.UserId,
                    Position = employee.Position,
                    Age = employee.Age,
                    Name = employee.Name,
                    Login = employee.ApplicationUser.UserName,
                    Phone = employee.Phone
                });
            return conf;
        }
    }

    public class TargetRoleCommandViewModel
    {
        public string TargetRole { get; set; }
    }
}