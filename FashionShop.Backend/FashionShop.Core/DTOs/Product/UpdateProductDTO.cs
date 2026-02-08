using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.DTOs.Product
{
    public class UpdateProductDTO
    {
        [Required]
        public Guid CategoryId { get; set; }

        [Required]
        public Guid BrandId { get; set; }

        [Required]
        [MaxLength(200, ErrorMessage = "Tên sản phẩm không được quá 200 kí tự!")]
        public string Name { get; set; }

        [Required]
        [MaxLength(200, ErrorMessage = "Slug không được quá 200 kí tự!")]
        public string Slug { get; set; }

        [Required]
        [MaxLength(500, ErrorMessage = "Mô tả không được quá 500 kí tự!")]
        public string Description { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        [MaxLength(100, ErrorMessage = "Chất liệu không được quá 100 kí tự!")]
        public string Material { get; set; }

        [Required]
        public decimal Price { get; set; }

        public IFormFile? Thumbnail { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsBestSeller { get; set; } = false;
        public bool IsNew { get; set; } = true;
    }
}
