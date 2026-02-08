using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.DTOs.ProductVariant
{
    public class ProductVariantDTO
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public int ColorId { get; set; }
        public int SizeId { get; set; }
        public string SKU { get; set; }
        public int Quantity { get; set; } = 0;
        public decimal Price { get; set; }
        public string ProductName { get; set; }
        public string ColorName { get; set; }  
        public string ColorCode { get; set; }  
        public string SizeName { get; set; }
        public string? VariantImageUrl { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
