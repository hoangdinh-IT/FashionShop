using FashionShop.Core.Contracts.Admin.Color.Responses;
using FashionShop.Core.Contracts.Admin.Product.Requests;
using FashionShop.Core.Contracts.Admin.Product.Responses;
using FashionShop.Core.Contracts.Admin.ProductImage.Requests;
using FashionShop.Core.Contracts.Admin.ProductImage.Responses;
using FashionShop.Core.Contracts.Admin.ProductVariant.Requests;
using FashionShop.Core.Contracts.Admin.ProductVariant.Responses;
using FashionShop.Core.Models;

namespace FashionShop.API.Services.Admin.Interfaces
{
    public interface IAdminProductService
    {
        #region 1. PRODUCTS



        // --- READ METHODS --- //

        Task<PagedResult<AdminProductResponse>> GetPagedProductsAsync(AdminProductListRequest request);
        Task<AdminProductResponse?> GetProductByIdAsync(Guid productId);
        Task<AdminProductDetailResponse?> GetProductDetailByIdAsync(Guid productId);
        Task<List<AdminColorResponse>> GetColorsByProductIdAsync(Guid productId);



        // --- WRITE METHODS --- //

        Task<AdminProductResponse?> CreateProductAsync(CreateProductRequest dto);
        Task<AdminProductDetailResponse?> CreateProductDetailAsync(CreateProductDetailRequest dto);
        Task<AdminProductResponse?> UpdateProductAsync(Guid productId, UpdateProductRequest dto);
        Task<AdminProductDetailResponse?> UpdateProductDetailAsync(Guid productId, UpdateProductDetailRequest dto);
        Task DeleteProductAsync(Guid productId);
        Task DeleteProductDetailAsync(Guid productId);
        #endregion


        #region 2. PRODUCT VARIANTS



        // --- READ METHODS --- //

        //Task<PagedResult<ProductVariantResponse>> GetPagedProductVariantsAsync(ProductVariantListRequest request);
        Task<AdminProductVariantResponse?> GetProductVariantByIdAsync(Guid productVariantId);
        Task<List<AdminProductVariantResponse>> GetProductVariantsByProductIdAsync(Guid productId);



        // --- WRITE METHODS --- //

        Task<AdminProductVariantResponse> CreateProductVariantAsync(CreateProductVariantRequest dto);
        Task<AdminProductVariantResponse?> UpdateProductVariantAsync(Guid productVariantId, UpdateProductVariantRequest dto);
        Task DeleteProductVariantAsync(Guid productVariantId);
        #endregion


        #region 3. PRODUCT IMAGES



        // --- READ METHODS --- //

        Task<IEnumerable<AdminProductImageResponse>> GetProductImagesAsync(Guid productId, int? colorId);
        Task<AdminProductImageResponse?> GetProductImageByIdAsync(Guid productImageId);



        // --- WRITE METHODS --- //

        Task<List<AdminProductImageResponse>> CreateProductImageAsync(Guid productId, CreateProductImagesRequest dto);
        //Task<ProductImageResponse?> UpdateProductImageAsync(Guid productImageId, UpdateProductImageRequest dto);
        Task<IEnumerable<AdminProductImageResponse>> UpdateSortOrderAsync(Guid productId, UpdateSortOrderRequest request);
        Task DeleteProductImageAsync(Guid productId, DeleteProductImagesRequest? request);
        #endregion
    }
}
