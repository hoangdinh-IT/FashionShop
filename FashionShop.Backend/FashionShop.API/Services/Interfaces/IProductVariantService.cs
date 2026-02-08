using FashionShop.Core.DTOs.ProductVariant;
using FashionShop.Core.Entities;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.ProductVariants;

namespace FashionShop.API.Services.Interfaces
{
    public interface IProductVariantService
    {
        Task<ProductVariantDTO> CreateProductVariantAsync(CreateProductVariantDTO dto);
        Task<PagedResult<ProductVariantDTO>> GetPagedProductVariantsAsync(ProductVariantListRequest request);
        Task<ProductVariantDTO?> GetProductVariantByIdAsync(Guid productVariantId);
        Task<ProductVariantDTO?> UpdateProductVariantAsync(Guid productVariantId, UpdateProductVariantDTO dto);
        Task DeleteProductVariantAsync(Guid productVariantId);
    }
}
