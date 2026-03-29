using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace FashionShop.Core.Contracts.ProductVariant.Requests
{
    public class CreateProductVariantRequest
    {
        [Required]
        public Guid ProductId { get; set; }

        [Required]
        public int ColorId { get; set; }

        [Required]
        public int SizeId { get; set; }

        [Required]
        [MaxLength(50, ErrorMessage = "SKU không được quá 50 kí tự!")]
        public string SKU { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int Quantity { get; set; } = 0;

        [Required]
        public decimal Price { get; set; }
    }
}
