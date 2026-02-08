using FashionShop.API.Data;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.Core.DTOs.Size;
using FashionShop.Core.Entities;
using FashionShop.Core.Extensions;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.Sizes;
using Microsoft.EntityFrameworkCore;

namespace FashionShop.API.Repositories.Implements
{
    public class SizeRepository : ISizeRepository
    {
        private readonly FashionDbContext _context;

        public SizeRepository(FashionDbContext context)
        {
            _context = context;
        }

        public async Task<Size?> CreateSizeAsync(Size size)
        {
            _context.Sizes.Add(size);
            await _context.SaveChangesAsync();
            return size;
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
                            .Select(size => new SizeDTO()
                            {
                                Id = size.Id,
                                Name = size.Name,
                                SortOrder = size.SortOrder,
                                Type = size.Type,
                                productCount = size.ProductVariants.Count(),
                                IsActive = size.IsActive,
                                CreatedDate = size.CreatedDate,
                                UpdatedDate = size.UpdatedDate,
                                IsDeleted = size.IsDeleted,
                            })
                            .ToListAsync();

            return new PagedResult<SizeDTO>()
            {
                Items = data,
                TotalRecord = totalRecord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
            };
        }

        public async Task<Size?> FindSizeByIdAsync(int sizeId)
        {
            return await _context.Sizes.FindAsync(sizeId);
        }

        public async Task<SizeDTO?> GetSizeByIdAsync(int sizeId)
        {
            return await _context.Sizes.Where(size => size.Id == sizeId)
                                       .Select(size => new SizeDTO()
                                       {
                                           Id = size.Id,
                                           Name = size.Name,
                                           SortOrder = size.SortOrder,
                                           Type = size.Type,
                                           productCount = size.ProductVariants.Count(),
                                           IsActive = size.IsActive,
                                           CreatedDate = size.CreatedDate,
                                           UpdatedDate = size.UpdatedDate,
                                           IsDeleted = size.IsDeleted,
                                       })
                                       .FirstOrDefaultAsync();
        }

        public async Task<bool> IsSafeToActionAsync(int sizeId)
        {
            var hasProduct = await _context.ProductVariants.AnyAsync(x => x.SizeId == sizeId);
            return !hasProduct;
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
