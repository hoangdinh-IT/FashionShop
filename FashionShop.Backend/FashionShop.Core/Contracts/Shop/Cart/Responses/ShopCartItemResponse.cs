using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.Cart.Responses
{
    public class ShopCartItemResponse
    {
        public int Id { get; set; }
        public Guid CartId { get; set; }
        public Guid ProductVariantId { get; set; }
        public int Quantity { get; set; } = 1;
        public bool IsSelected { get; set; } = true;

        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductSlug { get; set; }
        public string BrandName { get; set; }
        public string ImageUrl { get; set; }

        public int ColorId { get; set; }
        public string ColorName { get; set; }
        public int SizeId { get; set; }
        public string SizeName { get; set; }

        public decimal UnitPrice { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedDate { get; set; } = null;
    }
}
