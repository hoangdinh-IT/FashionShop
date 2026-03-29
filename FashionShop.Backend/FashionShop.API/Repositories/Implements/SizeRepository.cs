using FashionShop.API.Data;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.Core.Contracts.Size;
using FashionShop.Core.Entities;
using FashionShop.Core.Extensions;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.Sizes;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FashionShop.API.Repositories.Implements
{
    public class SizeRepository : ISizeRepository
    {
        private readonly FashionDbContext _context;

        private static readonly Expression<Func<Size, SizeDTO>> _sizeSelector =
            x => new SizeDTO
            {
                Id = x.Id,
                Name = x.Name,
                SortOrder = x.SortOrder,
                Type = x.Type,
                productCount = x.ProductVariants.Count(),
                IsActive = x.IsActive,
                CreatedDate = x.CreatedDate,
                UpdatedDate = x.UpdatedDate,
                IsDeleted = x.IsDeleted,
            };

        public SizeRepository(FashionDbContext context)
        {
            _context = context;
        }

        // --- READ METHODS --- //

        public async Task<IEnumerable<SizeDTO>> GetAllSizesAsync()
        {
            return await _context.Sizes
                .AsNoTracking()
                .OrderBy(x => x.Id)
                .Select(_sizeSelector)
                .ToListAsync();
        }
        public async Task<PagedResult<SizeDTO>> GetPagedSizesAsync(SizeListRequest request)
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

            return new PagedResult<SizeDTO>()
            {
                Items = data,
                TotalRecord = totalRecord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
            };
        }

        public async Task<SizeDTO?> GetSizeByIdAsync(int sizeId)
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
        public async Task<Size?> CreateSizeAsync(Size size)
        {
            _context.Sizes.Add(size);
            await _context.SaveChangesAsync();
            return size;
        }

        public async Task<Size> UpdateSizeAsync(Size size)
        {
            _context.Sizes.Update(size);
            await _context.SaveChangesAsync();
            return size;
        }

        public async Task DeleteSizeAsync(Size size)
        {
            size.IsDeleted = true;
            _context.Sizes.Update(size);
            await _context.SaveChangesAsync();
        }
    }
}
