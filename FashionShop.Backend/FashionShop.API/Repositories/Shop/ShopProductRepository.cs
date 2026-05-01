using FashionShop.API.Data;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Repositories.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Color.Responses;
using FashionShop.Core.Contracts.Shop.Product.Requests;
using FashionShop.Core.Contracts.Shop.Product.Responses;
using FashionShop.Core.Contracts.Shop.ProductImage.Responses;
using FashionShop.Core.Contracts.Shop.ProductVariant.Responses;
using FashionShop.Core.Contracts.Shop.Size.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Extensions;
using FashionShop.Core.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FashionShop.API.Repositories.Shop
{
    public class ShopProductRepository : IShopProductRepository
    {
        private readonly FashionDbContext _context;

        public ShopProductRepository(FashionDbContext context)
        {
            _context = context;
        }

        private static readonly Expression<Func<Product, ProductGridItemResponse>> _productGridItemSelector =
            p => new ProductGridItemResponse
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                Price = p.Price,
                ThumbnailUrl = p.ThumbnailUrl,
                IsBestSeller = p.IsBestSeller,
                IsNew = p.IsNew,

                ProductSizes = p.ProductVariants != null
                    ? p.ProductVariants
                        .Select(v => v.Size)
                        .Distinct()
                        .Select(s => new ShopProductSizeDto
                        {
                            SizeId = s.Id,
                            SizeName = s.Name,
                        })
                        .OrderBy(dto => dto.SizeId)
                        .ToList()
                    : new List<ShopProductSizeDto>(),

                ProductColors = p.ProductVariants != null
                    ? p.ProductVariants
                        .Where(v => v.StockQuantity > 0)
                        .GroupBy(v => v.Color)
                        .OrderBy(g => g.Min(v => v.CreatedDate))
                        .Select(g => g.Key)
                        .Select(c => new ShopProductColorDto
                        {
                            ColorId = c.Id,
                            ColorName = c.Name,
                            ColorHexCode = c.HexCode,
                            ImageUrl = p.ProductImages
                                .Where(pi => pi.ColorId == c.Id)
                                .OrderBy(pi => pi.SortOrder)
                                .Select(pi => pi.ImageUrl)
                                .FirstOrDefault() ?? p.ThumbnailUrl
                        })
                        .ToList()
                    : new List<ShopProductColorDto>(),

                ProductVariants = p.ProductVariants != null
                    ? p.ProductVariants
                        .Select(v => new ShopProductVariantDto
                        {
                            ProductVariantId = v.Id,
                            ColorId = v.ColorId,
                            SizeId = v.SizeId,
                            Quantity = v.StockQuantity,
                        })
                        .ToList()
                    : new List<ShopProductVariantDto>(),
            };

        private static readonly Expression<Func<Product, ProductDetailResponse>> _productDetailSelector =
            p => new ProductDetailResponse
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                Content = p.Content,
                Price = p.Price,
                ThumbnailUrl = p.ThumbnailUrl,
                IsNew = p.IsNew,
                IsBestSeller = p.IsBestSeller,
                ProductSizes = p.ProductVariants != null
                    ? p.ProductVariants
                        .Select(v => v.Size)
                        .Distinct()
                        .Select(s => new ShopProductSizeDto
                        {
                            SizeId = s.Id,
                            SizeName = s.Name,
                        })
                        .OrderBy(dto => dto.SizeId)
                        .ToList()
                    : new List<ShopProductSizeDto>(),

                ProductColors = p.ProductVariants != null
                    ? p.ProductVariants
                        .Where(v => v.StockQuantity > 0)
                        .GroupBy(v => v.Color)
                        .OrderBy(g => g.Min(v => v.CreatedDate))
                        .Select(g => g.Key)
                        .Select(c => new ShopProductColorDto
                        {
                            ColorId = c.Id,
                            ColorName = c.Name,
                            ColorHexCode = c.HexCode,
                            ImageUrl = p.ProductImages
                                .Where(pi => pi.ColorId == c.Id)
                                .OrderBy(pi => pi.SortOrder)
                                .Select(pi => pi.ImageUrl)
                                .FirstOrDefault() ?? p.ThumbnailUrl
                        })
                        .ToList()
                    : new List<ShopProductColorDto>(),

                ProductVariants = p.ProductVariants != null
                    ? p.ProductVariants
                        .Select(v => new ShopProductVariantDto
                        {
                            ProductVariantId = v.Id,
                            ColorId = v.ColorId,
                            SizeId = v.SizeId,
                            Quantity = v.StockQuantity,
                        })
                        .ToList()
                    : new List<ShopProductVariantDto>(),

                ProductImages = p.ProductImages != null
                    ? p.ProductImages
                        .Select(x => new ShopProductImageResponse
                        {
                            ImageId = x.Id,
                            ProductId = p.Id,
                            ColorId = x.ColorId,
                            ImageUrl = x.ImageUrl,
                            SortOrder = x.SortOrder,
                        })
                        .ToList()
                    : new List<ShopProductImageResponse>(),
            };

        // --- READ METHODS --- //

        public async Task<PagedResult<ProductGridItemResponse>> GetPagedProductsAsync(ShopProductListRequest request)
        {
            var query = _context.Products
                .Where(p => p.IsActive)
                .AsNoTracking()
                .AsQueryable();

            query = query.FilterByKeyword(request.Keyword)
                         .FilterByCategorySlug(request.CategorySlug)
                         .FilterByBrandSlug(request.BrandSlug)
                         .FilterBySize(request.SizeSlugs)
                         .FilterByColor(request.ColorSlug)
                         .FilterByBestSeller(request.IsBestSeller)
                         .FilterByNew(request.IsNew)
                         .FilterByPriceRange(request.PriceRange)
                         .ShopSort(request.SortBy);

            var totalRecord = await query.CountAsync();

            var data = await query.Skip((request.PageIndex - 1) * request.PageSize)
                                  .Take(request.PageSize)
                                  .Select(_productGridItemSelector)
                                  .AsSplitQuery()
                                  .ToListAsync();

            return new PagedResult<ProductGridItemResponse>()
            {
                Items = data,
                TotalRecord = totalRecord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
            };
        }

        public async Task<ProductVariant?> FindProductVariantByIdAsync(Guid productVariantId)
        {
            return await _context.ProductVariants.FindAsync(productVariantId);
        }

        public async Task<ProductDetailResponse?> GetProductBySlugAsync(string productSlug)
        {
            return await _context.Products
                .AsNoTracking()
                .AsSplitQuery()
                .Where(p => p.Slug == productSlug)
                .Select(_productDetailSelector)
                .FirstOrDefaultAsync();
        }

        public async Task<ShopFilterOptionsResponse?> GetFilterOptionsAsync(ShopFilterOptionsRequest request)
        {
            var query = _context.Products
                .Where(p => p.IsActive)
                .AsNoTracking()
                .AsQueryable();

            query = query.FilterByBrandSlug(request.BrandSlug)
                         .FilterByCategorySlug(request.CategorySlug);

            var hasProducts = await query.AnyAsync();
            if (!hasProducts)
            {
                return new ShopFilterOptionsResponse
                {
                    AvailableColors = new List<ShopColorResponse>(),
                    AvailableSizes = new List<ShopSizeResponse>(),
                    BrandName = "",
                    CategoryName = "",
                };
            }

            var colors = await query
                .SelectMany(p => p.ProductVariants)
                .Where(v => v.Color != null)
                .Select(v => v.Color)
                .Distinct()
                .Select(c => new ShopColorResponse
                {
                    Id = c.Id,
                    Name = c.Name,
                    Slug = c.Slug,
                    HexCode = c.HexCode,
                })
                .ToListAsync();

            var sizes = await query
                .SelectMany(p => p.ProductVariants)
                .Where(v => v.Size != null)
                .Select(v => v.Size)
                .Distinct()
                .Select(c => new ShopSizeResponse
                {
                    Id = c.Id,
                    Name = c.Name,
                    Slug = c.Slug,
                })
                .ToListAsync();

            var brandName = await _context.Brands
                .Where(x => x.Slug == request.BrandSlug)
                .Select(x => x.Name)
                .FirstOrDefaultAsync();

            var categoryName = await _context.Categories
                .Where(x => x.Slug == request.CategorySlug)
                .Select(x => x.Name)
                .FirstOrDefaultAsync();

            return new ShopFilterOptionsResponse
            {
                AvailableColors = colors,
                AvailableSizes = sizes,
                BrandName = brandName,
                CategoryName = categoryName,
            };
        }



        // --- WRITE METHODS --- //
    }
}
