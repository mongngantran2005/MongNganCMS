using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    /// <summary>
    /// API Controller xử lý upload ảnh từ CKEditor vào nội dung bài viết.
    /// Endpoint: POST /api/upload/image
    /// Response format theo chuẩn CKEditor Simple Upload Adapter.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public UploadController(IWebHostEnvironment env)
        {
            _env = env;
        }

        /// <summary>
        /// Upload ảnh từ CKEditor - Simple Upload Adapter.
        /// CKEditor gửi POST request với field "upload" chứa file ảnh.
        /// Response cần trả về JSON: { "url": "..." } khi thành công.
        /// Dùng kiểm tra IsAuthenticated thủ công thay vì [Authorize] để
        /// tránh Cookie middleware redirect về HTML login page khi chưa đăng nhập.
        /// </summary>
        [HttpPost("image")]
        public async Task<IActionResult> UploadImage(IFormFile upload)
        {
            // Kiểm tra đăng nhập thủ công - trả JSON thay vì redirect HTML
            if (!User.Identity?.IsAuthenticated ?? true)
            {
                return Unauthorized(new { error = new { message = "Bạn cần đăng nhập để upload ảnh." } });
            }

            if (upload == null || upload.Length == 0)
            {
                return BadRequest(new
                {
                    error = new { message = "Không có file ảnh được gửi lên." }
                });
            }

            // Kiểm tra định dạng file cho phép
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp" };
            var extension = Path.GetExtension(upload.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(new
                {
                    error = new { message = "Chỉ chấp nhận ảnh định dạng JPG, PNG, GIF, WEBP, BMP." }
                });
            }

            // Giới hạn kích thước file: 10MB
            if (upload.Length > 10 * 1024 * 1024)
            {
                return BadRequest(new
                {
                    error = new { message = "Kích thước ảnh không được vượt quá 10MB." }
                });
            }

            try
            {
                // Tạo thư mục uploads/content nếu chưa tồn tại
                string uploadFolder = Path.Combine(_env.WebRootPath, "uploads", "content");
                if (!Directory.Exists(uploadFolder))
                    Directory.CreateDirectory(uploadFolder);

                // Tạo tên file duy nhất để tránh trùng lặp
                string uniqueFileName = Guid.NewGuid().ToString("N") + extension;
                string filePath = Path.Combine(uploadFolder, uniqueFileName);

                // Lưu file lên đĩa
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await upload.CopyToAsync(stream);
                }

                // Tạo URL truy cập file - đây là URL mà CKEditor sẽ dùng để hiển thị ảnh
                var request = HttpContext.Request;
                string baseUrl = $"{request.Scheme}://{request.Host}";
                string imageUrl = $"{baseUrl}/uploads/content/{uniqueFileName}";

                // Trả về response đúng chuẩn CKEditor Simple Upload Adapter
                return Ok(new { url = imageUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = new { message = $"Lỗi khi upload ảnh: {ex.Message}" }
                });
            }
        }
    }
}
