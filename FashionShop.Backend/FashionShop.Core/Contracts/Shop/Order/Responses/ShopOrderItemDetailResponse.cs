using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.Order.Responses
{
    public class ShopOrderItemDetailResponse
    {
        public int OrderItemId { get; set; }
        public Guid ProductVariantId { get; set; }
        public string ProductName { get; set; }
        public string VariantName { get; set; } // Ví dụ: "Đỏ - XL"
        public string? ImageUrl { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal TotalLine { get; set; }
        public bool IsReviewed { get; set; }
    }
}
