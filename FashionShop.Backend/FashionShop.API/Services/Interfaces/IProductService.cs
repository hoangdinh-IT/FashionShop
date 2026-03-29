using FashionShop.Core.Contracts.Color.Responses;
using FashionShop.Core.Contracts.Product.Requests;
using FashionShop.Core.Contracts.Product.Responses;
using FashionShop.Core.Contracts.ProductImage.Requests;
using FashionShop.Core.Contracts.ProductImage.Responses;
using FashionShop.Core.Contracts.ProductVariant.Requests;
using FashionShop.Core.Contracts.ProductVariant.Responses;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.Products;
using FashionShop.Core.Models.ProductVariants;

namespace FashionShop.API.Services.Interfaces
{
    public interface IProductService
    {
        #region 1. PRODUCTS

        // --- READ METHODS --- //
        Task<PagedResult<ProductResponse>> GetPagedProductsAsync(ProductListRequest request);
        Task<ProductResponse?> GetProductByIdAsync(Guid productId);
        Task<ProductDetailResponse?> GetProductDetailByIdAsync(Guid productId);
        Task<List<ColorResponse>> GetColorsByProductIdAsync(Guid productId);

        // --- WRITE METHODS --- //
        Task<ProductResponse?> CreateProductAsync(CreateProductRequest dto);
        Task<ProductDetailResponse?> CreateProductDetailAsync(CreateProductDetailRequest dto);
        Task<ProductResponse?> UpdateProductAsync(Guid productId, UpdateProductRequest dto);
        Task<ProductDetailResponse?> UpdateProductDetailAsync(Guid productId, UpdateProductDetailRequest dto);
        Task DeleteProductAsync(Guid productId);
        Task DeleteProductDetailAsync(Guid productId);
        #endregion


        #region 2. PRODUCT VARIANTS

        // --- READ METHODS --- //
        Task<PagedResult<ProductVariantResponse>> GetPagedProductVariantsAsync(ProductVariantListRequest request);
        Task<ProductVariantResponse?> GetProductVariantByIdAsync(Guid productVariantId);
        Task<List<ProductVariantResponse>> GetProductVariantsByProductIdAsync(Guid productId);

        // --- WRITE METHODS --- //
        Task<ProductVariantResponse> CreateProductVariantAsync(CreateProductVariantRequest dto);
        Task<ProductVariantResponse?> UpdateProductVariantAsync(Guid productVariantId, UpdateProductVariantRequest dto);
        Task DeleteProductVariantAsync(Guid productVariantId);
        #endregion


        #region 3. PRODUCT IMAGES

        // --- READ METHODS --- //
        Task<IEnumerable<ProductImageResponse>> GetProductImagesAsync(Guid productId, int? colorId);
        Task<ProductImageResponse?> GetProductImageByIdAsync(Guid productImageId);

        // --- WRITE METHODS --- //
        Task<List<ProductImageResponse>> CreateProductImageAsync(CreateProductImageRequest dto);
        Task<ProductImageResponse?> UpdateProductImageAsync(Guid productImageId, UpdateProductImageRequest dto);
        Task DeleteProductImageAsync(Guid productImageId);
        #endregion
    }
}
