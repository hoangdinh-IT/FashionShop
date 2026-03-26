using FashionShop.Core.DTOs.ProductVariant;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.DTOs.Product
{
    public class ProductDetailDTO
    {
        public Guid Id { get; set; }
        public Guid CategoryId { get; set; }
        public Guid BrandId { get; set; }
        public string CategoryName { get; set; }
        public string BrandName { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public string Description { get; set; }
        public string Content { get; set; }
        public string Material { get; set; }
        public decimal Price { get; set; }
        public string ThumbnailUrl { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsBestSeller { get; set; } = false;
        public bool IsNew { get; set; } = true;
        public int ViewCount { get; set; } = 0;
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool IsDeleted { get; set; } = false;
        public List<ProductVariantDTO> ProductVariants { get; set; }
    }
}
