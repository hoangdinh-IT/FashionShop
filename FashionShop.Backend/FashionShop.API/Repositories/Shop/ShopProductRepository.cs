using FashionShop.API.Data;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Repositories.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Product.Requests;
using FashionShop.Core.Contracts.Shop.Product.Responses;
using FashionShop.Core.Contracts.Shop.ProductImage.Responses;
using FashionShop.Core.Contracts.Shop.ProductVariant.Responses;
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

        private static readonly Expression<Func<Product, ShopProductResponse>> _productSelector =
            p => new ShopProductResponse
            {
                Id = p.Id,
                CategoryId = p.CategoryId,
                BrandId = p.BrandId,
                Name = p.Name,
                CategoryName = p.Category.Name,
                BrandName = p.Brand.Name,
                Slug = p.Slug,
                Description = p.Description,
                Content = p.Content,
                Material = p.Material,
                Price = p.Price,
                ThumbnailUrl = p.ThumbnailUrl,
                IsBestSeller = p.IsBestSeller,
                IsNew = p.IsNew,
                ProductVariants = p.ProductVariants
                    .Select(v => new ShopProductVariantResponse
                    {
                        Id = v.Id,
                        ProductId = v.ProductId,
                        ColorId = v.ColorId,
                        SizeId = v.SizeId,
                        ColorName = v.Color.Name,
                        ColorHexCode = v.Color.HexCode,
                        Sku = v.Sku,
                        Quantity = v.Quantity,
                        Price = v.Price,
                    })
                    .ToList(),
                ProductImages = p.ProductImages
                    .Select(i => new ShopProductImageResponse
                    {
                        Id = i.Id,
                        ProductId = i.ProductId,
                        ColorId = i.ColorId,
                        ImageUrl = i.ImageUrl,
                        SortOrder = i.SortOrder,
                    })
                    .ToList(),
            };

        // --- READ METHODS --- //

        public async Task<PagedResult<ShopProductResponse>> GetPagedProductsAsync(ShopProductListRequest request)
        {
            var query = _context.Products.AsNoTracking().AsQueryable();

            query = query.FilterByKeyword(request.Keyword)
                         .FilterByCategory(request.CategoryId)
                         .FilterByBrand(request.BrandId)
                         .FilterByColor(request.ColorIds)
                         .FilterBySize(request.SizeIds)
                         .FilterByBestSeller(request.IsBestSeller)
                         .FilterByNew(request.IsNew)
                         .FilterByPrice(request.MinPrice, request.MaxPrice)
                         .SortByPrice(request.IsAscendingPrice);

            var totalRecord = await query.CountAsync();

            var data = await query.Skip((request.PageIndex - 1) * request.PageSize)
                                  .Take(request.PageSize)
                                  .Select(_productSelector)
                                  .ToListAsync();

            return new PagedResult<ShopProductResponse>()
            {
                Items = data,
                TotalRecord = totalRecord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
            };
        }

        public async Task<ShopProductResponse?> GetProductByIdAsync(Guid productId)
        {
            return await _context.Products
                .AsNoTracking()
                .Select(_productSelector)
                .FirstOrDefaultAsync(p => p.Id == productId);
        }



        // --- WRITE METHODS --- //
    }
}
