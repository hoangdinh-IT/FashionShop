using FashionShop.Core.Contracts.Color.Responses;
using FashionShop.Core.Contracts.Product.Responses;
using FashionShop.Core.Contracts.ProductImage.Responses;
using FashionShop.Core.Contracts.ProductVariant.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.Products;
using FashionShop.Core.Models.ProductVariants;
using Microsoft.EntityFrameworkCore.Storage;

namespace FashionShop.API.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<IDbContextTransaction> BeginTransactionAsync();
        Task<int> SaveChangesAsync();

        #region 1. PRODUCTS

        // --- READ METHODS --- //
        Task<PagedResult<ProductResponse>> GetPagedProductsAsync(ProductListRequest request);
        Task<ProductResponse?> GetProductByIdAsync(Guid productId);
        Task<Product?> FindProductByIdAsync(Guid productId);
        Task<ProductDetailResponse?> GetProductDetailByIdAsync(Guid productId);
        Task<List<ColorResponse>> GetColorsByProductIdAsync(Guid productId);

        // --- VALIDATION METHODS --- //
        Task<bool> CheckExistSlugAsync(string slug);

        // --- WRITE METHODS --- //
        Task<Product> CreateProductAsync(Product product);
        Task<Product> UpdateProductAsync(Product product);
        Task DeleteProductAsync(Product product);
        #endregion


        #region 2. PRODUCT VARIANTS

        // --- READ METHODS --- //
        Task<PagedResult<ProductVariantResponse>> GetPagedProductVariantsAsync(ProductVariantListRequest request);
        Task<ProductVariantResponse?> GetProductVariantByIdAsync(Guid productVariantId);
        Task<ProductVariant?> FindProductVariantByIdAsync(Guid productVariantId);
        Task<List<ProductVariantResponse>> GetProductVariantsByProductIdAsync(Guid productId);

        // --- VALIDATION METHODS --- //
        Task<bool> CheckExistSKUAsync(string sku);

        // --- WRITE METHODS --- //
        Task<ProductVariant> CreateProductVariantAsync(ProductVariant productVariant);
        Task<ProductVariant> UpdateProductVariantAsync(ProductVariant productVariant);
        Task DeleteProductVariantAsync(ProductVariant productVariant);
        #endregion


        #region 3. PRODUCT IMAGES

        // --- READ METHODS --- //
        Task<IEnumerable<ProductImageResponse>> GetProductImagesAsync(Guid productId, int? colorId);
        Task<ProductImageResponse?> GetProductImageByIdAsync(Guid productImageId);
        Task<ProductImage?> FindProductImageByIdAsync(Guid productImageId);
        Task<List<ProductImage>> GetProductImagesForUpdateAsync(Guid productId, int? colorId);
        Task<int> GetMaxSortOrder(Guid productId, int? colorId);
        Task<IEnumerable<ProductImage>> GetImagesByProductIdAndColorIdAsync(Guid productId, int? colorId);

        // --- VALIDATION METHODS --- //
        Task<bool> CheckExistProductVariant(Guid productId, int colorId);

        // --- WRITE METHODS --- //
        Task<ProductImage> CreateProductImageAsync(ProductImage productImage);
        Task<ProductImage> UpdateProductImageAsync(ProductImage productImage);
        Task DeleteProductImageAsync(ProductImage productImage);
        #endregion
    }
}
