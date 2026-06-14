using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/customers/{customerId}/addresses")]
    [ApiController]
    public class CustomerAddressesApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomerAddressesApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/customers/{customerId}/addresses
        [HttpGet]
        public async Task<IActionResult> GetAddresses(int customerId)
        {
            try
            {
                var addresses = await _context.CustomerAddresses
                    .Where(a => a.CustomerId == customerId)
                    .OrderByDescending(a => a.IsDefault)
                    .ToListAsync();
                return Ok(addresses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tải danh sách địa chỉ. Vui lòng chạy migration để tạo bảng CustomerAddresses.", detail = ex.Message });
            }
        }

        public class AddressRequest
        {
            public string FullName { get; set; }
            public string Phone { get; set; }
            public string Province { get; set; }
            public string District { get; set; }
            public string Ward { get; set; }
            public string StreetAddress { get; set; }
            public string AddressType { get; set; } = "Nhà riêng";
            public bool IsDefault { get; set; } = false;
        }

        // POST: api/customers/{customerId}/addresses
        [HttpPost]
        public async Task<IActionResult> AddAddress(int customerId, [FromBody] AddressRequest req)
        {
            var customer = await _context.Customers.FindAsync(customerId);
            if (customer == null) return NotFound(new { message = "Không tìm thấy khách hàng." });

            // Nếu đặt làm mặc định, bỏ mặc định các địa chỉ khác
            if (req.IsDefault)
            {
                var existing = _context.CustomerAddresses.Where(a => a.CustomerId == customerId && a.IsDefault);
                foreach (var a in existing) a.IsDefault = false;
            }

            var address = new CustomerAddress
            {
                CustomerId = customerId,
                FullName = req.FullName,
                Phone = req.Phone,
                Province = req.Province,
                District = req.District,
                Ward = req.Ward,
                StreetAddress = req.StreetAddress,
                AddressType = req.AddressType ?? "Nhà riêng",
                IsDefault = req.IsDefault
            };

            _context.CustomerAddresses.Add(address);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Thêm địa chỉ thành công", id = address.Id });
        }

        // PUT: api/customers/{customerId}/addresses/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAddress(int customerId, int id, [FromBody] AddressRequest req)
        {
            var address = await _context.CustomerAddresses
                .FirstOrDefaultAsync(a => a.Id == id && a.CustomerId == customerId);
            if (address == null) return NotFound(new { message = "Không tìm thấy địa chỉ." });

            if (req.IsDefault)
            {
                var others = _context.CustomerAddresses.Where(a => a.CustomerId == customerId && a.IsDefault && a.Id != id);
                foreach (var a in others) a.IsDefault = false;
            }

            address.FullName = req.FullName;
            address.Phone = req.Phone;
            address.Province = req.Province;
            address.District = req.District;
            address.Ward = req.Ward;
            address.StreetAddress = req.StreetAddress;
            address.AddressType = req.AddressType ?? "Nhà riêng";
            address.IsDefault = req.IsDefault;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật địa chỉ thành công" });
        }

        // DELETE: api/customers/{customerId}/addresses/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAddress(int customerId, int id)
        {
            var address = await _context.CustomerAddresses
                .FirstOrDefaultAsync(a => a.Id == id && a.CustomerId == customerId);
            if (address == null) return NotFound(new { message = "Không tìm thấy địa chỉ." });

            _context.CustomerAddresses.Remove(address);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã xóa địa chỉ" });
        }

        // PUT: api/customers/{customerId}/addresses/{id}/set-default
        [HttpPut("{id}/set-default")]
        public async Task<IActionResult> SetDefault(int customerId, int id)
        {
            var others = _context.CustomerAddresses.Where(a => a.CustomerId == customerId && a.IsDefault);
            foreach (var a in others) a.IsDefault = false;

            var address = await _context.CustomerAddresses
                .FirstOrDefaultAsync(a => a.Id == id && a.CustomerId == customerId);
            if (address == null) return NotFound();

            address.IsDefault = true;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã đặt làm địa chỉ mặc định" });
        }
    }
}
