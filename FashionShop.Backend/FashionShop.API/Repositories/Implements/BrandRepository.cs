using FashionShop.API.Data;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.Core.DTOs.Category.Category;
using FashionShop.Core.Entities;
using FashionShop.Core.Models.Paging;
using Microsoft.EntityFrameworkCore;
using FashionShop.Core.Extensions;
using FashionShop.Core.Models.Brands;
using System.Linq.Expressions;
using FashionShop.Core.Contracts.Brand;

namespace FashionShop.API.Repositories.Implements
{
    public class BrandRepository : IBrandRepository
    {
        private readonly FashionDbContext _context;

        private static readonly Expression<Func<Brand, BrandDTO>> _brandSelector =
            x => new BrandDTO
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Slug = x.Slug,
                ProductCount = x.Products.Count(),
                LogoUrl = x.LogoUrl,
                IsActive = x.IsActive,
                CreatedDate = x.CreatedDate,
                UpdatedDate = x.UpdatedDate,
                IsDeleted = x.IsDeleted,
            };

        public BrandRepository(FashionDbContext context)
        {
            _context = context;
        }

        // --- READ METHODS --- //
        public async Task<bool> CheckExistSlugAsync(string slug)
            => await _context.Brands.AnyAsync(x => x.Slug == slug);

        public async Task<IEnumerable<Brand>> GetAllBrandsAsync()
        {
            return await _context.Brands
                .AsNoTracking()
                .OrderBy(x => x.Name)
                .ToListAsync();
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
                                  .Select(_brandSelector)
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
            return await _context.Brands
                .AsNoTracking()
                .Where(x => x.Id == brandId)
                .Select(_brandSelector)
                .FirstOrDefaultAsync();
        }

        public async Task<Brand?> FindBrandByIdAsync(Guid brandId)
            => await _context.Brands.FindAsync(brandId);

        // --- VALIDATION METHODS --- //
        public async Task<bool> IsSafeToActionAsync(Guid brandId)
        {
            var hasProduct = await _context.Products.AnyAsync(x => x.BrandId == brandId);
            return !hasProduct;
        }

        // --- WRITE METHODS --- //
        public async Task<Brand?> CreateBrandAsync(Brand brand)
        {
            _context.Brands.Add(brand);
            await _context.SaveChangesAsync();
            return brand;
        }

        public async Task<Brand?> UpdateBrandAsync(Brand brand)
        {
            _context.Brands.Update(brand);
            await _context.SaveChangesAsync();
            return brand;
        }

        public async Task DeleteBrandAsync(Brand brand)
        {
            brand.IsDeleted = true;
            _context.Brands.Update(brand);
            await _context.SaveChangesAsync();
        }
    }
}
