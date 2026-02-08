using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace FashionShop.Core.DTOs.Product
{
    public class CreateProductDTO
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

        [Required]
        public IFormFile Thumbnail { get; set; }
    }
}
