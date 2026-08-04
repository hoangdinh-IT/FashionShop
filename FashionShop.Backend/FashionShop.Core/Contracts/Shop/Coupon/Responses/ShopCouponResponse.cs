using FashionShop.Core.Enums;

namespace FashionShop.Core.Contracts.Shop.Coupon.Responses
{
    public class ShopCouponResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public DiscountType DiscountType { get; set; } = DiscountType.FixedAmount;
        public decimal DiscountAmount { get; set; }
        public decimal? MaxDiscountAmount { get; set; }
        public decimal MinOrderValue { get; set; }
        public int Quantity { get; set; }
        public int UsedCount { get; set; } = 0;
        public int RemainingUsagePerUser { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
