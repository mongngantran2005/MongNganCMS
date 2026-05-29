using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var products = _context.Products
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : "Chưa phân loại"
                })
                .ToList();

            return Ok(products);
        }

        [HttpGet("category/{categoryId}")]
        public IActionResult GetByCategory(int categoryId)
        {
            var products = _context.Products
                .Where(p => p.CategoryProductId == categoryId)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity
                })
                .ToList();

            return Ok(products);
        }

        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var product = _context.Products
                .Include(p => p.CategoryProduct)
                .FirstOrDefault(p => p.Id == id);

            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm này trong hệ thống" });
            }

            return Ok(new {
                product.Id,
                product.Name,
                product.Description,
                product.Price,
                product.ImageUrl,
                product.StockQuantity,
                CategoryId = product.CategoryProductId,
                CategoryName = product.CategoryProduct != null ? product.CategoryProduct.Name : "Chưa phân loại"
            });
        }
    }
}
