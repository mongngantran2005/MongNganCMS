using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /User
        public IActionResult Index(int page = 1, int pageSize = 10)
        {
            var query = _context.Users.OrderBy(u => u.FullName).AsQueryable();

            int totalCount = query.Count();
            int totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            var users = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            ViewData["CurrentPage"] = page;
            ViewData["TotalPages"] = Math.Max(1, totalPages);
            ViewData["TotalCount"] = totalCount;
            ViewData["PageSize"] = pageSize;
            // For stats (total counts without pagination)
            ViewBag.TotalUsers = _context.Users.Count();
            ViewBag.TotalAdmins = _context.Users.Count(u => u.Role == "Admin");
            ViewBag.TotalEditors = _context.Users.Count(u => u.Role == "Editor");

            return View(users);
        }

        // GET: /User/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: /User/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(User model)
        {
            // Kiểm tra tên đăng nhập đã tồn tại chưa
            var exists = _context.Users.Any(u => u.Username == model.Username);
            if (exists)
            {
                ModelState.AddModelError("Username", "Tên đăng nhập này đã có người dùng!");
            }

            if (ModelState.IsValid)
            {
                if (!string.IsNullOrEmpty(model.PasswordHash))
                {
                    model.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.PasswordHash);
                }
                _context.Users.Add(model);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }

            return View(model);
        }

        // GET: /User/Edit/5
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();
            return View(user);
        }

        // POST: /User/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, User model, string? newPassword)
        {
            if (id != model.Id) return NotFound();

            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            if (ModelState.IsValid)
            {
                user.FullName = model.FullName;
                user.Role = model.Role;

                // Nếu nhập mật khẩu mới thì đổi, nếu để trống thì giữ mật khẩu cũ
                if (!string.IsNullOrWhiteSpace(newPassword))
                {
                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
                }

                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }

            return View(model);
        }

        // GET: /User/Delete/5 (hỗ trợ GET để dùng trực tiếp thẻ <a>)
        [HttpGet]
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }

        // POST: /User/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
