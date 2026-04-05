using FashionShop.Core.Contracts.Shop.ProductImage.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.ProductVariant.Responses
{
    public class ShopProductVariantResponse
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public int ColorId { get; set; }
        public int SizeId { get; set; }
        public string ColorName { get; set; }
        public string ColorHexCode { get; set; }
        public string SizeName { get; set; }
        public string SKU { get; set; }
        public int Quantity { get; set; } = 0;
        public decimal Price { get; set; }
        public IEnumerable<ShopProductImageResponse>? ProductImages { get; set; }
    }
}
