
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Hosting;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class ProductCategoryController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductCategoryController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: /ProductCategory
        public IActionResult Index()
        {
            var categories = _context.CategoriesProducts
                .Include(c => c.ParentCategory)
                .OrderBy(c => c.ParentId)
                .ThenBy(c => c.Name)
                .ToList();
            return View(categories);
        }

        // GET: /ProductCategory/Create
        public IActionResult Create()
        {
            var parentCategories = _context.CategoriesProducts
                .Where(c => c.ParentId == null)
                .ToList();
            ViewBag.ParentCategories = new SelectList(parentCategories, "Id", "Name");
            return View();
        }

        // POST: /ProductCategory/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CategoryProduct model, IFormFile? imageFile)
        {
            if (ModelState.IsValid)
            {
                if (imageFile != null && imageFile.Length > 0)
                {
                    var uploadsFolder = Path.Combine(_env.WebRootPath, "images", "categories");
                    Directory.CreateDirectory(uploadsFolder);
                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + imageFile.FileName;
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(fileStream);
                    }
                    model.ImageUrl = "/images/categories/" + uniqueFileName;
                }

                _context.CategoriesProducts.Add(model);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            
            var parentCategories = _context.CategoriesProducts.Where(c => c.ParentId == null).ToList();
            ViewBag.ParentCategories = new SelectList(parentCategories, "Id", "Name", model.ParentId);
            return View(model);
        }

        // GET: /ProductCategory/Edit/5
        public IActionResult Edit(int id)
        {
            var category = _context.CategoriesProducts.Find(id);
            if (category == null) return NotFound();
            
            var parentCategories = _context.CategoriesProducts
                .Where(c => c.Id != id && c.ParentId != id)
                .ToList();
            ViewBag.ParentCategories = new SelectList(parentCategories, "Id", "Name", category.ParentId);

            return View(category);
        }

        // POST: /ProductCategory/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, CategoryProduct model, IFormFile? imageFile)
        {
            if (id != model.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    var existingCategory = await _context.CategoriesProducts.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);
                    if (existingCategory == null) return NotFound();

                    if (imageFile != null && imageFile.Length > 0)
                    {
                        var uploadsFolder = Path.Combine(_env.WebRootPath, "images", "categories");
                        Directory.CreateDirectory(uploadsFolder);
                        var uniqueFileName = Guid.NewGuid().ToString() + "_" + imageFile.FileName;
                        var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await imageFile.CopyToAsync(fileStream);
                        }

                        // Xóa file cũ nếu có
                        if (!string.IsNullOrEmpty(existingCategory.ImageUrl))
                        {
                            var oldFilePath = Path.Combine(_env.WebRootPath, existingCategory.ImageUrl.TrimStart('/'));
                            if (System.IO.File.Exists(oldFilePath))
                            {
                                System.IO.File.Delete(oldFilePath);
                            }
                        }

                        model.ImageUrl = "/images/categories/" + uniqueFileName;
                    }
                    else
                    {
                        model.ImageUrl = existingCategory.ImageUrl;
                    }

                    _context.CategoriesProducts.Update(model);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.CategoriesProducts.Any(e => e.Id == model.Id)) return NotFound();
                    else throw;
                }
                return RedirectToAction(nameof(Index));
            }

            var parentCategories = _context.CategoriesProducts.Where(c => c.Id != id && c.ParentId != id).ToList();
            ViewBag.ParentCategories = new SelectList(parentCategories, "Id", "Name", model.ParentId);
            return View(model);
        }

        // POST: /ProductCategory/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            var category = _context.CategoriesProducts
                .Include(c => c.Products)
                .Include(c => c.ChildCategories)
                .FirstOrDefault(c => c.Id == id);

            if (category == null) return NotFound();

            // Kiểm tra khóa ngoại
            if (category.Products != null && category.Products.Any())
            {
                TempData["ErrorMessage"] = $"Không thể xóa danh mục '{category.Name}' vì đang có {category.Products.Count} sản phẩm thuộc danh mục này.";
                return RedirectToAction(nameof(Index));
            }

            // Kiểm tra khóa ngoại (danh mục con)
            if (category.ChildCategories != null && category.ChildCategories.Any())
            {
                TempData["ErrorMessage"] = $"Không thể xóa danh mục '{category.Name}' vì đang có {category.ChildCategories.Count} danh mục con.";
                return RedirectToAction(nameof(Index));
            }

            // Xóa file ảnh
            if (!string.IsNullOrEmpty(category.ImageUrl))
            {
                var filePath = Path.Combine(_env.WebRootPath, category.ImageUrl.TrimStart('/'));
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            _context.CategoriesProducts.Remove(category);
            _context.SaveChanges();
            TempData["SuccessMessage"] = $"Đã xóa danh mục '{category.Name}'.";
            return RedirectToAction(nameof(Index));
        }
    }
}
