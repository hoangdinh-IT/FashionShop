using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.DTOs.ProductVariant
{
    public class UpdateProductVariantDTO
    {
        public Guid? Id { get; set; }
        [Required]
        public int ColorId { get; set; }

        [Required]
        public int SizeId { get; set; }

        [Required]
        [MaxLength(50, ErrorMessage = "SKU không được quá 50 kí tự!")]
        public string sku { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int Quantity { get; set; } = 0;

        [Required]
        public decimal Price { get; set; }
        public bool IsActive { get; set; }
    }
}
