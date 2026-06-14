using System;
using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    public class Banner
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tiêu đề banner không được để trống")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Ảnh banner không được để trống")]
        public string ImageUrl { get; set; }

        public string? TargetUrl { get; set; }

        public bool IsActive { get; set; } = true;

        public int DisplayOrder { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
