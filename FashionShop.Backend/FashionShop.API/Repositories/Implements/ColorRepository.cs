using FashionShop.API.Data;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.Core.DTOs.Color;
using FashionShop.Core.Entities;
using FashionShop.Core.Extensions;
using FashionShop.Core.Models.Colors;
using FashionShop.Core.Models.Paging;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FashionShop.API.Repositories.Implements
{
    public class ColorRepository : IColorRepository
    {
        private readonly FashionDbContext _context;

        private static readonly Expression<Func<Color, ColorDTO>> _colorSelector =
            x => new ColorDTO
            {
                Id = x.Id,
                Name = x.Name,
                HexCode = x.HexCode,
                Slug = x.Slug,
                ProductCount = x.ProductVariants.Count(),
                IsActive = x.IsActive,
                CreatedDate = x.CreatedDate,
                UpdatedDate = x.UpdatedDate,
                IsDeleted = x.IsDeleted,
            };

        public ColorRepository(FashionDbContext context)
        {
            _context = context;
        }

        // --- READ METHODS --- //

        public async Task<IEnumerable<ColorDTO>> GetAllColorsAsync()
        {
            return await _context.Colors
                .AsNoTracking()
                .OrderBy(x => x.Id)
                .Select(_colorSelector)
                .ToListAsync();
        }
        public async Task<PagedResult<ColorDTO>> GetPagedColorsAsync(ColorListRequest request)
        {
            var query = _context.Colors.AsNoTracking().AsQueryable();

            query = query.FilterByKeyword(request.Keyword)
                         .FilterByActive(request.IsActive)
                         .Sort(request.SortBy, request.IsAscending);

            var totalRecord = await query.CountAsync();

            var data = await query.Skip((request.PageIndex - 1) * request.PageSize)
                                  .Take(request.PageSize)
                                  .Select(_colorSelector)
                                  .ToListAsync();

            return new PagedResult<ColorDTO>
            {
                Items = data,
                TotalRecord = totalRecord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
            };
        }

        public async Task<ColorDTO?> GetColorByIdAsync(int colorId)
        {
            return await _context.Colors
                .AsNoTracking()
                .Where(x => x.Id == colorId)
                .Select(_colorSelector)
                .FirstOrDefaultAsync();
        }

        public async Task<Color?> FindColorByIdAsync(int colorId)
            => await _context.Colors.FindAsync(colorId);

        // --- VALIDATION METHODS --- //

        public async Task<bool> CheckExistHexCodeAsync(string hexCode)
            => await _context.Colors.AnyAsync(x => x.HexCode == hexCode);

        public async Task<bool> CheckExistSlugAsync(string slug)
            => await _context.Colors.AnyAsync(x => x.Slug == slug);

        public async Task<bool> IsSafeToActionAsync(int colorId)
        {
            var hasProduct = await _context.ProductVariants.AnyAsync(x => x.ColorId == colorId);

            return !hasProduct;
        }

        // --- WRITE METHODS --- //
        public async Task<Color?> CreateColorAsync(Color color)
        {
            _context.Colors.Add(color);
            await _context.SaveChangesAsync();
            return color;
        }

        public async Task<Color> UpdateColorAsync(Color color)
        {
            _context.Colors.Update(color);
            await _context.SaveChangesAsync();
            return color;
        }

        public async Task DeleteColorAsync(Color color)
        {
            color.IsDeleted = true;
            _context.Colors.Update(color);
            await _context.SaveChangesAsync();
        }
    }
}
