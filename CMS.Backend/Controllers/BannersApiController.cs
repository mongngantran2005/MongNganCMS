using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/banners")]
    [ApiController]
    public class BannersApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BannersApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/banners
        [HttpGet]
        public async Task<IActionResult> GetBanners()
        {
            try
            {
                var banners = await _context.Banners
                    .Where(b => b.IsActive)
                    .OrderBy(b => b.DisplayOrder)
                    .Select(b => new
                    {
                        b.Id,
                        b.Title,
                        b.ImageUrl,
                        b.TargetUrl
                    })
                    .ToListAsync();

                return Ok(banners);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tải danh sách banner. Vui lòng chạy migration để tạo bảng Banners.", detail = ex.Message });
            }
        }
    }
}
