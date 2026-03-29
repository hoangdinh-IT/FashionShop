using FashionShop.API.Data;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.Core.Contracts.Color.Responses;
using FashionShop.Core.Contracts.Product.Responses;
using FashionShop.Core.Contracts.ProductImage.Responses;
using FashionShop.Core.Contracts.ProductVariant.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Extensions;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.Products;
using FashionShop.Core.Models.ProductVariants;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System.Linq.Expressions;

namespace FashionShop.API.Repositories.Implements
{
    public class ProductRepository : IProductRepository
    {
        private readonly FashionDbContext _context;

        private static readonly Expression<Func<Product, ProductResponse>> _productSelector =
            x => new ProductResponse
            {
                Id = x.Id,
                CategoryId = x.CategoryId,
                BrandId = x.BrandId,
                Name = x.Name,
                CategoryName = x.Category.Name,
                BrandName = x.Brand.Name,
                Slug = x.Slug,
                Description = x.Description,
                Content = x.Content,
                Material = x.Material,
                Price = x.Price,
                ThumbnailUrl = x.ThumbnailUrl,
                IsActive = x.IsActive,
                IsBestSeller = x.IsBestSeller,
                IsNew = x.IsNew,
                ViewCount = x.ViewCount,
                CreatedDate = x.CreatedDate,
                UpdatedDate = x.UpdatedDate,
            };

        private static readonly Expression<Func<ProductVariant, ProductVariantResponse>> _productVariantSelector =
            x => new ProductVariantResponse
            {
                Id = x.Id,
                ProductId = x.ProductId,
                ColorId = x.ColorId,
                SizeId = x.SizeId,
                ColorName = x.Color.Name,
                ColorHexCode = x.Color.HexCode,
                SizeName = x.Size.Name,
                SKU = x.SKU,
                Quantity = x.Quantity,
                Price = x.Price,
                IsActive = x.IsActive,
                CreatedDate = x.CreatedDate,
                UpdatedDate = x.UpdatedDate,
                IsDeleted = x.IsDeleted,
            };

        private static readonly Expression<Func<ProductImage, ProductImageResponse>> _productImageSelector =
            x => new ProductImageResponse
            {
                Id = x.Id,
                ProductId = x.ProductId,
                ColorId = x.ColorId,
                ColorName = x.Color.Name,
                ColorHexCode = x.Color.HexCode,
                ImageUrl = x.ImageUrl,
                SortOrder = x.SortOrder,
                CreatedDate = x.CreatedDate,
                UpdatedDate = x.UpdatedDate,
            };

        private static readonly Expression<Func<Product, ProductDetailResponse>> _productDetailSelector =
            x => new ProductDetailResponse
            {
                Id = x.Id,
                CategoryId = x.CategoryId,
                BrandId = x.BrandId,
                Name = x.Name,
                Slug = x.Slug,
                Description = x.Description,
                Content = x.Content,
                Material = x.Material,
                Price = x.Price,
                ThumbnailUrl = x.ThumbnailUrl,
                IsActive = x.IsActive,
                IsBestSeller = x.IsBestSeller,
                IsNew = x.IsNew,
                ViewCount = x.ViewCount,
                CreatedDate = x.CreatedDate,
                UpdatedDate = x.UpdatedDate,
                ProductVariants = x.ProductVariants.Select(v => new ProductVariantResponse
                {
                    Id = v.Id,
                    ProductId = v.ProductId,
                    ColorId = v.ColorId,
                    SizeId = v.SizeId,
                    SKU = v.SKU,
                    Quantity = v.Quantity,
                    Price = v.Price,
                    IsActive = v.IsActive,
                    CreatedDate = v.CreatedDate,
                    UpdatedDate = v.UpdatedDate,
                    IsDeleted = v.IsDeleted,
                }).ToList()
            };

        public ProductRepository(FashionDbContext context)
        {
            _context = context;
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            // Mở Transaction từ Database Context
            return await _context.Database.BeginTransactionAsync();
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        #region 1. PRODUCTS

        // --- READ METHODS --- //
        public async Task<PagedResult<ProductResponse>> GetPagedProductsAsync(ProductListRequest request)
        {
            var query = _context.Products.AsNoTracking().AsQueryable();

            query = query.FilterByKeyword(request.Keyword)
                         .FilterByCategory(request.CategoryId)
                         .FilterByBrand(request.BrandId)
                         .FilterByActive(request.IsActive)
                         .FilterByBestSeller(request.IsBestSeller)
                         .FilterByNew(request.IsNew)
                         .FilterByPrice(request.MinPrice, request.MaxPrice);

            var totalRecorl = await query.CountAsync();

            var data = await query.Skip((request.PageIndex - 1) * request.PageSize)
                                  .Take(request.PageSize)
                                  .Select(_productSelector)
                                  .ToListAsync();

            return new PagedResult<ProductResponse>()
            {
                Items = data,
                TotalRecord = totalRecorl,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
            };
        }

        public async Task<ProductResponse?> GetProductByIdAsync(Guid productId)
        {
            return await _context.Products
                .AsNoTracking()
                .Where(prod => prod.Id == productId)
                .Select(_productSelector)
                .FirstOrDefaultAsync();
        }

        public async Task<Product?> FindProductByIdAsync(Guid productId)
            => await _context.Products.FindAsync(productId);

        public async Task<ProductDetailResponse?> GetProductDetailByIdAsync(Guid productId)
        {
            return await _context.Products
                .Where(prod => prod.Id == productId)
                .Select(_productDetailSelector)
                .FirstOrDefaultAsync();
        }

        public async Task<List<ColorResponse>> GetColorsByProductIdAsync(Guid productId)
        {
            return await _context.ProductVariants
                .Where(pv => pv.ProductId == productId)
                .Select(pv => pv.Color)
                .Distinct()
                .Select(c => new ColorResponse
                {
                    Id = c.Id,
                    Name = c.Name,
                    HexCode = c.HexCode,
                })
                .ToListAsync();
        }

        // --- VALIDATION METHODS --- //
        public async Task<bool> CheckExistSlugAsync(string slug)
            => await _context.Products.AnyAsync(prod => prod.Slug == slug);

        // --- WRITE METHODS --- //
        public async Task<Product> CreateProductAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<Product> UpdateProductAsync(Product product)
        {
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task DeleteProductAsync(Product product)
        {
            product.IsDeleted = true;
            await _context.SaveChangesAsync();
        }
        #endregion


        #region 2. PRODUCT VARIANTS

        // --- READ METHODS --- //
        public async Task<PagedResult<ProductVariantResponse>> GetPagedProductVariantsAsync(ProductVariantListRequest request)
        {
            var query = _context.ProductVariants.AsNoTracking().AsQueryable();

            query = query.FilterByKeyword(request.Keyword)
                         .FilterByProduct(request.ProductId)
                         .FilterByColor(request.ColorId)
                         .FilterBySize(request.SizeId)
                         .FilterByPrice(request.MinPrice, request.MaxPrice);

            var totalRecord = await query.CountAsync();

            var data = await query.Skip((request.PageIndex - 1) * request.PageSize)
                            .Take(request.PageSize)
                            .Select(_productVariantSelector)
                            .ToListAsync();

            return new PagedResult<ProductVariantResponse>()
            {
                Items = data,
                TotalRecord = totalRecord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
            };
        }

        public async Task<ProductVariantResponse?> GetProductVariantByIdAsync(Guid productVariantId)
        {
            return await _context.ProductVariants
                .Where(pv => pv.Id == productVariantId)
                .Select(_productVariantSelector)
                .FirstOrDefaultAsync();
        }

        public async Task<ProductVariant?> FindProductVariantByIdAsync(Guid productVariantId)
            => await _context.ProductVariants.FindAsync(productVariantId);

        public async Task<List<ProductVariantResponse>> GetProductVariantsByProductIdAsync(Guid productId)
        {
            return await _context.ProductVariants
                .Where(pv => pv.ProductId == productId)
                .Select(_productVariantSelector)
                .ToListAsync();
        }

        // --- VALIDATION METHODS --- //
        public async Task<bool> CheckExistSKUAsync(string sku)
            => await _context.ProductVariants.AnyAsync(x => x.SKU == sku);

        // --- WRITE METHODS --- //
        public async Task<ProductVariant> CreateProductVariantAsync(ProductVariant productVariant)
        {
            _context.ProductVariants.Add(productVariant);
            await _context.SaveChangesAsync();
            return productVariant;
        }

        public async Task<ProductVariant> UpdateProductVariantAsync(ProductVariant productVariant)
        {
            _context.ProductVariants.Update(productVariant);
            await _context.SaveChangesAsync();
            return productVariant;
        }

        public async Task DeleteProductVariantAsync(ProductVariant productVariant)
        {
            productVariant.IsDeleted = true;
            _context.ProductVariants.Update(productVariant);
            await _context.SaveChangesAsync();
        }
        #endregion


        #region 3. PRODUCT IMAGES

        // --- READ METHODS --- //
        public async Task<IEnumerable<ProductImageResponse>> GetProductImagesAsync(Guid productId, int? colorId)
        {
            var query = _context.ProductImages
                                .AsNoTracking()
                                .Where(x => x.ProductId == productId);

            if (colorId.HasValue)
            {
                query = query.Where(x => x.ColorId == colorId.Value);
            }

            return await query.OrderBy(x => x.ColorId)
                              .ThenBy(x => x.SortOrder)
                              .Select(_productImageSelector)
                              .ToListAsync();
        }

        public async Task<ProductImageResponse?> GetProductImageByIdAsync(Guid productImageId)
        {
            return await _context.ProductImages
                .AsNoTracking()
                .Where(x => x.Id == productImageId)
                .Select(_productImageSelector)
                .FirstOrDefaultAsync();
        }

        public async Task<ProductImage?> FindProductImageByIdAsync(Guid productImageId)
            => await _context.ProductImages.FindAsync(productImageId);

        public async Task<List<ProductImage>> GetProductImagesForUpdateAsync(Guid productId, int? colorId)
        {
            return await _context.ProductImages
                .Where(x => x.ProductId == productId && x.ColorId == colorId)
                .OrderBy(x => x.SortOrder)
                .ToListAsync();
        }

        public async Task<int> GetMaxSortOrder(Guid productId, int? colorId)
        {
            return await _context.ProductImages
                .Where(x => x.ProductId == productId && x.ColorId == colorId)
                .MaxAsync(x => (int?)x.SortOrder) ?? 0;
        }

        public async Task<IEnumerable<ProductImage>> GetImagesByProductIdAndColorIdAsync(Guid productId, int? colorId)
        {
            return await _context.ProductImages
                .Where(x => x.ProductId == productId && x.ColorId == colorId)
                .ToListAsync();
        }

        // --- VALIDATION METHODS --- //
        public async Task<bool> CheckExistProductVariant(Guid productId, int colorId)
            => await _context.ProductVariants.AnyAsync(x => 
                x.ProductId == productId && 
                x.ColorId == colorId
            );

        // --- WRITE METHODS --- //
        public async Task<ProductImage> CreateProductImageAsync(ProductImage productImage)
        {
            _context.ProductImages.Add(productImage);
            await _context.SaveChangesAsync();
            return productImage;
        }

        public async Task<ProductImage> UpdateProductImageAsync(ProductImage productImage)
        {
            _context.ProductImages.Update(productImage);
            await _context.SaveChangesAsync();
            return productImage;
        }

        public async Task DeleteProductImageAsync(ProductImage productImage)
        {
            _context.ProductImages.Remove(productImage);
            await _context.SaveChangesAsync();
        }
        #endregion
    }
}
