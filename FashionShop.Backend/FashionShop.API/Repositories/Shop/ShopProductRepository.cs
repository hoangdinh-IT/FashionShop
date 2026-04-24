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

        private static readonly Expression<Func<Product, ProductGridItemResponse>> _productSelector =
            p => new ProductGridItemResponse
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                Price = p.Price,
                ThumbnailUrl = p.ThumbnailUrl,
                IsBestSeller = p.IsBestSeller,
                IsNew = p.IsNew,

                ProductColors = p.ProductVariants != null
                    ? p.ProductVariants
                        .Where(v => v.Quantity > 0)
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

                ProductSizes = p.ProductVariants != null
                    ? p.ProductVariants
                        .Select(v => v.Size)
                        .Distinct()
                        .Select(s => new ShopProductSizeDto
                        {
                            SizeId = s.Id,
                            SizeName = s.Name,
                            IsOutOfStock = false
                        })
                        .OrderBy(dto => dto.SizeId)
                        .ToList()
                    : new List<ShopProductSizeDto>(),

                ProductVariants = p.ProductVariants != null
                    ? p.ProductVariants
                        .Select(v => new ShopProductVariantDto
                        {
                            ColorId = v.ColorId,
                            SizeId = v.SizeId,
                            Quantity = v.Quantity,
                        })
                        .ToList()
                    : new List<ShopProductVariantDto>(),
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
                         .FilterByColor(request.ColorId)
                         .FilterBySize(request.SizeIds)
                         .FilterByBestSeller(request.IsBestSeller)
                         .FilterByNew(request.IsNew)
                         .FilterByPriceRange(request.PriceRange)
                         .SortByPrice(request.IsAscendingPrice)
                         .Sort(request.SortBy, request.IsAscending);

            var totalRecord = await query.CountAsync();

            var data = await query.Skip((request.PageIndex - 1) * request.PageSize)
                                  .Take(request.PageSize)
                                  .Select(_productSelector)
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

        public async Task<ProductGridItemResponse?> GetProductByIdAsync(Guid productId)
        {
            return await _context.Products
                .AsNoTracking()
                .Select(_productSelector)
                .FirstOrDefaultAsync(p => p.Id == productId);
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
                };
            }

            var priceRange = await query
                .GroupBy(p => 1)
                .Select(g => new
                {
                    Min = g.Min(p => p.Price),
                    Max = g.Max(p => p.Price),
                })
                .FirstOrDefaultAsync();

            var colors = await query
                .SelectMany(p => p.ProductVariants)
                .Where(v => v.Color != null)
                .Select(v => v.Color)
                .Distinct()
                .Select(c => new ShopColorResponse
                {
                    Id = c.Id,
                    Name = c.Name,
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
                })
                .ToListAsync();

            return new ShopFilterOptionsResponse
            {
                AvailableColors = colors,
                AvailableSizes = sizes,
            };
        }



        // --- WRITE METHODS --- //
    }
}
