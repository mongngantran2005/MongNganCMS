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
            // Hỗ trợ đăng nhập bằng cả Email và Tên đăng nhập (username)
            var customer = _context.Customers.FirstOrDefault(c =>
                c.Email.ToLower() == model.Email.ToLower() || 
                (c.Username != null && c.Username.ToLower() == model.Email.ToLower()));

            bool isPasswordValid = false;
            if (customer != null)
            {
                try
                {
                    isPasswordValid = BCrypt.Net.BCrypt.Verify(model.Password, customer.Password);
                }
                catch
                {
                    isPasswordValid = (customer.Password == model.Password);
                }
            }

            if (!isPasswordValid)
            {
                return Unauthorized(new { message = "Tên đăng nhập/Email hoặc mật khẩu không đúng." });
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
            public string Username { get; set; }
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
        public IActionResult Register([FromBody] RegisterModel model, [FromServices] CMS.Backend.Services.IEmailSender emailSender)
        {
            if (string.IsNullOrWhiteSpace(model.FullName) || string.IsNullOrWhiteSpace(model.Username) || string.IsNullOrWhiteSpace(model.Password))
            {
                return BadRequest(new { message = "Vui lòng điền đầy đủ thông tin bắt buộc." });
            }

            var existing = _context.Customers.FirstOrDefault(c => c.Email.ToLower() == model.Email.ToLower());
            if (existing != null)
            {
                return BadRequest(new { message = "Email này đã được sử dụng." });
            }

            var existingUsername = _context.Customers.FirstOrDefault(c => c.Username.ToLower() == model.Username.ToLower());
            if (existingUsername != null)
            {
                return BadRequest(new { message = "Tên đăng nhập này đã được sử dụng." });
            }

            var customer = new Customer
            {
                FullName = model.FullName,
                Email = model.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(model.Password),
                Phone = model.Phone ?? "",
                Address = model.Address ?? "",
                Username = model.Username
            };

            _context.Customers.Add(customer);
            _context.SaveChanges();

            if (!string.IsNullOrEmpty(customer.Email))
            {
                string subject = "Đăng ký tài khoản thành công - MongNganCMS";
                string body = $"<h3>Chào {customer.FullName},</h3>" +
                              $"<p>Chúc mừng bạn đã tạo tài khoản thành công tại MongNganCMS.</p>" +
                              $"<p>Tên đăng nhập của bạn là: <b>{customer.Username}</b></p>" +
                              $"<p>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!</p>";
                
                _ = emailSender.SendEmailAsync(customer.Email, subject, body);
            }

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
            public string? FullName { get; set; }
            public string? Phone { get; set; }
            public string? Address { get; set; }
            public string? Username { get; set; }
            public string? Gender { get; set; }
            public DateTime? DateOfBirth { get; set; }
            public IFormFile? AvatarFile { get; set; }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromForm] UpdateProfileModel model)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return NotFound();

            customer.FullName = model.FullName ?? customer.FullName;
            customer.Phone = model.Phone ?? customer.Phone;
            customer.Address = model.Address ?? customer.Address;
            customer.Username = model.Username ?? customer.Username;
            customer.Gender = model.Gender ?? customer.Gender;
            customer.DateOfBirth = model.DateOfBirth ?? customer.DateOfBirth;
            
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

        public class ForgotPasswordModel
        {
            public string Email { get; set; }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordModel model, [FromServices] CMS.Backend.Services.IEmailSender emailSender)
        {
            var customer = _context.Customers.FirstOrDefault(c => c.Email.ToLower() == model.Email.ToLower());
            if (customer == null)
            {
                return Ok(new { message = "Nếu email hợp lệ, mã khôi phục mật khẩu đã được gửi." });
            }

            // Tạo mã OTP 6 số
            string otpCode = new Random().Next(100000, 999999).ToString();
            customer.ResetPasswordToken = otpCode;
            customer.ResetPasswordTokenExpiry = DateTime.UtcNow.AddMinutes(15);
            await _context.SaveChangesAsync();

            // Gửi email
            string subject = "Mã xác nhận khôi phục mật khẩu - MongNganCMS";
            string body = $"<h3>Chào {customer.FullName},</h3>" +
                          $"<p>Bạn đã yêu cầu khôi phục mật khẩu. Dưới đây là mã xác nhận (OTP) của bạn:</p>" +
                          $"<h2 style='color: #FF6600; font-size: 24px; letter-spacing: 2px;'>{otpCode}</h2>" +
                          $"<p>Mã này sẽ hết hạn trong vòng 15 phút. Không chia sẻ mã này cho bất kỳ ai.</p>" +
                          $"<p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>";
            
            await emailSender.SendEmailAsync(customer.Email, subject, body);

            return Ok(new { message = "Nếu email hợp lệ, mã khôi phục mật khẩu đã được gửi." });
        }

        public class ResetPasswordModel
        {
            public string Email { get; set; }
            public string Token { get; set; }
            public string NewPassword { get; set; }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
        {
            var customer = _context.Customers.FirstOrDefault(c => 
                c.Email.ToLower() == model.Email.ToLower() && 
                c.ResetPasswordToken == model.Token);

            if (customer == null || customer.ResetPasswordTokenExpiry < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Link khôi phục không hợp lệ hoặc đã hết hạn." });
            }

            customer.Password = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
            customer.ResetPasswordToken = null;
            customer.ResetPasswordTokenExpiry = null;
            
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đặt lại mật khẩu thành công." });
        }

        public class ChangePasswordModel
        {
            public string OldPassword { get; set; }
            public string NewPassword { get; set; }
        }

        [HttpPost("{id}/change-password")]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordModel model)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return NotFound(new { message = "Không tìm thấy người dùng." });

            bool isPasswordValid = false;
            try
            {
                isPasswordValid = BCrypt.Net.BCrypt.Verify(model.OldPassword, customer.Password);
            }
            catch
            {
                isPasswordValid = (customer.Password == model.OldPassword);
            }

            if (!isPasswordValid)
            {
                return BadRequest(new { message = "Mật khẩu cũ không chính xác." });
            }

            customer.Password = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đổi mật khẩu thành công." });
        }
    }
}
