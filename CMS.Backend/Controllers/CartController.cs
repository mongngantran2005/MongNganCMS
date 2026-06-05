using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Models;

namespace CMS.Backend.Controllers
{
    public class CartController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CartController(ApplicationDbContext context)
        {
            _context = context;
        }

        private string GetCartKey(int customerId)
        {
            return $"Cart_{customerId}";
        }

        private List<CartItem> GetCartItems(int customerId)
        {
            var session = HttpContext.Session;
            string key = GetCartKey(customerId);
            string? cartJson = session.GetString(key);
            if (string.IsNullOrEmpty(cartJson))
            {
                return new List<CartItem>();
            }
            try
            {
                return JsonSerializer.Deserialize<List<CartItem>>(cartJson) ?? new List<CartItem>();
            }
            catch
            {
                return new List<CartItem>();
            }
        }

        private void SaveCartItems(int customerId, List<CartItem> items)
        {
            var session = HttpContext.Session;
            string key = GetCartKey(customerId);
            string cartJson = JsonSerializer.Serialize(items);
            session.SetString(key, cartJson);
        }

        [HttpGet]
        public IActionResult Index()
        {
            var customerId = HttpContext.Session.GetInt32("CustomerId");
            if (customerId == null)
            {
                TempData["ErrorMessage"] = "Vui lòng đăng nhập để xem giỏ hàng!";
                return RedirectToAction("Login", "CustomerAccount");
            }

            var items = GetCartItems(customerId.Value);
            return View(items);
        }

        [HttpPost]
        public async Task<IActionResult> Add(int productId, int quantity = 1)
        {
            var customerId = HttpContext.Session.GetInt32("CustomerId");
            if (customerId == null)
            {
                TempData["ErrorMessage"] = "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!";
                return RedirectToAction("Login", "CustomerAccount");
            }

            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                return NotFound();
            }

            var items = GetCartItems(customerId.Value);
            var existingItem = items.FirstOrDefault(i => i.ProductId == productId);

            if (existingItem != null)
            {
                existingItem.Quantity += quantity;
                if (existingItem.Quantity > product.StockQuantity)
                {
                    existingItem.Quantity = product.StockQuantity;
                    TempData["WarningMessage"] = $"Sản phẩm {product.Name} chỉ còn tối đa {product.StockQuantity} trong kho!";
                }
            }
            else
            {
                int qtyToAdd = Math.Min(quantity, product.StockQuantity);
                if (qtyToAdd <= 0)
                {
                    TempData["ErrorMessage"] = $"Sản phẩm {product.Name} đã hết hàng!";
                    return RedirectToAction("Index");
                }

                items.Add(new CartItem
                {
                    ProductId = product.Id,
                    ProductName = product.Name,
                    Price = product.Price,
                    ImageUrl = product.ImageUrl,
                    Quantity = qtyToAdd
                });
            }

            SaveCartItems(customerId.Value, items);
            TempData["SuccessMessage"] = $"Đã thêm {product.Name} vào giỏ hàng!";
            return RedirectToAction("Index");
        }

        [HttpPost]
        public IActionResult UpdateQuantity(int productId, int quantity)
        {
            var customerId = HttpContext.Session.GetInt32("CustomerId");
            if (customerId == null)
            {
                return RedirectToAction("Login", "CustomerAccount");
            }

            if (quantity < 1) quantity = 1;

            var product = _context.Products.Find(productId);
            if (product != null && quantity > product.StockQuantity)
            {
                quantity = product.StockQuantity;
                TempData["WarningMessage"] = $"Chỉ còn tối đa {product.StockQuantity} sản phẩm trong kho!";
            }

            var items = GetCartItems(customerId.Value);
            var item = items.FirstOrDefault(i => i.ProductId == productId);
            if (item != null)
            {
                item.Quantity = quantity;
                SaveCartItems(customerId.Value, items);
            }

            return RedirectToAction("Index");
        }

        [HttpPost]
        public IActionResult Remove(int productId)
        {
            var customerId = HttpContext.Session.GetInt32("CustomerId");
            if (customerId == null)
            {
                return RedirectToAction("Login", "CustomerAccount");
            }

            var items = GetCartItems(customerId.Value);
            var item = items.FirstOrDefault(i => i.ProductId == productId);
            if (item != null)
            {
                items.Remove(item);
                SaveCartItems(customerId.Value, items);
                TempData["SuccessMessage"] = $"Đã xóa sản phẩm khỏi giỏ hàng!";
            }

            return RedirectToAction("Index");
        }

        [HttpPost]
        public async Task<IActionResult> Checkout(string? notes)
        {
            var customerId = HttpContext.Session.GetInt32("CustomerId");
            if (customerId == null)
            {
                return RedirectToAction("Login", "CustomerAccount");
            }

            var items = GetCartItems(customerId.Value);
            if (items.Count == 0)
            {
                TempData["ErrorMessage"] = "Giỏ hàng của bạn đang trống!";
                return RedirectToAction("Index");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var order = new Order
                {
                    CustomerId = customerId.Value,
                    OrderDate = DateTime.Now,
                    Status = 0, // Chờ duyệt
                    Notes = notes
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync(); // Sinh ra order.Id

                foreach (var item in items)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product == null)
                    {
                        throw new Exception($"Không tìm thấy sản phẩm với ID {item.ProductId}");
                    }

                    if (product.StockQuantity < item.Quantity)
                    {
                        throw new Exception($"Sản phẩm {product.Name} không đủ hàng tồn kho (còn {product.StockQuantity})!");
                    }

                    // Trừ tồn kho
                    product.StockQuantity -= item.Quantity;

                    var orderDetail = new OrderDetail
                    {
                        OrderId = order.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price // Dùng giá từ DB để bảo mật
                    };
                    _context.OrderDetails.Add(orderDetail);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Xóa giỏ hàng
                HttpContext.Session.Remove(GetCartKey(customerId.Value));

                TempData["SuccessMessage"] = "Đặt hàng thành công! Đơn hàng của bạn đang chờ phê duyệt.";
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                TempData["ErrorMessage"] = $"Đặt hàng thất bại: {ex.Message}";
                return RedirectToAction("Index");
            }
        }
    }
}
