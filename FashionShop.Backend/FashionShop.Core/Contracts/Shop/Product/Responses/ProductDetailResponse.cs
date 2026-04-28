using FashionShop.Core.Contracts.Shop.ProductImage.Responses;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.Product.Responses
{
    public class ProductDetailResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public string Content { get; set; }
        public string Material { get; set; }
        public decimal Price { get; set; }
        public string ThumbnailUrl { get; set; }
        public bool IsNew { get; set; }
        public bool IsBestSeller { get; set; }
        public List<ShopProductSizeDto> ProductSizes { get; set; }
        public List<ShopProductColorDto> ProductColors { get; set; }
        public List<ShopProductVariantDto> ProductVariants { get; set; }
        public List<ShopProductImageResponse> ProductImages { get; set; }
    }
}
