using FashionShop.Core.Contracts.Shop.ProductVariant.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.Product.Responses
{
    public class ShopProductResponse
    {
        public Guid Id { get; set; }
        public Guid CategoryId { get; set; }
        public Guid BrandId { get; set; }
        public string Name { get; set; }
        public string CategoryName { get; set; }
        public string BrandName { get; set; }
        public string Slug { get; set; }
        public string Description { get; set; }
        public string Content { get; set; }
        public string Material { get; set; }
        public decimal Price { get; set; }
        public string ThumbnailUrl { get; set; }
        public bool IsBestSeller { get; set; } = false;
        public bool IsNew { get; set; } = true;
        public IEnumerable<ShopProductVariantResponse>? ProductVariants { get; set; }
    }
}
