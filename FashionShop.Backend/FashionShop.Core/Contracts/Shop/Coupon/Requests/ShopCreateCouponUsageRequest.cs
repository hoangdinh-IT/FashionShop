using System.ComponentModel.DataAnnotations;

namespace FashionShop.Core.Contracts.Shop.Coupon.Requests
{
    public class ShopCreateCouponUsageRequest
    {
        [Required(ErrorMessage = "Phiếu giảm giá (CouponId) là bắt buộc.")]
        public Guid CouponId { get; set; }

        [Required(ErrorMessage = "Mã đơn hàng (OrderId) là bắt buộc.")]
        public Guid OrderId { get; set; }

        [Required(ErrorMessage = "Thời gian sử dụng (UsedDate) là bắt buộc.")]
        [DataType(DataType.DateTime)]
        public DateTime UsedDate { get; set; } = DateTime.UtcNow;
    }
}
