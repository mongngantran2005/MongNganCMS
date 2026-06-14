using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using Microsoft.AspNetCore.Http;
using System.IO;
using System;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/customers")]
    [ApiController]
    public class CustomersApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomersApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        public class LoginModel
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        /// <summary>
        /// Đăng nhập dành cho khách hàng
        /// </summary>
        /// <param name="model">Thông tin đăng nhập gồm Email và Mật khẩu</param>
        /// <returns>Trả về thông tin khách hàng nếu thành công</returns>
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            var customer = _context.Customers.FirstOrDefault(c => c.Email.ToLower() == model.Email.ToLower() && c.Password == model.Password);
            if (customer == null)
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });
            }

            return Ok(new { 
                id = customer.Id, 
                fullName = customer.FullName, 
                email = customer.Email,
                phone = customer.Phone,
                address = customer.Address,
                username = customer.Username,
                gender = customer.Gender,
                dateOfBirth = customer.DateOfBirth,
                avatarUrl = customer.AvatarUrl
            });
        }

        public class RegisterModel
        {
            public string FullName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string Phone { get; set; }
            public string Address { get; set; }
        }

        /// <summary>
        /// Đăng ký tài khoản khách hàng mới
        /// </summary>
        /// <param name="model">Thông tin đăng ký của khách hàng</param>
        /// <returns>Thông báo thành công hoặc lỗi</returns>
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterModel model)
        {
            var existing = _context.Customers.FirstOrDefault(c => c.Email.ToLower() == model.Email.ToLower());
            if (existing != null)
            {
                return BadRequest(new { message = "Email này đã được sử dụng." });
            }

            var customer = new Customer
            {
                FullName = model.FullName,
                Email = model.Email,
                Password = model.Password,
                Phone = model.Phone,
                Address = model.Address,
                Username = model.Email.Split('@')[0] // Mặc định username
            };

            _context.Customers.Add(customer);
            _context.SaveChanges();

            return Ok(new { message = "Đăng ký thành công" });
        }

        [HttpGet("{id}")]
        public IActionResult GetProfile(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();

            return Ok(new { 
                id = customer.Id, 
                fullName = customer.FullName, 
                email = customer.Email,
                phone = customer.Phone,
                address = customer.Address,
                username = customer.Username,
                gender = customer.Gender,
                dateOfBirth = customer.DateOfBirth,
                avatarUrl = customer.AvatarUrl
            });
        }

        public class UpdateProfileModel
        {
            public string FullName { get; set; }
            public string Phone { get; set; }
            public string Address { get; set; }
            public string Username { get; set; }
            public string Gender { get; set; }
            public DateTime? DateOfBirth { get; set; }
            public IFormFile? AvatarFile { get; set; }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromForm] UpdateProfileModel model)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return NotFound();

            customer.FullName = model.FullName;
            customer.Phone = model.Phone;
            customer.Address = model.Address;
            customer.Username = model.Username;
            customer.Gender = model.Gender;
            customer.DateOfBirth = model.DateOfBirth;
            
            if (model.AvatarFile != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "customers");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + model.AvatarFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await model.AvatarFile.CopyToAsync(fileStream);
                }

                customer.AvatarUrl = "/images/customers/" + uniqueFileName;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật hồ sơ thành công", avatarUrl = customer.AvatarUrl });
        }
    }
}
