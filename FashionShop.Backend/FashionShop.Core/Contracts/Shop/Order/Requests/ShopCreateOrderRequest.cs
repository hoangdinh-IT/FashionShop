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
        // Thông tin địa chỉ giao hàng
        //[Required(ErrorMessage = "Vui lòng nhập địa chỉ cụ thể")]
        //[MaxLength(200)]
        //public string ShippingAddress { get; set; }

        //[Required(ErrorMessage = "Vui lòng chọn Phường/Xã")]
        //[MaxLength(200)]
        //public string ShippingCommune { get; set; }

        //[Required(ErrorMessage = "Vui lòng chọn Quận/Huyện")]
        //[MaxLength(200)]
        //public string ShippingDistrict { get; set; }

        //[Required(ErrorMessage = "Vui lòng chọn Tỉnh/Thành phố")]
        //[MaxLength(200)]
        //public string ShippingCity { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn địa chỉ giao hàng")]
        public Guid AddressId { get; set; }

        // Thông tin thanh toán & giảm giá
        [Required]
        public PaymentMethod PaymentMethod { get; set; }

        public Guid? VoucherId { get; set; }

        [MaxLength(500)]
        public string? Note { get; set; }

        // Danh sách sản phẩm đặt mua
        [Required]
        [MinLength(1, ErrorMessage = "Đơn hàng phải có ít nhất một sản phẩm")]
        public List<ShopOrderItemRequest> OrderItems { get; set; } = new List<ShopOrderItemRequest>();
    }
}
