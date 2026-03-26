using FashionShop.Core.DTOs.Product;
using FashionShop.Core.DTOs.ProductImage;
using FashionShop.Core.DTOs.ProductVariant;
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

        #region 1. PRODUCTS

        // --- READ METHODS --- //
        Task<PagedResult<ProductDTO>> GetPagedProductsAsync(ProductListRequest request);
        Task<ProductDTO?> GetProductByIdAsync(Guid productId);
        Task<Product?> FindProductByIdAsync(Guid productId);
        Task<ProductDetailDTO?> GetProductDetailByIdAsync(Guid productId);

        // --- VALIDATION METHODS --- //
        Task<bool> CheckExistSlugAsync(string slug);

        // --- WRITE METHODS --- //
        Task<Product> CreateProductAsync(Product product);
        Task<Product> UpdateProductAsync(Product product);
        Task DeleteProductAsync(Product product);
        #endregion


        #region 2. PRODUCT VARIANTS

        // --- READ METHODS --- //
        Task<PagedResult<ProductVariantDTO>> GetPagedProductVariantsAsync(ProductVariantListRequest request);
        Task<ProductVariantDTO?> GetProductVariantByIdAsync(Guid productVariantId);
        Task<ProductVariant?> FindProductVariantByIdAsync(Guid productVariantId);
        Task<List<ProductVariantDTO>> GetProductVariantsByProductIdAsync(Guid productId);

        // --- VALIDATION METHODS --- //
        Task<bool> CheckExistSKUAsync(string sku);

        // --- WRITE METHODS --- //
        Task<ProductVariant> CreateProductVariantAsync(ProductVariant productVariant);
        Task<ProductVariant> UpdateProductVariantAsync(ProductVariant productVariant);
        Task DeleteProductVariantAsync(ProductVariant productVariant);
        #endregion


        #region 3. PRODUCT IMAGES

        // --- READ METHODS --- //
        Task<IEnumerable<ProductImageDTO>> GetProductImagesAsync(Guid productId, int? colorId);
        Task<ProductImageDTO?> GetProductImageByIdAsync(Guid productImageId);
        Task<ProductImage?> FindProductImageByIdAsync(Guid productImageId);
        Task<int> GetMaxSortOrder(Guid productId, int colorId);

        // --- VALIDATION METHODS --- //
        Task<bool> CheckExistProductVariant(Guid productId, int colorId);

        // --- WRITE METHODS --- //
        Task<ProductImage> CreateProductImageAsync(ProductImage productImage);
        Task<ProductImage> UpdateProductImageAsync(ProductImage productImage);
        Task DeleteProductImageAsync(ProductImage productImage);
        #endregion
    }
}
