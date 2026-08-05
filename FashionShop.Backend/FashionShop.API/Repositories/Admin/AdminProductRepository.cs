using FashionShop.API.Data;
using FashionShop.API.Repositories.Admin.Interfaces;
using FashionShop.Core.Contracts.Admin.Color.Responses;
using FashionShop.Core.Contracts.Admin.Product.Requests;
using FashionShop.Core.Contracts.Admin.Product.Responses;
using FashionShop.Core.Contracts.Admin.ProductImage.Responses;
using FashionShop.Core.Contracts.Admin.ProductVariant.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Extensions;
using FashionShop.Core.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FashionShop.API.Repositories.Admin
{
    public class AdminProductRepository : IAdminProductRepository
    {
        private readonly FashionDbContext _context;

        private static readonly Expression<Func<Product, AdminProductResponse>> _productSelector =
            p => new AdminProductResponse
            {
                Id = p.Id,
                CategoryId = p.CategoryId,
                BrandId = p.BrandId,
                Name = p.Name,
                CategoryName = p.Category.Name,
                BrandName = p.Brand.Name,
                Slug = p.Slug,
                Description = p.Description,
                Material = p.Material,
                OriginalPrice = p.OriginalPrice,
                DiscountPercent = p.DiscountPercent,
                FinalPrice = Math.Ceiling((p.OriginalPrice * (1m - p.DiscountPercent / 100m)) / 1000m) * 1000m,
                ThumbnailUrl = p.ThumbnailUrl,
                IsActive = p.IsActive,
                IsBestSeller = p.IsBestSeller,
                IsNew = p.IsNew,
                ViewCount = p.ViewCount,
                CreatedDate = p.CreatedDate,
                UpdatedDate = p.UpdatedDate,
            };

        private static readonly Expression<Func<ProductVariant, AdminProductVariantResponse>> _productVariantSelector =
            x => new AdminProductVariantResponse
            {
                Id = x.Id,
                ProductId = x.ProductId,
                ColorId = x.ColorId,
                SizeId = x.SizeId,
                ColorName = x.Color.Name,
                ColorHexCode = x.Color.HexCode,
                SizeName = x.Size.Name,
                Sku = x.Sku,
                StockQuantity = x.StockQuantity,
                IsActive = x.IsActive,
                CreatedDate = x.CreatedDate,
                UpdatedDate = x.UpdatedDate,
                IsDeleted = x.IsDeleted,
            };

        private static readonly Expression<Func<ProductImage, AdminProductImageResponse>> _productImageSelector =
            x => new AdminProductImageResponse
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

        private static readonly Expression<Func<Product, AdminProductDetailResponse>> _productDetailSelector =
            pd => new AdminProductDetailResponse
            {
                Id = pd.Id,
                CategoryId = pd.CategoryId,
                BrandId = pd.BrandId,
                Name = pd.Name,
                Slug = pd.Slug,
                Description = pd.Description,
                Material = pd.Material,
                OriginalPrice = pd.OriginalPrice,
                DiscountPercent = pd.DiscountPercent,
                FinalPrice = Math.Ceiling((pd.OriginalPrice * (1m - pd.DiscountPercent / 100m)) / 1000m) * 1000m,
                ThumbnailUrl = pd.ThumbnailUrl,
                IsActive = pd.IsActive,
                IsBestSeller = pd.IsBestSeller,
                IsNew = pd.IsNew,
                ViewCount = pd.ViewCount,
                CreatedDate = pd.CreatedDate,
                UpdatedDate = pd.UpdatedDate,
                ProductVariants = pd.ProductVariants
                    .OrderBy(v => v.ColorId)
                    .ThenBy(v => v.SizeId)
                    .Select(v => new AdminProductVariantResponse
                    {
                        Id = v.Id,
                        ProductId = v.ProductId,
                        ColorId = v.ColorId,
                        SizeId = v.SizeId,
                        Sku = v.Sku,
                        StockQuantity = v.StockQuantity,
                        IsActive = v.IsActive,
                        CreatedDate = v.CreatedDate,
                        UpdatedDate = v.UpdatedDate,
                        IsDeleted = v.IsDeleted,
                    })
                    .ToList()
            };

        public AdminProductRepository(FashionDbContext context)
        {
            _context = context;
        }

        #region 1. PRODUCTS



        // --- READ METHODS --- //

        public async Task<PagedResult<AdminProductResponse>> GetPagedProductsAsync(AdminProductListRequest request)
        {
            var query = _context.Products
                                .AsNoTracking()
                                .AsQueryable();

            query = query.FilterByKeyword(request.Keyword)
                         .FilterByCategoryId(request.CategoryId)
                         .FilterByBrandId(request.BrandId)
                         .FilterByActive(request.IsActive)
                         .FilterByBestSeller(request.IsBestSeller)
                         .FilterByNew(request.IsNew)
                         .FilterByPrice(request.MinPrice, request.MaxPrice)
                         .AdminSort(request.SortBy, request.IsAscending);

            var totalRecord = await query.CountAsync();

            var data = await query.Skip((request.PageIndex - 1) * request.PageSize)
                                  .Take(request.PageSize)
                                  .Select(_productSelector)
                                  .ToListAsync();

            return new PagedResult<AdminProductResponse>()
            {
                Items = data,
                TotalRecord = totalRecord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
            };
        }

        public async Task<AdminProductResponse?> GetProductByIdAsync(Guid productId)
        {
            return await _context.Products
                .AsNoTracking()
                .Where(prod => prod.Id == productId)
                .Select(_productSelector)
                .FirstOrDefaultAsync();
        }

        public async Task<Product?> FindProductByIdAsync(Guid productId)
            => await _context.Products.FindAsync(productId);

        public async Task<AdminProductDetailResponse?> GetProductDetailByIdAsync(Guid productId)
        {
            return await _context.Products
                .Where(prod => prod.Id == productId)
                .Select(_productDetailSelector)
                .FirstOrDefaultAsync();
        }

        public async Task<Product?> FindProductDetailByIdAsync(Guid productId)
        {
            return await _context.Products
                .Include(p => p.ProductVariants)
                .FirstOrDefaultAsync(p => p.Id == productId);
        }

        public async Task<List<AdminColorResponse>> GetColorsByProductIdAsync(Guid productId)
        {
            return await _context.ProductVariants
                .Where(pv => pv.ProductId == productId)
                .Select(pv => pv.Color)
                .Distinct()
                .Select(c => new AdminColorResponse
                {
                    Id = c.Id,
                    Name = c.Name,
                    HexCode = c.HexCode,
                })
                .ToListAsync();
        }



        // --- VALIDATION METHODS --- //

        public async Task<bool> CheckExistProductSlugAsync(string slug)
            => await _context.Products.AnyAsync(prod => prod.Slug == slug);



        // --- WRITE METHODS --- //

        public void CreateProduct(Product product)
        {
            _context.Products.Add(product);
        }

        public void DeleteProduct(Product product)
        {
            product.IsDeleted = true;
        }
        #endregion


        #region 2. PRODUCT VARIANTS



        // --- READ METHODS --- //

        public async Task<AdminProductVariantResponse?> GetProductVariantByIdAsync(Guid productVariantId)
        {
            return await _context.ProductVariants
                .Where(pv => pv.Id == productVariantId)
                .Select(_productVariantSelector)
                .FirstOrDefaultAsync();
        }

        public async Task<ProductVariant?> FindProductVariantByIdAsync(Guid productVariantId)
            => await _context.ProductVariants.FindAsync(productVariantId);

        public async Task<List<AdminProductVariantResponse>> GetProductVariantsByProductIdAsync(Guid productId)
        {
            return await _context.ProductVariants
                .Where(pv => pv.ProductId == productId)
                .Select(_productVariantSelector)
                .ToListAsync();
        }



        // --- VALIDATION METHODS --- //

        public async Task<bool> CheckExistVariantSkuAsync(string sku)
            => await _context.ProductVariants.AnyAsync(x => x.Sku == sku);

        public async Task<List<string>> GetExistingSkusAsync(List<string> requestedSkus)
        {
            return await _context.ProductVariants
                .Where(v => requestedSkus.Contains(v.Sku))
                .Select(v => v.Sku)
                .ToListAsync();
        }



        // --- WRITE METHODS --- //

        public void CreateProductVariant(ProductVariant productVariant)
        {
            _context.ProductVariants.Add(productVariant);
        }

        public void DeleteProductVariant(ProductVariant productVariant)
        {
            productVariant.IsDeleted = true;
        }
        #endregion


        #region 3. PRODUCT IMAGES



        // --- READ METHODS --- //

        public async Task<IEnumerable<AdminProductImageResponse>> GetProductImagesAsync(Guid productId, int? colorId)
        {
            var query = _context.ProductImages
                                .AsNoTracking()
                                .Where(x => x.ProductId == productId)
                                .Where(x => x.ColorId == null ||
                                    x.Product.ProductVariants.Any(v => v.ColorId == x.ColorId && v.IsDeleted == false));

            if (colorId.HasValue)
            {
                query = query.Where(x => x.ColorId == colorId.Value);
            }

            return await query.OrderBy(x => x.ColorId)
                              .ThenBy(x => x.SortOrder)
                              .Select(_productImageSelector)
                              .ToListAsync();
        }

        public async Task<IEnumerable<ProductImage>> FindProductImagesAsync(Guid productId)
        {
            return await _context.ProductImages
                .Where(x => x.ProductId == productId)
                .ToListAsync();
        }

        public async Task<AdminProductImageResponse?> GetProductImageByIdAsync(Guid productImageId)
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

        public void CreateProductImage(ProductImage productImage)
        {
            _context.ProductImages.Add(productImage);
        }

        public void DeleteProductImage(ProductImage productImage)
        {
            _context.ProductImages.Remove(productImage);
        }
        #endregion
    }
}
