using FashionShop.Core.Contracts.Admin.Order.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.Order.Responses
{
    public class ShopOrderDetailResponse
    {
        // --- Thông tin định danh & Trạng thái ---
        public Guid OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public string OrderStatus { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentStatus { get; set; }
        public string? ShippingTrackingCode { get; set; }
        public DateTime? PaymentDate { get; set; }

        // --- Thông tin khách hàng & Giao hàng ---
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string ShippingAddress { get; set; }
        public string ShippingCommune { get; set; }
        public string ShippingDistrict { get; set; }
        public string ShippingCity { get; set; }
        public string? Note { get; set; }

        // --- Thông tin tài chính (Hiển thị ở Footer Modal) ---
        public decimal SubTotal { get; set; }
        public decimal ShippingFee { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TotalAmount { get; set; }

        // --- Danh sách mặt hàng chi tiết ---
        public List<ShopOrderItemDetailResponse> OrderItems { get; set; } = new List<ShopOrderItemDetailResponse>();
    }
}
