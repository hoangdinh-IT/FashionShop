using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.DTOs.Category
{
    public class UpdateCategoryDTO
    {
        [Required]
        [MaxLength(100, ErrorMessage = "Tên danh mục không được vượt quá 100 ký tự!")]
        public string Name { get; set; }

        [MaxLength(500, ErrorMessage = "Mô tả không được vượt quá 500 ký tự!")]
        public string? Description { get; set; }

        [Required]
        [MaxLength(100, ErrorMessage = "Slug danh mục không được vượt quá 100 ký tự!")]
        public string Slug { get; set; }
        public Guid? ParentId { get; set; }
        public IFormFile? Image { get; set; }
        public bool IsActive { get; set; }
        public bool IsImageDeleted { get; set; } = false;
    }
}
