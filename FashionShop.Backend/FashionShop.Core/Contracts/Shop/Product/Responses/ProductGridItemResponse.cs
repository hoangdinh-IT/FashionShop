using FashionShop.Core.Contracts.Shop.ProductImage.Responses;
using FashionShop.Core.Contracts.Shop.ProductVariant.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.Product.Responses
{
    public class ProductGridItemResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public decimal Price { get; set; }
        public string ThumbnailUrl { get; set; }
        public bool IsBestSeller { get; set; } = false;
        public bool IsNew { get; set; } = true;
        public List<ShopProductColorDto> ProductColors { get; set; }
        public List<ShopProductSizeDto> ProductSizes { get; set; }
        public List<ShopProductVariantDto> ProductVariants { get; set; }
    }
}
