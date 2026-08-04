using FashionShop.Core.Contracts.Shared;
using FashionShop.Core.Enums;

namespace FashionShop.Core.Contracts.Admin.Coupon.Requests
{
    public class AdminCouponListRequest : PagingBase
    {
        public string? Keyword { get; set; }
        public DiscountType? DiscountType { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string? Status { get; set; } // Upcoming - Ongoing - Expired
        public bool? IsAvailable { get; set; }
        public decimal? FromMinOrderValue { get; set; }
        public decimal? ToMinOrderValue { get; set; }
    }
}
