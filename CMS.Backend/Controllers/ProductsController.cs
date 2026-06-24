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

        /// <summary>
        /// Lấy danh sách sản phẩm (có hỗ trợ tìm kiếm và lọc theo danh mục)
        /// </summary>
        /// <param name="search">Từ khóa tìm kiếm theo tên sản phẩm</param>
        /// <param name="categoryId">ID của danh mục cần lọc</param>
        /// <returns>Danh sách sản phẩm</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetAll([FromQuery] string? search = null, [FromQuery] int? categoryId = null, [FromQuery] int? limit = null)
        {
            var query = _context.Products.AsQueryable();

            if (categoryId.HasValue && categoryId.Value > 0)
            {
                var targetCategoryIds = _context.CategoriesProducts
                    .Where(c => c.Id == categoryId.Value || c.ParentId == categoryId.Value)
                    .Select(c => c.Id)
                    .ToList();

                query = query.Where(p => targetCategoryIds.Contains(p.CategoryProductId));
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p => p.Name.Contains(search));
            }

            query = query.OrderByDescending(p => p.Id);

            if (limit.HasValue && limit.Value > 0)
            {
                query = query.Take(limit.Value);
            }

            var products = query
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
            var targetCategoryIds = _context.CategoriesProducts
                .Where(c => c.Id == categoryId || c.ParentId == categoryId)
                .Select(c => c.Id)
                .ToList();

            var products = _context.Products
                .Where(p => targetCategoryIds.Contains(p.CategoryProductId))
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

        [HttpGet("hot")]
        public IActionResult GetHotProducts([FromQuery] int limit = 3)
        {
            var hotProducts = _context.Products
                .Select(p => new {
                    Product = p,
                    SoldCount = _context.OrderDetails.Where(od => od.ProductId == p.Id).Sum(od => (int?)od.Quantity) ?? 0
                })
                .OrderByDescending(x => x.SoldCount)
                .Take(limit)
                .Select(x => new {
                    x.Product.Id,
                    x.Product.Name,
                    x.Product.Price,
                    x.Product.ImageUrl,
                    x.Product.StockQuantity,
                    CategoryName = x.Product.CategoryProduct != null ? x.Product.CategoryProduct.Name : "Chưa phân loại"
                })
                .ToList();

            return Ok(hotProducts);
        }
    }
}
