namespace FashionShop.Core.Contracts.Shop.Coupon.Responses
{
    public class ShopCouponUsageResponse
    {
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public Guid CouponId { get; set; }
        public Guid OrderId { get; set; }
        public DateTime UsedDate { get; set; }
    }
}
