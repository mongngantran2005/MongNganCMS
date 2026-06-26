using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
namespace CMS.Backend.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrdersApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly CMS.Backend.Services.IEmailSender _emailSender;

        public OrdersApiController(ApplicationDbContext context, CMS.Backend.Services.IEmailSender emailSender)
        {
            _context = context;
            _emailSender = emailSender;
        }

        public class OrderRequest
        {
            public int CustomerId { get; set; }
            public string FullName { get; set; }
            public string Email { get; set; }
            public string Phone { get; set; }
            public string ShippingAddress { get; set; }
            public string PaymentMethod { get; set; }
            public string Notes { get; set; }
            public List<OrderDetailRequest> Items { get; set; }
        }

        public class OrderDetailRequest
        {
            public int ProductId { get; set; }
            public int Quantity { get; set; }
            public decimal UnitPrice { get; set; }
        }

        /// <summary>
        /// Khởi tạo một đơn hàng mới từ giỏ hàng
        /// </summary>
        /// <param name="request">Danh sách sản phẩm trong giỏ và thông tin đặt hàng</param>
        /// <returns>Mã đơn hàng mới tạo</returns>
        [HttpPost]
        public IActionResult CreateOrder([FromBody] OrderRequest request)
        {
            if (request.Items == null || request.Items.Count == 0)
                return BadRequest(new { message = "Giỏ hàng trống" });

            using var transaction = _context.Database.BeginTransaction();
            try
            {
                var order = new Order
                {
                    CustomerId = request.CustomerId,
                    OrderDate = DateTime.Now,
                    Status = 0, // Chờ duyệt
                    Notes = request.Notes,
                    FullName = request.FullName,
                    Phone = request.Phone,
                    ShippingAddress = request.ShippingAddress,
                    PaymentMethod = request.PaymentMethod
                };

                _context.Orders.Add(order);
                _context.SaveChanges(); // Lấy OrderId

                foreach (var item in request.Items)
                {
                    var orderDetail = new OrderDetail
                    {
                        OrderId = order.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice
                    };
                    _context.OrderDetails.Add(orderDetail);
                    
                    // Trừ tồn kho
                    var product = _context.Products.Find(item.ProductId);
                    if (product != null)
                    {
                        product.StockQuantity -= item.Quantity;
                        if (product.StockQuantity < 0) product.StockQuantity = 0;
                    }
                }

                _context.SaveChanges();
                transaction.Commit();

                if (!string.IsNullOrEmpty(request.Email))
                {
                    string subject = $"Xác nhận đơn hàng #{order.Id} từ MongNganCMS";
                    string body = $"<h3>Chào {request.FullName},</h3>" +
                                  $"<p>Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là <b>#{order.Id}</b>.</p>" +
                                  $"<p>Chúng tôi sẽ sớm liên hệ để giao hàng.</p>";
                    _ = _emailSender.SendEmailAsync(request.Email, subject, body);
                }

                return Ok(new { message = "Đặt hàng thành công", orderId = order.Id });
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return StatusCode(500, new { message = "Lỗi khi đặt hàng", error = ex.Message });
            }
        }

        [HttpGet("customer/{customerId}")]
        public IActionResult GetByCustomer(int customerId)
        {
            var orders = _context.Orders
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    o.Notes,
                    TotalAmount = _context.OrderDetails.Where(od => od.OrderId == o.Id).Sum(od => od.Quantity * od.UnitPrice),
                    Items = _context.OrderDetails
                        .Where(od => od.OrderId == o.Id)
                        .Select(od => new {
                            od.ProductId,
                            od.Quantity,
                            od.UnitPrice,
                            ProductName = _context.Products.FirstOrDefault(p => p.Id == od.ProductId).Name,
                            ImageUrl = _context.Products.FirstOrDefault(p => p.Id == od.ProductId).ImageUrl
                        }).ToList()
                })
                .ToList();

            return Ok(orders);
        }

        [HttpGet("{id}")]
        public IActionResult GetOrderById(int id)
        {
            var order = _context.Orders
                .Where(o => o.Id == id)
                .Select(o => new {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    o.Notes,
                    o.FullName,
                    o.Phone,
                    o.ShippingAddress,
                    o.PaymentMethod,
                    TotalAmount = _context.OrderDetails
                        .Where(od => od.OrderId == o.Id && od.Status == 0)
                        .Sum(od => od.Quantity * od.UnitPrice),
                    Items = _context.OrderDetails
                        .Where(od => od.OrderId == o.Id)
                        .Select(od => new {
                            OrderDetailId = od.Id,
                            od.ProductId,
                            od.Quantity,
                            od.UnitPrice,
                            od.Status,
                            od.CancelReason,
                            ProductName = _context.Products.FirstOrDefault(p => p.Id == od.ProductId).Name,
                            ImageUrl = _context.Products.FirstOrDefault(p => p.Id == od.ProductId).ImageUrl
                        }).ToList()
                })
                .FirstOrDefault();

            if (order == null) return NotFound();

            return Ok(order);
        }

        [HttpPut("{id}/cancel")]
        public IActionResult CancelOrder(int id)
        {
            var order = _context.Orders.Find(id);
            if (order == null) return NotFound();

            if (order.Status != 0)
            {
                return BadRequest(new { message = "Chỉ có thể hủy đơn hàng khi đang ở trạng thái Chờ xác nhận." });
            }

            order.Status = 4; // 4 = Đã hủy
            _context.SaveChanges();

            return Ok(new { message = "Hủy đơn hàng thành công" });
        }

        public class UpdateMultipleRequest
        {
            public List<int> OrderIds { get; set; }
            public int Status { get; set; }
        }

        [HttpPut("update-multiple")]
        public IActionResult UpdateMultipleOrders([FromBody] UpdateMultipleRequest request)
        {
            if (request.OrderIds == null || request.OrderIds.Count == 0)
                return BadRequest(new { message = "Không có đơn hàng nào được chọn." });

            var orders = _context.Orders.Where(o => request.OrderIds.Contains(o.Id)).ToList();
            int count = 0;
            
            foreach (var order in orders)
            {
                // Optionally validate status transitions here if needed
                // 0: Chờ xác nhận, 1: Chờ vận chuyển, 2: Chờ giao hàng, 3: Hoàn thành, 4: Đã hủy
                order.Status = request.Status;
                count++;
            }

            if (count > 0)
            {
                _context.SaveChanges();
            }

            return Ok(new { message = $"Đã cập nhật trạng thái {count} đơn hàng thành công." });
        }

        [HttpGet("admin/search")]
        public IActionResult GetAdminOrders([FromQuery] string? keyword, [FromQuery] int? status, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = _context.Orders.AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(o => 
                    (o.Id.ToString() == keyword) || 
                    (o.FullName != null && o.FullName.Contains(keyword)) ||
                    (o.Phone != null && o.Phone.Contains(keyword)) ||
                    (o.Customer != null && o.Customer.FullName.Contains(keyword)) ||
                    (o.Customer != null && o.Customer.Phone.Contains(keyword)));
            }

            if (status.HasValue && status.Value != -1)
            {
                query = query.Where(o => o.Status == status.Value);
            }

            if (startDate.HasValue)
            {
                query = query.Where(o => o.OrderDate.Date >= startDate.Value.Date);
            }

            if (endDate.HasValue)
            {
                query = query.Where(o => o.OrderDate.Date <= endDate.Value.Date);
            }

            int totalCount = query.Count();
            int totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var orders = query
                .OrderByDescending(o => o.OrderDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(o => new {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    o.Notes,
                    FullName = o.Customer != null ? o.Customer.FullName : o.FullName,
                    Phone = o.Customer != null ? o.Customer.Phone : o.Phone,
                    TotalAmount = _context.OrderDetails.Where(od => od.OrderId == o.Id).Sum(od => od.Quantity * od.UnitPrice)
                })
                .ToList();

            return Ok(new {
                items = orders,
                totalCount,
                totalPages,
                page,
                pageSize
            });
        }
        public class CancelItemRequest
        {
            public int OrderDetailId { get; set; }
            public string CancelReason { get; set; } = "";
        }

        /// <summary>
        /// Admin hủy một sản phẩm trong đơn hàng vì không thể giao.
        /// Hoàn trả tồn kho, cập nhật lại tổng tiền đơn, gửi email khách.
        /// </summary>
        [HttpPost("cancel-item")]
        public async Task<IActionResult> CancelOrderItem([FromBody] CancelItemRequest request)
        {
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                // 1. Tìm chi tiết đơn hàng
                var detail = _context.OrderDetails
                    .Include(od => od.Order)
                        .ThenInclude(o => o.Customer)
                    .Include(od => od.Product)
                    .FirstOrDefault(od => od.Id == request.OrderDetailId);

                if (detail == null)
                    return NotFound(new { message = "Không tìm thấy chi tiết đơn hàng." });

                if (detail.Status == 1)
                    return BadRequest(new { message = "Sản phẩm này đã bị hủy trước đó." });

                // 2. Cập nhật trạng thái OrderDetail = Cancelled (1) + lưu lý do hủy
                decimal refundAmount = detail.UnitPrice * detail.Quantity;
                detail.Status = 1;
                detail.CancelReason = request.CancelReason;

                // 3. Hoàn trả tồn kho
                if (detail.Product != null)
                {
                    detail.Product.StockQuantity += detail.Quantity;
                }

                _context.SaveChanges();
                transaction.Commit();

                // 4. Lấy email khách hàng từ Order.Customer
                string? customerEmail = detail.Order?.Customer?.Email;
                string customerName = detail.Order?.FullName
                                      ?? detail.Order?.Customer?.FullName
                                      ?? "Quý khách";
                string productName = detail.Product?.Name ?? $"Sản phẩm #{detail.ProductId}";
                int orderId = detail.OrderId;

                // 5. Gửi email thông báo hủy sản phẩm
                if (!string.IsNullOrEmpty(customerEmail))
                {
                    string subject = $"[MongNgan] Thông báo hủy sản phẩm trong đơn hàng #{orderId}";
                    string body = $@"
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                            <div style='background-color: #306E51; padding: 20px; text-align: center;'>
                                <h2 style='color: white; margin: 0;'>MongNgan Beauty</h2>
                            </div>
                            <div style='padding: 30px; background-color: #f9f9f9;'>
                                <h3 style='color: #333;'>Xin chào {customerName},</h3>
                                <p style='color: #555;'>Rất tiếc, chúng tôi cần thông báo rằng một sản phẩm trong đơn hàng <strong style='color: #306E51;'>#{orderId}</strong> của bạn không thể giao được.</p>
                                <div style='background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 20px 0;'>
                                    <p style='margin: 0 0 8px; color: #888; font-size: 13px;'>SẢN PHẨM BỊ HỦY</p>
                                    <p style='margin: 0 0 6px; font-weight: bold; color: #333;'>{productName}</p>
                                    <p style='margin: 0 0 6px; color: #555;'>Lý do: <span style='color: #dc2626;'>{request.CancelReason}</span></p>
                                    <p style='margin: 0; color: #555;'>Số tiền hoàn lại: <strong style='color: #FF6600; font-size: 16px;'>{refundAmount:N0} ₫</strong></p>
                                </div>
                                <p style='color: #555;'>Số tiền <strong>{refundAmount:N0} ₫</strong> sẽ được hoàn lại vào phương thức thanh toán của bạn trong 3-5 ngày làm việc.</p>
                                <p style='color: #555;'>Nếu có thắc mắc, vui lòng liên hệ chúng tôi qua email hoặc hotline.</p>
                            </div>
                            <div style='background-color: #f0f0f0; padding: 16px; text-align: center;'>
                                <p style='margin: 0; font-size: 13px; color: #888;'>© 2025 MongNgan Beauty. All rights reserved.</p>
                            </div>
                        </div>";

                    _ = _emailSender.SendEmailAsync(customerEmail, subject, body);
                }

                return Ok(new
                {
                    message = $"Đã hủy sản phẩm '{productName}'. Số tiền hoàn lại: {refundAmount:N0} ₫",
                    refundAmount,
                    productName,
                    orderId
                });
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return StatusCode(500, new { message = "Lỗi khi hủy sản phẩm.", error = ex.Message });
            }
        }
    }
}
