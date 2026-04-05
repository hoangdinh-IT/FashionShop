using FashionShop.API.Data;
using FashionShop.Core.Entities;
using Microsoft.EntityFrameworkCore;
using FashionShop.Core.Extensions;
using System.Linq.Expressions;
using FashionShop.Core.Contracts.Admin.Brand.Responses;
using FashionShop.Core.Contracts.Admin.Brand.Requests;
using FashionShop.Core.Models;
using FashionShop.API.Repositories.Admin.Interfaces;

namespace FashionShop.API.Repositories.Admin
{
    public class AdminBrandRepository : IAdminBrandRepository
    {
        private readonly FashionDbContext _context;

        private static readonly Expression<Func<Brand, AdminBrandResponse>> _brandSelector =
            x => new AdminBrandResponse
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

        public AdminBrandRepository(FashionDbContext context)
        {
            _context = context;
        }



        // --- READ METHODS --- //

        public async Task<IEnumerable<Brand>> GetAllBrandsAsync()
        {
            return await _context.Brands
                .AsNoTracking()
                .OrderBy(x => x.Name)
                .ToListAsync();
        }

        public async Task<PagedResult<AdminBrandResponse>> GetPagedBrandsAsync(AdminBrandListRequest request)
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

            return new PagedResult<AdminBrandResponse>()
            {
                Items = data,
                TotalRecord = totalRecord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
            };
        }

        public async Task<AdminBrandResponse?> GetBrandByIdAsync(Guid brandId)
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

        public async Task<bool> CheckExistSlugAsync(string slug)
            => await _context.Brands.AnyAsync(x => x.Slug == slug);



        // --- WRITE METHODS --- //

        public void CreateBrand(Brand brand)
        {
            _context.Brands.Add(brand);
        }

        public void DeleteBrand(Brand brand)
        {
            brand.IsDeleted = true;
        }
    }
}
