using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;
using Nsu.Belov.TrainsDatabase.Web.Auth;
using Nsu.Belov.TrainsDatabase.Web.Models;

namespace Nsu.Belov.TrainsDatabase.Web.Controllers
{
    public class AuthController : Controller
    {
        private readonly TrainsUserManager _userManager;
        private readonly TrainsSignInManager _signIn;
        private readonly IAuthenticationManager _authentication;
        private readonly TrainsRoleManager _roleManager;

        public AuthController(TrainsUserManager userManager, TrainsSignInManager signIn, 
            IAuthenticationManager authentication, TrainsRoleManager roleManager)
        {
            _userManager = userManager;
            _signIn = signIn;
            _authentication = authentication;
            _roleManager = roleManager;
        }
        
        [HttpGet]
        public ActionResult Register()
        {
            var rvm = new RegisterViewModel();
            return View(rvm);
        }

        [HttpPost]
        public ActionResult Register(RegisterViewModel rvm)
        {
            var au = new ApplicationUser()
            {
                UserName = rvm.Login
            };

            var r = _userManager.Create(au, rvm.Password);
            if (!r.Succeeded)
            {
                int t = 0;
                foreach (var e in r.Errors)
                {
                    ModelState.AddModelError("auth" + t++, e);
                }

                return View("Register", rvm);
            }

            return RedirectToAction("Login");
        }

        [HttpGet]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.returnUrl = returnUrl;
            return View();
        }

        [HttpPost]

//        [ValidateAntiForgeryToken]
        public ActionResult Login(LoginViewModel lvm)
        {

            var r = _signIn.PasswordSignIn(lvm.Login, lvm.Password, true, false);

            if (r == SignInStatus.Success)
            {
                if (string.IsNullOrEmpty(lvm.ReturnUrl))
                {
                    return Redirect("/");
                }

            return Redirect(lvm.ReturnUrl);
            }
            ModelState.AddModelError("auth", "Неверный логин или пароль.");
            return View("Login", lvm);
           
        }
    }

}