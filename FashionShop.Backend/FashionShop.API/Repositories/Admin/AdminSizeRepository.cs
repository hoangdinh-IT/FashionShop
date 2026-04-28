using FashionShop.API.Data;
using FashionShop.API.Repositories.Admin.Interfaces;
using FashionShop.Core.Contracts.Admin.Size.Requests;
using FashionShop.Core.Contracts.Admin.Size.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Extensions;
using FashionShop.Core.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FashionShop.API.Repositories.Admin
{
    public class AdminSizeRepository : IAdminSizeRepository
    {
        private readonly FashionDbContext _context;

        private static readonly Expression<Func<Size, AdminSizeResponse>> _sizeSelector =
            x => new AdminSizeResponse
            {
                Id = x.Id,
                Name = x.Name,
                Slug = x.Slug,
                SortOrder = x.SortOrder,
                Type = x.Type,
                productCount = x.ProductVariants.Count(),
                IsActive = x.IsActive,
                CreatedDate = x.CreatedDate,
                UpdatedDate = x.UpdatedDate,
                IsDeleted = x.IsDeleted,
            };

        public AdminSizeRepository(FashionDbContext context)
        {
            _context = context;
        }



        // --- READ METHODS --- //

        public async Task<IEnumerable<AdminSizeResponse>> GetAllSizesAsync()
        {
            return await _context.Sizes
                .AsNoTracking()
                .OrderBy(x => x.Id)
                .Select(_sizeSelector)
                .ToListAsync();
        }
        public async Task<PagedResult<AdminSizeResponse>> GetPagedSizesAsync(AdminSizeListRequest request)
        {
            var query = _context.Sizes.AsNoTracking().AsQueryable();

            query = query.FilterByKeyword(request.Keyword)
                         .FilterByType(request.Type)
                         .FilterByActive(request.IsActive)
                         .Sort(request.SortBy, request.IsAscending);

            var totalRecord = await query.CountAsync();

            var data = await query.Skip((request.PageIndex - 1) * request.PageSize)
                                  .Take(request.PageSize)
                                  .Select(_sizeSelector)
                                  .ToListAsync();

            return new PagedResult<AdminSizeResponse>()
            {
                Items = data,
                TotalRecord = totalRecord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
            };
        }

        public async Task<AdminSizeResponse?> GetSizeByIdAsync(int sizeId)
        {
            return await _context.Sizes
                .AsNoTracking()
                .Where(x => x.Id == sizeId)
                .Select(_sizeSelector)
                .FirstOrDefaultAsync();
        }

        public async Task<Size?> FindSizeByIdAsync(int sizeId)
            => await _context.Sizes.FindAsync(sizeId);



        // --- VALIDATION METHODS --- //

        public async Task<bool> IsSafeToActionAsync(int sizeId)
        {
            var hasProduct = await _context.ProductVariants.AnyAsync(x => x.SizeId == sizeId);
            return !hasProduct;
        }



        // --- WRITE METHODS --- //

        public void CreateSize(Size size)
        {
            _context.Sizes.Add(size);
        }

        public void DeleteSize(Size size)
        {
            size.IsDeleted = true;
        }
    }
}
