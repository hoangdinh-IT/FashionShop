using FashionShop.Core.Contracts.Admin.Color.Responses;
using FashionShop.Core.Contracts.Admin.Product.Requests;
using FashionShop.Core.Contracts.Admin.Product.Responses;
using FashionShop.Core.Contracts.Admin.ProductImage.Responses;
using FashionShop.Core.Contracts.Admin.ProductVariant.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Models;
using Microsoft.EntityFrameworkCore.Storage;

namespace FashionShop.API.Repositories.Admin.Interfaces
{
    public interface IAdminProductRepository
    {
        #region 1. PRODUCTS



        // --- READ METHODS --- //

        Task<PagedResult<AdminProductResponse>> GetPagedProductsAsync(AdminProductListRequest request);
        Task<AdminProductResponse?> GetProductByIdAsync(Guid productId);
        Task<Product?> FindProductByIdAsync(Guid productId);
        Task<AdminProductDetailResponse?> GetProductDetailByIdAsync(Guid productId);
        Task<Product?> FindProductDetailByIdAsync(Guid productId);
        Task<List<AdminColorResponse>> GetColorsByProductIdAsync(Guid productId);



        // --- VALIDATION METHODS --- //

        Task<bool> CheckExistSlugAsync(string slug);



        // --- WRITE METHODS --- //

        void CreateProduct(Product product);
        void DeleteProduct(Product product);
        #endregion


        #region 2. PRODUCT VARIANTS



        // --- READ METHODS --- //

        //Task<PagedResult<ProductVariantResponse>> GetPagedProductVariantsAsync(ProductVariantListRequest request);
        Task<AdminProductVariantResponse?> GetProductVariantByIdAsync(Guid productVariantId);
        Task<ProductVariant?> FindProductVariantByIdAsync(Guid productVariantId);
        Task<List<AdminProductVariantResponse>> GetProductVariantsByProductIdAsync(Guid productId);



        // --- VALIDATION METHODS --- //

        Task<bool> CheckExistSKUAsync(string sku);



        // --- WRITE METHODS --- //

        void CreateProductVariant(ProductVariant productVariant);
        void DeleteProductVariant(ProductVariant productVariant);
        #endregion


        #region 3. PRODUCT IMAGES



        // --- READ METHODS --- //

        Task<IEnumerable<AdminProductImageResponse>> GetProductImagesAsync(Guid productId, int? colorId);
        Task<IEnumerable<ProductImage>> FindProductImagesAsync(Guid productId);
        Task<AdminProductImageResponse?> GetProductImageByIdAsync(Guid productImageId);
        Task<ProductImage?> FindProductImageByIdAsync(Guid productImageId);
        Task<List<ProductImage>> GetProductImagesForUpdateAsync(Guid productId, int? colorId);
        Task<int> GetMaxSortOrder(Guid productId, int? colorId);
        Task<IEnumerable<ProductImage>> GetImagesByProductIdAndColorIdAsync(Guid productId, int? colorId);



        // --- VALIDATION METHODS --- //

        Task<bool> CheckExistProductVariant(Guid productId, int colorId);



        // --- WRITE METHODS --- //

        void CreateProductImage(ProductImage productImage);
        void DeleteProductImage(ProductImage productImage);
        #endregion
    }
}
