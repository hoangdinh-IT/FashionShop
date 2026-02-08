using FashionShop.API.Data;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.Core.DTOs.ProductVariant;
using FashionShop.Core.Entities;
using FashionShop.Core.Extensions;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.ProductVariants;
using Microsoft.EntityFrameworkCore;

namespace FashionShop.API.Repositories.Implements
{
    public class ProductVariantRepository : IProductVariantRepository
    {
        private readonly FashionDbContext _context;

        public ProductVariantRepository(FashionDbContext context)
        {
            _context = context;
        }

        // HÀM CHÍNH
        public async Task<ProductVariant> CreateProductVariantAsync(ProductVariant productVariant)
        {
            _context.ProductVariants.Add(productVariant);
            await _context.SaveChangesAsync();
            return productVariant;
        }

        public async Task<PagedResult<ProductVariantDTO>> GetPagedProductVariantsAsync(ProductVariantListRequest request)
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
                            .Select(pv => new ProductVariantDTO()
                            {
                                Id = pv.Id,
                                ProductId = pv.ProductId,
                                ColorId = pv.ColorId,
                                SizeId = pv.SizeId,
                                SKU = pv.SKU,
                                Quantity = pv.Quantity,
                                Price = pv.Price,
                                ProductName = pv.Product.Name,
                                ColorName = pv.Color.Name,
                                ColorCode = pv.Color.HexCode,
                                SizeName = pv.Size.Name,
                                VariantImageUrl = pv.VariantImageUrl,
                                IsActive = pv.IsActive,
                                CreatedDate = pv.CreatedDate,
                                UpdatedDate = pv.UpdatedDate,
                                IsDeleted = pv.IsDeleted,
                            })
                            .ToListAsync();

            return new PagedResult<ProductVariantDTO>()
            {
                Items = data,
                TotalRecord = totalRecord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
            };
        }

        public async Task<ProductVariantDTO?> GetProductVariantByIdAsync(Guid productVariantId)
        {
            return await _context.ProductVariants.Where(pv => pv.Id == productVariantId)
                                                 .Select(pv => new ProductVariantDTO()
                                                 {
                                                     Id = pv.Id,
                                                     ProductId = pv.ProductId,
                                                     ColorId = pv.ColorId,
                                                     SizeId = pv.SizeId,
                                                     SKU = pv.SKU,
                                                     Quantity = pv.Quantity,
                                                     Price = pv.Price,
                                                     ProductName = pv.Product.Name,
                                                     ColorName = pv.Color.Name,
                                                     ColorCode = pv.Color.HexCode,
                                                     SizeName = pv.Size.Name,
                                                     VariantImageUrl = pv.VariantImageUrl,
                                                     IsActive = pv.IsActive,
                                                     CreatedDate = pv.CreatedDate,
                                                     UpdatedDate = pv.UpdatedDate,
                                                     IsDeleted = pv.IsDeleted,
                                                 })
                                                 .FirstOrDefaultAsync();
        }

        public async Task<ProductVariant> UpdateProductVariantAsync(ProductVariant productVariant)
        {
            await _context.SaveChangesAsync();
            return productVariant;
        }

        public async Task DeleteProductVariantAsync(ProductVariant productVariant)
        {
            productVariant.IsDeleted = true;
            await _context.SaveChangesAsync();
        }



        // HÀM PHỤ
        public async Task<bool> CheckExistSKUAsync(string sku)
        {
            return await _context.ProductVariants.AnyAsync(x => x.SKU == sku);
        }

        public async Task<ProductVariant?> FindProductVariantByIdAsync(Guid productVariantId)
        {
            return await _context.ProductVariants.FindAsync(productVariantId);
        }
    }
}
