using FashionShop.API.Data;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.Core.DTOs.Brand;
using FashionShop.Core.DTOs.Category.Category;
using FashionShop.Core.Entities;
using FashionShop.Core.Models.Paging;
using Microsoft.EntityFrameworkCore;
using FashionShop.Core.Extensions;
using FashionShop.Core.Models.Brands;

namespace FashionShop.API.Repositories.Implements
{
    public class BrandRepository : IBrandRepository
    {
        private readonly FashionDbContext _context;

        public BrandRepository(FashionDbContext context)
        {
            _context = context;
        }

        public async Task<bool> CheckExistSlugAsync(string slug)
        {
            return await _context.Brands.AnyAsync(brand => brand.Slug == slug);
        }

        public async Task<Brand?> CreateBrandAsync(Brand brand)
        {
            _context.Brands.Add(brand);
            await _context.SaveChangesAsync();
            return brand;
        }

        public async Task<IEnumerable<Brand>> GetAllBrandsAsync()
        {
            return await _context.Brands.AsNoTracking().ToListAsync();
        }

        public async Task<PagedResult<BrandDTO>> GetPagedBrandsAsync(BrandListRequest request)
        {
            var query = _context.Brands.AsNoTracking().AsQueryable();

            query = query.FilterByKeyword(request.Keyword)
                         .FilterByActive(request.IsActive)
                         .Sort(request.SortBy, request.IsAscending);

            var totalRecord = await query.CountAsync();

            var data = await query.Skip((request.PageIndex - 1) * request.PageSize)
                                  .Take(request.PageSize)
                                  .Select(brand => new BrandDTO
                                  {
                                      Id = brand.Id,
                                      Name = brand.Name,
                                      Description = brand.Description,
                                      Slug = brand.Slug,
                                      ProductCount = brand.Products.Count(),
                                      LogoUrl = brand.LogoUrl,
                                      IsActive = brand.IsActive,
                                      CreatedDate = brand.CreatedDate,
                                      UpdatedDate = brand.UpdatedDate,
                                      IsDeleted = brand.IsDeleted,
                                  })
                                  .ToListAsync();

            return new PagedResult<BrandDTO>()
            {
                Items = data,
                TotalRecord = totalRecord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
            };
        }

        public async Task<BrandDTO?> GetBrandByIdAsync(Guid brandId)
        {
            return await _context.Brands.Where(brand => brand.Id == brandId)
                                        .Select(brand => new BrandDTO
                                        {
                                            Id = brand.Id,
                                            Name = brand.Name,
                                            Description = brand.Description,
                                            Slug = brand.Slug,
                                            ProductCount = brand.Products.Count(),
                                            LogoUrl = brand.LogoUrl,
                                            IsActive = brand.IsActive,
                                            CreatedDate = brand.CreatedDate,
                                            UpdatedDate = brand.UpdatedDate,
                                            IsDeleted = brand.IsDeleted,
                                        })
                                        .FirstOrDefaultAsync();
        }

        public async Task<Brand?> FindBrandByIdAsync(Guid brandId)
        {
            return await _context.Brands.FindAsync(brandId);
        }

        public async Task<Brand?> UpdateBrandAsync(Brand brand)
        {
            await _context.SaveChangesAsync();
            return brand;
        }

        public async Task<bool> IsSafeToActionAsync(Guid brandId)
        {
            var hasProduct = await _context.Products.AnyAsync(x => x.BrandId == brandId);
            return !hasProduct;
        }

        public async Task DeleteBrandAsync(Brand brand)
        {
            brand.IsDeleted = true;
            _context.Brands.Update(brand);
            await _context.SaveChangesAsync();
        }
    }
}
