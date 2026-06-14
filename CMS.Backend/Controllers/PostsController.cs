using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    // 1. Định nghĩa đường dẫn API: https://localhost:xxxx/api/posts
    [Route("api/[controller]")]

    // 2. Đánh dấu đây là API Controller (hỗ trợ RESTful tự động)
    [ApiController]

    // 3. API Controller kế thừa ControllerBase (không cần View)
    public class PostsController : ControllerBase
    {
        // 4. Khai báo biến kết nối Database
        private readonly ApplicationDbContext _context;

        // 5. Constructor: Tiêm kết nối Database vào để sử dụng
        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =====================================================================
        // PHẦN 2: API LẤY DANH SÁCH BÀI VIẾT (GET METHOD)
        // URL: GET https://localhost:xxxx/api/posts
        // =====================================================================
        [HttpGet]
        public IActionResult GetAll()
        {
            var posts = _context.Posts
                .OrderByDescending(p => p.Id) // Sắp xếp bài mới nhất lên đầu
                .Select(p => new {           // Chỉ lấy các trường cần thiết
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    CreatedAt = p.CreatedDate,
                    CategoryName = p.Category != null ? p.Category.Name : "Chưa phân loại"
                })
                .ToList();

            // Trả về kết quả dạng JSON với mã trạng thái 200 (Thành công)
            return Ok(posts);
        }

        // =====================================================================
        // PHẦN 2: API LẤY BÀI VIẾT THEO DANH MỤC
        // URL: GET https://localhost:xxxx/api/posts/category/{categoryId}
        // =====================================================================
        [HttpGet("category/{categoryId}")]
        public IActionResult GetByCategory(int categoryId)
        {
            // Lọc các bài viết có CategoryId trùng với ID truyền vào từ URL
            var posts = _context.Posts
                .Where(p => p.CategoryId == categoryId)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    CreatedAt = p.CreatedDate
                })
                .ToList();

            return Ok(posts);
        }

        // =====================================================================
        // PHẦN 3: API CHI TIẾT BÀI VIẾT (GET BY ID)
        // URL: GET https://localhost:xxxx/api/posts/{id}
        // =====================================================================
        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            // Tìm bài viết có Id khớp với tham số truyền vào
            var post = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);

            // Xử lý trường hợp không tìm thấy (ID không tồn tại)
            if (post == null)
            {
                // Trả về lỗi 404 kèm thông báo JSON
                return NotFound(new { message = "Không tìm thấy bài viết này trong hệ thống" });
            }

            // Trả về đầy đủ thông tin bài viết
            return Ok(new {
                post.Id,
                post.Title,
                post.Content,
                post.ImageUrl,
                CreatedAt = post.CreatedDate,
                CategoryId = post.CategoryId,
                CategoryName = post.Category != null ? post.Category.Name : "Chưa phân loại"
            });
        }

        // =====================================================================
        // PHẦN 4: API THÊM MỚI BÀI VIẾT (POST METHOD)
        // URL: POST https://localhost:xxxx/api/posts
        // =====================================================================
    //     [HttpPost]
    //     public IActionResult Create([FromBody] CMS.Data.Entities.Post model)
    //     {
    //         if (!ModelState.IsValid)
    //         {
    //             return BadRequest(ModelState);
    //         }

    //         model.CreatedDate = System.DateTime.Now;
    //         _context.Posts.Add(model);
    //         _context.SaveChanges();

    //         return CreatedAtAction(nameof(GetDetail), new { id = model.Id }, model);
    //     }

    //     // =====================================================================
    //     // PHẦN 5: API CẬP NHẬT BÀI VIẾT (PUT METHOD)
    //     // URL: PUT https://localhost:xxxx/api/posts/{id}
    //     // =====================================================================
    //     [HttpPut("{id}")]
    //     public IActionResult Update(int id, [FromBody] CMS.Data.Entities.Post model)
    //     {
    //         if (id != model.Id)
    //         {
    //             return BadRequest(new { message = "ID không khớp" });
    //         }

    //         var post = _context.Posts.Find(id);
    //         if (post == null)
    //         {
    //             return NotFound(new { message = "Không tìm thấy bài viết" });
    //         }

    //         post.Title = model.Title;
    //         post.Content = model.Content;
    //         post.ImageUrl = model.ImageUrl;
    //         post.CategoryId = model.CategoryId;

    //         _context.SaveChanges();

    //         return Ok(new { message = "Cập nhật thành công" });
    //     }

    //     // =====================================================================
    //     // PHẦN 6: API XÓA BÀI VIẾT (DELETE METHOD)
    //     // URL: DELETE https://localhost:xxxx/api/posts/{id}
    //     // =====================================================================
    //     [HttpDelete("{id}")]
    //     public IActionResult Delete(int id)
    //     {
    //         var post = _context.Posts.Find(id);
    //         if (post == null)
    //         {
    //             return NotFound(new { message = "Không tìm thấy bài viết" });
    //         }

    //         _context.Posts.Remove(post);
    //         _context.SaveChanges();

    //         return Ok(new { message = "Xóa thành công" });
    //     }
    }
}
