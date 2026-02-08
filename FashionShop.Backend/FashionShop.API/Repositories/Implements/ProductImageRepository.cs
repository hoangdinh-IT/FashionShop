using FashionShop.API.Data;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.Core.DTOs.ProductImage;
using FashionShop.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace FashionShop.API.Repositories.Implements
{
    public class ProductImageRepository : IProductImageRepository
    {
        private readonly FashionDbContext _context;

        public ProductImageRepository(FashionDbContext context)
        {
            _context = context;
        }

        // HÀM CHÍNH
        public async Task<ProductImage> CreateProductImageAsync(ProductImage productImage)
        {
            _context.ProductImages.Add(productImage);
            await _context.SaveChangesAsync();
            return productImage;
        }

        public async Task<IEnumerable<ProductImageDTO>> GetProductImagesAsync(Guid productId, int? colorId)
        {
            var query = _context.ProductImages
                                .AsNoTracking()
                                .Where(x => x.ProductId == productId);

            if (colorId.HasValue)
            {
                query = query.Where(x => x.ColorId == colorId.Value);
            }

            return await query.OrderBy(x => x.SortOrder)
                              .Select(x => new ProductImageDTO()
                              {
                                  Id = x.Id,
                                  ProductId = x.ProductId,
                                  ColorId = x.ColorId,
                                  ColorName = x.Color.Name,
                                  ColorCode = x.Color.HexCode,
                                  ImageUrl = x.ImageUrl,
                                  SortOrder = x.SortOrder,
                                  CreatedDate = x.CreatedDate,
                                  UpdatedDate = x.UpdatedDate,
                              })
                              .ToListAsync();
        }

        public async Task<ProductImageDTO?> GetProductImageByIdAsync(Guid productImageId)
        {
            return await _context.ProductImages
                                 .Where(x => x.Id == productImageId)
                                 .Select(x => new ProductImageDTO()
                                 {
                                     Id = x.Id,
                                     ProductId = x.ProductId,
                                     ColorId = x.ColorId,
                                     ColorName = x.Color.Name,
                                     ColorCode = x.Color.HexCode,
                                     ImageUrl = x.ImageUrl,
                                     SortOrder = x.SortOrder,
                                     CreatedDate = x.CreatedDate,
                                     UpdatedDate = x.UpdatedDate,
                                 })
                                 .FirstOrDefaultAsync();
        }

        public async Task<ProductImage> UpdateProductImageAsync(ProductImage productImage)
        {
            await _context.SaveChangesAsync();
            return productImage;
        }

        public async Task DeleteProductImageAsync(ProductImage productImage)
        {
            _context.ProductImages.Remove(productImage);
            await _context.SaveChangesAsync();
        }




        // HÀM PHỤ
        public async Task<bool> CheckExistProductVariant(Guid productId, int colorId)
        {
            return await _context.ProductVariants.AnyAsync(x => x.ProductId == productId &&
                                                                x.ColorId == colorId);
        }

        public async Task<ProductImage?> FindProductImageByIdAsync(Guid productImageId)
        {
            return await _context.ProductImages.FindAsync(productImageId);
        }
    }
}
