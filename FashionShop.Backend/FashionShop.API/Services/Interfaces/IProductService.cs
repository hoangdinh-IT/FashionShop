using FashionShop.Core.DTOs.Product;
using FashionShop.Core.DTOs.ProductImage;
using FashionShop.Core.DTOs.ProductVariant;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.Products;
using FashionShop.Core.Models.ProductVariants;

namespace FashionShop.API.Services.Interfaces
{
    public interface IProductService
    {
        #region 1. PRODUCTS

        // --- READ METHODS --- //
        Task<PagedResult<ProductDTO>> GetPagedProductsAsync(ProductListRequest request);
        Task<ProductDTO?> GetProductByIdAsync(Guid productId);
        Task<ProductDetailDTO?> GetProductDetailByIdAsync(Guid productId);

        // --- WRITE METHODS --- //
        Task<ProductDTO?> CreateProductAsync(CreateProductDTO dto);
        Task<ProductDetailDTO?> CreateProductDetailAsync(CreateProductDetailDTO dto);
        Task<ProductDTO?> UpdateProductAsync(Guid productId, UpdateProductDTO dto);
        Task<ProductDetailDTO?> UpdateProductDetailAsync(Guid productId, UpdateProductDetailDTO dto);
        Task DeleteProductAsync(Guid productId);
        Task DeleteProductDetailAsync(Guid productId);
        #endregion


        #region 2. PRODUCT VARIANTS

        // --- READ METHODS --- //
        Task<PagedResult<ProductVariantDTO>> GetPagedProductVariantsAsync(ProductVariantListRequest request);
        Task<ProductVariantDTO?> GetProductVariantByIdAsync(Guid productVariantId);
        Task<List<ProductVariantDTO>> GetProductVariantsByProductIdAsync(Guid productId);

        // --- WRITE METHODS --- //
        Task<ProductVariantDTO> CreateProductVariantAsync(CreateProductVariantDTO dto);
        Task<ProductVariantDTO?> UpdateProductVariantAsync(Guid productVariantId, UpdateProductVariantDTO dto);
        Task DeleteProductVariantAsync(Guid productVariantId);
        #endregion


        #region 3. PRODUCT IMAGES

        // --- READ METHODS --- //
        Task<IEnumerable<ProductImageDTO>> GetProductImagesAsync(Guid productId, int? colorId);
        Task<ProductImageDTO?> GetProductImageByIdAsync(Guid productImageId);

        // --- WRITE METHODS --- //
        Task<ProductImageDTO> CreateProductImageAsync(CreateProductImageDTO dto);
        Task<ProductImageDTO?> UpdateProductImageAsync(Guid productImageId, UpdateProductImageDTO dto);
        Task DeleteProductImageAsync(Guid productImageId);
        #endregion
    }
}
