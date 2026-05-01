using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.Order.Responses
{
    public class ShopOrderResponse
    {
        public Guid Id { get; set; }
        public DateTime OrderDate { get; set; }

        // Thông tin địa chỉ giao hàng
        public string ShippingAddress { get; set; }
        public string ShippingCommune { get; set; }
        public string ShippingDistrict { get; set; }
        public string ShippingCity { get; set; }

        // Trạng thái
        public string OrderStatus { get; set; } // Trả về chuỗi để FE dễ hiển thị
        public string PaymentMethod { get; set; }
        public string PaymentStatus { get; set; }

        // Tài chính
        public decimal SubTotal { get; set; }
        public decimal ShippingFee { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TotalAmount { get; set; }

        // Khác
        public string? Note { get; set; }
        public string? ShippingTrackingCode { get; set; }
        public DateTime? PaymentDate { get; set; }

        // Danh sách chi tiết các sản phẩm trong đơn
        public List<ShopOrderDetailResponse> OrderDetails { get; set; } = new List<ShopOrderDetailResponse>();
    }
}
