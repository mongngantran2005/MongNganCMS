using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    public class CustomerAddress
    {
        [Key]
        public int Id { get; set; }

        public int CustomerId { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        public string Phone { get; set; }

        public string? Province { get; set; }    // Tỉnh / TP
        public string? District { get; set; }    // Quận / Huyện
        public string? Ward { get; set; }        // Phường / Xã
        public string? StreetAddress { get; set; } // Số nhà + tên đường

        // Nhà riêng / Công ty
        public string AddressType { get; set; } = "Nhà riêng";

        public bool IsDefault { get; set; } = false;

        [ForeignKey("CustomerId")]
        public virtual Customer? Customer { get; set; }
    }
}
