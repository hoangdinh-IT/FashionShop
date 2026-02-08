using FashionShop.API.Data;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.Core.DTOs.Product;
using FashionShop.Core.Entities;
using FashionShop.Core.Extensions;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.Products;
using Microsoft.EntityFrameworkCore;

namespace FashionShop.API.Repositories.Implements
{
    public class ProductRepository : IProductRepository
    {
        private readonly FashionDbContext _context;

        public ProductRepository(FashionDbContext context)
        {
            _context = context;
        }

        public async Task<bool> CheckExistSlugAsync(string slug)
        {
            return await _context.Products.AnyAsync(prod => prod.Slug == slug);
        }

        public async Task<Product> CreateProductAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<PagedResult<ProductDTO>> GetPagedProductsAsync(ProductListRequest request)
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
                                  .Select(prod => new ProductDTO()
                                  {
                                      Id = prod.Id,
                                      CategoryId = prod.CategoryId,
                                      BrandId = prod.BrandId,
                                      CategoryName = prod.Category.Name,
                                      BrandName = prod.Brand.Name,
                                      Name = prod.Name,
                                      Slug = prod.Slug,
                                      Description = prod.Description,
                                      Content = prod.Content,
                                      Material = prod.Material,
                                      Price = prod.Price,
                                      ThumbnailUrl = prod.ThumbnailUrl,
                                      IsActive = prod.IsActive,
                                      IsBestSeller = prod.IsBestSeller,
                                      IsNew = prod.IsNew,
                                      ViewCount = prod.ViewCount,
                                      CreatedDate = prod.CreatedDate,
                                      UpdatedDate = prod.UpdatedDate,
                                  })
                                  .ToListAsync();

            return new PagedResult<ProductDTO>()
            {
                Items = data,
                TotalRecord = totalRecorl,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
            };
        }

        public async Task<ProductDTO?> GetProductByIdAsync(Guid productId)
        {
            return await _context.Products.Where(prod => prod.Id == productId)
                                          .Select(prod => new ProductDTO()
                                          {
                                              Id = prod.Id,
                                              CategoryId = prod.CategoryId,
                                              BrandId = prod.BrandId,
                                              CategoryName = prod.Category.Name,
                                              BrandName = prod.Brand.Name,
                                              Name = prod.Name,
                                              Slug = prod.Slug,
                                              Description = prod.Description,
                                              Content = prod.Content,
                                              Material = prod.Material,
                                              Price = prod.Price,
                                              ThumbnailUrl = prod.ThumbnailUrl,
                                              IsActive = prod.IsActive,
                                              IsBestSeller = prod.IsBestSeller,
                                              IsNew = prod.IsNew,
                                              ViewCount = prod.ViewCount,
                                              CreatedDate = prod.CreatedDate,
                                              UpdatedDate = prod.UpdatedDate,
                                          })
                                          .FirstOrDefaultAsync();
        }

        public async Task<Product?> FindProductByIdAsync(Guid productId)
        {
            return await _context.Products.FindAsync(productId);
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
    }
}
