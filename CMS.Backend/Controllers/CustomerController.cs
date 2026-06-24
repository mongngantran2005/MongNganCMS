using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /Customer
        public IActionResult Index(int page = 1, int pageSize = 10)
        {
            var query = _context.Customers.OrderBy(c => c.FullName);

            int totalCount = query.Count();
            int totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            var customers = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            ViewData["CurrentPage"] = page;
            ViewData["TotalPages"] = Math.Max(1, totalPages);
            ViewData["TotalCount"] = totalCount;
            ViewData["PageSize"] = pageSize;

            return View(customers);
        }

        // GET: /Customer/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: /Customer/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Customer model)
        {
            if (ModelState.IsValid)
            {
                // Kiểm tra email trùng
                if (_context.Customers.Any(c => c.Email == model.Email))
                {
                    ModelState.AddModelError("Email", "Email này đã được sử dụng.");
                    return View(model);
                }

                _context.Customers.Add(model);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        // GET: /Customer/Edit/5
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();
            return View(customer);
        }

        // POST: /Customer/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Customer model)
        {
            if (id != model.Id) return NotFound();

            if (ModelState.IsValid)
            {
                // Kiểm tra email trùng nhưng bỏ qua chính khách hàng này
                if (_context.Customers.Any(c => c.Email == model.Email && c.Id != id))
                {
                    ModelState.AddModelError("Email", "Email này đã được sử dụng bởi khách hàng khác.");
                    return View(model);
                }

                _context.Customers.Update(model);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        // POST: /Customer/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();

            // Kiểm tra khóa ngoại từ Orders
            var hasOrders = _context.Orders.Any(o => o.CustomerId == id);
            if (hasOrders)
            {
                TempData["ErrorMessage"] = $"Không thể xóa khách hàng '{customer.FullName}' vì đã có đơn hàng.";
                return RedirectToAction(nameof(Index));
            }

            _context.Customers.Remove(customer);
            _context.SaveChanges();
            TempData["SuccessMessage"] = $"Đã xóa khách hàng '{customer.FullName}'.";
            return RedirectToAction(nameof(Index));
        }
    }
}
