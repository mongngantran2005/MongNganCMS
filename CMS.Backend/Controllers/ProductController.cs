using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: /Product
        public IActionResult Index(int page = 1, int pageSize = 10)
        {
            var query = _context.Products
                .Include(p => p.CategoryProduct)
                .OrderBy(p => p.Name);

            int totalCount = query.Count();
            int totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            var products = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            ViewData["CurrentPage"] = page;
            ViewData["TotalPages"] = Math.Max(1, totalPages);
            ViewData["TotalCount"] = totalCount;
            ViewData["PageSize"] = pageSize;

            return View(products);
        }

        // Helper method for hierarchical category list
        private List<SelectListItem> GetCategorySelectList(int? selectedId = null)
        {
            var categories = _context.CategoriesProducts.ToList();
            var selectList = new List<SelectListItem>();

            var parentCategories = categories.Where(c => c.ParentId == null).ToList();
            foreach (var parent in parentCategories)
            {
                selectList.Add(new SelectListItem 
                { 
                    Value = parent.Id.ToString(), 
                    Text = parent.Name,
                    Selected = selectedId == parent.Id
                });

                var childCategories = categories.Where(c => c.ParentId == parent.Id).ToList();
                foreach (var child in childCategories)
                {
                    selectList.Add(new SelectListItem 
                    { 
                        Value = child.Id.ToString(), 
                        Text = $"-- {child.Name}",
                        Selected = selectedId == child.Id
                    });
                }
            }
            return selectList;
        }

        // GET: /Product/Create
        public IActionResult Create()
        {
            ViewBag.CategoryProductId = GetCategorySelectList();
            return View();
        }

        // POST: /Product/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Product model, IFormFile? ImageFile)
        {
            ModelState.Remove("CategoryProduct");

            if (ModelState.IsValid)
            {
                if (ImageFile != null && ImageFile.Length > 0)
                {
                    var uploadsFolder = Path.Combine(_env.WebRootPath, "images", "products");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(ImageFile.FileName);
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await ImageFile.CopyToAsync(fileStream);
                    }
                    model.ImageUrl = "/images/products/" + uniqueFileName;
                }

                _context.Products.Add(model);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewBag.CategoryProductId = GetCategorySelectList(model.CategoryProductId);
            return View(model);
        }

        // GET: /Product/Edit/5
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();
            
            ViewBag.CategoryProductId = GetCategorySelectList(product.CategoryProductId);
            return View(product);
        }

        // POST: /Product/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Product model, IFormFile? ImageFile)
        {
            if (id != model.Id) return NotFound();

            ModelState.Remove("CategoryProduct");

            if (ModelState.IsValid)
            {
                if (ImageFile != null && ImageFile.Length > 0)
                {
                    var uploadsFolder = Path.Combine(_env.WebRootPath, "images", "products");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(ImageFile.FileName);
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await ImageFile.CopyToAsync(fileStream);
                    }
                    model.ImageUrl = "/images/products/" + uniqueFileName;
                }
                else
                {
                    // Giữ nguyên ảnh cũ nếu không chọn ảnh mới
                    var existingProduct = await _context.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
                    if (existingProduct != null)
                    {
                        model.ImageUrl = existingProduct.ImageUrl;
                    }
                }

                _context.Products.Update(model);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewBag.CategoryProductId = GetCategorySelectList(model.CategoryProductId);
            return View(model);
        }

        // POST: /Product/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();

            // Kiểm tra khóa ngoại từ OrderDetails
            var hasOrders = _context.OrderDetails.Any(od => od.ProductId == id);
            if (hasOrders)
            {
                TempData["ErrorMessage"] = $"Không thể xóa sản phẩm '{product.Name}' vì đã có người đặt mua (nằm trong chi tiết đơn hàng).";
                return RedirectToAction(nameof(Index));
            }

            _context.Products.Remove(product);
            _context.SaveChanges();
            TempData["SuccessMessage"] = $"Đã xóa sản phẩm '{product.Name}'.";
            return RedirectToAction(nameof(Index));
        }
    }
}
