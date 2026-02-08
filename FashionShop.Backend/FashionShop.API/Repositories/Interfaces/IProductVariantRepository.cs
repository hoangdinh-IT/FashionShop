using FashionShop.Core.DTOs.ProductVariant;
using FashionShop.Core.Entities;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.ProductVariants;

namespace FashionShop.API.Repositories.Interfaces
{
    public interface IProductVariantRepository
    {
        // HÀM CHÍNH
        Task<ProductVariant> CreateProductVariantAsync(ProductVariant productVariant);
        Task<PagedResult<ProductVariantDTO>> GetPagedProductVariantsAsync(ProductVariantListRequest request);
        Task<ProductVariantDTO?> GetProductVariantByIdAsync(Guid productVariantId);
        Task<ProductVariant> UpdateProductVariantAsync(ProductVariant productVariant);
        Task DeleteProductVariantAsync(ProductVariant productVariant);



        // HÀM PHỤ
        Task<bool> CheckExistSKUAsync(string sku);
        Task<ProductVariant?> FindProductVariantByIdAsync(Guid productVariantId);
    }
}
