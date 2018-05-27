using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.Ajax.Utilities;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;
using Nsu.Belov.TrainsDatabase.Database;
using Nsu.Belov.TrainsDatabase.Database.Auth;
using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;
using Nsu.Belov.TrainsDatabase.Web.Auth;
using Nsu.Belov.TrainsDatabase.Web.Models;
using Nsu.Belov.TrainsDatabase.Web.Models.CrudViewModels;
using Reinforced.Lattice;
using Reinforced.Lattice.Adjustments;
using Reinforced.Lattice.Commands;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Editing;
using Reinforced.Lattice.Mvc;
using Reinforced.Lattice.Processing;

namespace Nsu.Belov.TrainsDatabase.Web.Controllers
{
    public class StaffController : Controller
    {
        private readonly TrainsDataContext _context;
        private readonly TrainsUserManager _userManager;

        public StaffController(TrainsDataContext context, TrainsUserManager userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [Authorize(Roles = "admin")]
        public ActionResult Index()
        {
            var vm = new StaffViewModel()
            {
                TrainsIds = GetTrainsIds(),
            Roles = _context.Roles.Select(role => new SelectListItem()
                {
                    Value = role.Name,
                    Text = role.Name
                }).ToArray(),
                Configurator = new Configurator<Employee, EmployeeRow>()
                    .Configure()
                    .Url(Url.Action(nameof(HandleEmployee)))
            };
            return View(vm);
        }

        public ActionResult HandleEmployee()
        {
            var conf = new Configurator<Employee, EmployeeRow>().Configure();
            var handler = conf.CreateMvcHandler(ControllerContext);
            handler.AddEditHandler(EditEmployee);
            handler.AddCommandHandler("Remove", RemoveEmployee);
            handler.AddCommandHandler("AddRole", AddRole);
            handler.AddCommandHandler("RemoveRole", RemoveRole);
            return handler.Handle(_context.Employees);
        }


        [HttpGet]
        [Authorize(Roles = "admin")]
        public ActionResult AddNewEmployee()
        {
            NewEmployeeViewModel model = new NewEmployeeViewModel()
            {
                TrainsIds = GetTrainsIds()
            };
            return View(model);
        }

        private SelectListItem[] GetTrainsIds()
        {
            var trainsIds = _context.Trains.Select(x => new SelectListItem()
            {
                Value = x.TrainId.ToString(),
                Text = x.TrainId.ToString()
            }).ToArray();
            return new[]
            {
                new SelectListItem()
                {
                    Value = null,
                    Text = "Не выбранно",
                    Selected = true
                }
            }.Concat(trainsIds).ToArray();
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public ActionResult AddNewEmployee(NewEmployeeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                model.TrainsIds = GetTrainsIds();
                return View(model);
            }

            var user = new ApplicationUser()
            {
                UserName = model.Login
            };

            var r = _userManager.Create(user, model.Password);
            if (!r.Succeeded)
            {
                int t = 0;
                foreach (var e in r.Errors)
                {
                    ModelState.AddModelError("auth" + t++, e);
                }

                model.TrainsIds = GetTrainsIds();
                return View(model);
            }

            Employee employee = new Employee()
            {
                Name = model.Name,
                Age = model.Age,
                Phone = model.Phone,
                TrainId =model.TrainId,
                UserId = user.Id,
                Position = model.Position
            };
            try
            {
                _context.Employees.Add(employee);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                ModelState.AddModelError("employee", e);
                model.TrainsIds = GetTrainsIds();
                return View(model);
            }

            return RedirectToAction("Index");
        }

        public TableAdjustment EditEmployee(LatticeData<Employee, EmployeeRow> latticeData, EmployeeRow employeeRow)
        {
            if (string.IsNullOrEmpty(employeeRow.UserId))
            {
                return latticeData.Adjust(x => x
                    .Message(LatticeMessage.User("failure", "Editing", "Can not create create new employee from here"))
                );
            }

            Employee employee = _context.Employees
                .FirstOrDefault(x => x.UserId == employeeRow.UserId);
            if (employee == null)
            {
                return latticeData.Adjust(x => x
                    .Message(LatticeMessage.User("failure", "Editing", "Can not find employee"))
                );
            }

            employee.Name = employeeRow.Name;
            employee.TrainId = employeeRow.TrainId;
            employee.Age = employeeRow.Age;
            employee.Position = employeeRow.Position;
            _context.SaveChanges();
            return latticeData.Adjust(x => x
                .Update(employeeRow)
                .Message(LatticeMessage.User("success", "Editing", "Employee saved"))
            );
        }

        public TableAdjustment RemoveEmployee(LatticeData<Employee, EmployeeRow> latticeData)
        {
            var subj = latticeData.CommandSubject();
            var employee = _context.Employees.FirstOrDefault(x => x.UserId == subj.UserId);
            _userManager.Delete(employee.ApplicationUser);
            //_context.Employees.Remove(employee); удаляеться из за зависимости от usera
            // _context.SaveChanges();
            return latticeData.Adjust(x => x
                .Remove(subj)
                .Message(LatticeMessage.User("success", "Remove", "Employee removed"))
            );
        }

        public TableAdjustment AddRole(LatticeData<Employee, EmployeeRow> latticeData)
        {
            var comandModel = latticeData.CommandConfirmation<TargetRoleCommandViewModel>();
            var subj = latticeData.CommandSubject();
            var employee = _context.Employees.FirstOrDefault(x => x.UserId == subj.UserId);
            _userManager.AddToRole(employee.UserId, comandModel.TargetRole);
            return latticeData.Adjust(x => x
                .Message(LatticeMessage.User("success", "Remove", "Role was added"))
            );
        }

        public TableAdjustment RemoveRole(LatticeData<Employee, EmployeeRow> latticeData)
        {
            var comandModel = latticeData.CommandConfirmation<TargetRoleCommandViewModel>();
            var subj = latticeData.CommandSubject();
            var employee = _context.Employees.FirstOrDefault(x => x.UserId == subj.UserId);
            _userManager.RemoveFromRole(employee.UserId, comandModel.TargetRole);
            return latticeData.Adjust(x => x
                .Message(LatticeMessage.User("success", "Remove", "Role was removed"))
            );
        }

        [Authorize(Roles = "operator")]
        public ActionResult TrainsCrew(int trainId)
        {
            var vm = new TrainsStaffViewModel()
            {
                TrainId = trainId,
                TrainsIds = GetTrainsIds(),
                Configurator = new Configurator<Employee, EmployeeRow>()
                    .ConfigureTrainsStaff()
                    .Url(Url.Action(nameof(HandleTrainsStaff), new {trainId}))
            };
            return View(vm);
        }

        public ActionResult HandleTrainsStaff(int trainId)
        {
            var conf = new Configurator<Employee, EmployeeRow>().ConfigureTrainsStaff();
            var handler = conf.CreateMvcHandler(ControllerContext);
            handler.AddEditHandler(EditTrainsStaffMember);
            return handler.Handle(_context.Employees.Where(employee =>
                employee.TrainId.HasValue && employee.TrainId == trainId));
        }

        public TableAdjustment EditTrainsStaffMember(LatticeData<Employee, EmployeeRow> latticeData,
            EmployeeRow employeeRow)
        {
            if (string.IsNullOrEmpty(employeeRow.UserId))
            {
                return latticeData.Adjust(x => x
                    .Message(LatticeMessage.User("failure", "Editing", "Can not create create new employee from here"))
                );
            }

            Employee employee = _context.Employees
                .FirstOrDefault(x => x.UserId == employeeRow.UserId);
            if (employee == null)
            {
                return latticeData.Adjust(x => x
                    .Message(LatticeMessage.User("failure", "Editing", "Can not find employee"))
                );
            }
            

            employee.TrainId = employeeRow.TrainId ;
            _context.SaveChanges();
            return latticeData.Adjust(x => x
                .Update(employeeRow)
                .Message(LatticeMessage.User("success", "Editing", "Employee saved"))
            );
        }
    }
}