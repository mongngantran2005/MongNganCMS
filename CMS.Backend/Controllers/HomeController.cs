using CMS.Backend.Models;
using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ApplicationDbContext _context;

        public HomeController(ILogger<HomeController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy 3 bài viết mới nhất kèm tên danh mục
            var latestPosts = _context.Posts
                .Include(p => p.Category)
                .OrderByDescending(p => p.CreatedDate)
                .Take(3)
                .ToList();

            // Lấy 6 sản phẩm mới nhất
            var latestProducts = _context.Products
                .Include(p => p.CategoryProduct)
                .OrderByDescending(p => p.Id)
                .Take(6)
                .ToList();

            ViewBag.LatestProducts = latestProducts;

            return View(latestPosts);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [Authorize]
        public IActionResult Dashboard()
        {
            ViewBag.TotalPosts = _context.Posts.Count();
            ViewBag.TotalUsers = _context.Users.Count();
            ViewBag.TotalCategories = _context.Categories.Count();
            ViewBag.TotalProducts = _context.Products.Count();
            ViewBag.TotalCustomers = _context.Customers.Count();
            ViewBag.TotalOrders = _context.Orders.Count();

            var latestPosts = _context.Posts
                .Include(p => p.Category)
                .OrderByDescending(p => p.CreatedDate)
                .Take(5)
                .ToList();

            var latestUsers = _context.Users
                .OrderByDescending(u => u.Id)
                .Take(5)
                .ToList();

            var latestProducts = _context.Products
                .Include(p => p.CategoryProduct)
                .OrderByDescending(p => p.Id)
                .Take(5)
                .ToList();

            ViewBag.LatestPosts = latestPosts;
            ViewBag.LatestUsers = latestUsers;
            ViewBag.LatestProducts = latestProducts;

            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

