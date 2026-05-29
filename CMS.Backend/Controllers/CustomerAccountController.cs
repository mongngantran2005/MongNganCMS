using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    public class CustomerAccountController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerAccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Register()
        {
            if (!string.IsNullOrEmpty(HttpContext.Session.GetString("CustomerName")))
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(string fullName, string email, string password, string confirmPassword, string phone, string address)
        {
            if (string.IsNullOrWhiteSpace(fullName) || string.IsNullOrWhiteSpace(email) || 
                string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(confirmPassword))
            {
                ViewBag.Error = "Vui lòng nhập đầy đủ các thông tin bắt buộc!";
                return View();
            }

            if (password != confirmPassword)
            {
                ViewBag.Error = "Mật khẩu xác nhận không khớp!";
                return View();
            }

            var existingCustomer = _context.Customers.FirstOrDefault(c => c.Email.ToLower() == email.ToLower());
            if (existingCustomer != null)
            {
                ViewBag.Error = "Email này đã được sử dụng để đăng ký!";
                return View();
            }

            var newCustomer = new Customer
            {
                FullName = fullName,
                Email = email,
                Password = password, // Lưu mật khẩu text thô theo chuẩn db hiện tại
                Phone = phone,
                Address = address
            };

            _context.Customers.Add(newCustomer);
            await _context.SaveChangesAsync();

            TempData["SuccessMessage"] = "Đăng ký thành công! Hãy đăng nhập tài khoản của bạn.";
            return RedirectToAction("Login");
        }

        [HttpGet]
        public IActionResult Login()
        {
            if (!string.IsNullOrEmpty(HttpContext.Session.GetString("CustomerName")))
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(string email, string password)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            {
                ViewBag.Error = "Vui lòng nhập đầy đủ Email và Mật khẩu!";
                return View();
            }

            var customer = _context.Customers.FirstOrDefault(c => c.Email.ToLower() == email.ToLower() && c.Password == password);
            if (customer != null)
            {
                // Lưu trạng thái đăng nhập vào Session
                HttpContext.Session.SetInt32("CustomerId", customer.Id);
                HttpContext.Session.SetString("CustomerEmail", customer.Email);
                HttpContext.Session.SetString("CustomerName", customer.FullName);

                return RedirectToAction("Index", "Home");
            }

            ViewBag.Error = "Tên đăng nhập hoặc mật khẩu không chính xác!";
            return View();
        }

        [HttpGet]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Index", "Home");
        }
    }
}
