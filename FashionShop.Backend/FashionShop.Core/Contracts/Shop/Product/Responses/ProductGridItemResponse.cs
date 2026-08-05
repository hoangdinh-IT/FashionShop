namespace FashionShop.Core.Contracts.Shop.Product.Responses
{
    public class ProductGridItemResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public decimal OriginalPrice { get; set; }
        public decimal DiscountPercent { get; set; }
        public decimal FinalPrice { get; set; }
        public string ThumbnailUrl { get; set; }
        public bool IsNew { get; set; } 
        public bool IsBestSeller { get; set; }
        public List<ShopProductSizeDto> ProductSizes { get; set; }
        public List<ShopProductColorDto> ProductColors { get; set; }
        public List<ShopProductVariantDto> ProductVariants { get; set; }
    }
}
