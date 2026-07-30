using FashionShop.Core.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.Order.Requests
{
    public class ShopCreateOrderRequest
    {
        [Required(ErrorMessage = "Vui lòng chọn địa chỉ giao hàng")]
        public Guid AddressId { get; set; }

        // Thông tin thanh toán & giảm giá
        [Required]
        public PaymentMethod PaymentMethod { get; set; }

        public string? TransferCode { get; set; }

        public Guid? VoucherId { get; set; }

        [MaxLength(500)]
        public string? Note { get; set; }

        // Danh sách sản phẩm đặt mua
        [Required]
        [MinLength(1, ErrorMessage = "Đơn hàng phải có ít nhất một sản phẩm")]
        public List<ShopOrderItemRequest> OrderItems { get; set; } = new List<ShopOrderItemRequest>();
    }
}
