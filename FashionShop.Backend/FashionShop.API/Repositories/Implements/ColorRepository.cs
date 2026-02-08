using FashionShop.API.Data;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.Core.DTOs.Color;
using FashionShop.Core.Entities;
using FashionShop.Core.Extensions;
using FashionShop.Core.Models.Colors;
using FashionShop.Core.Models.Paging;
using Microsoft.EntityFrameworkCore;

namespace FashionShop.API.Repositories.Implements
{
    public class ColorRepository : IColorRepository
    {
        private readonly FashionDbContext _context;

        public ColorRepository(FashionDbContext context)
        {
            _context = context;
        }

        public async Task<bool> CheckExistHexCodeAsync(string hexCode)
        {
            return await _context.Colors.AnyAsync(color => color.HexCode == hexCode);
        }

        public async Task<bool> CheckExistSlugAsync(string slug)
        {
            return await _context.Colors.AnyAsync(color => color.Slug == slug);
        }

        public async Task<Color?> CreateColorAsync(Color color)
        {
            _context.Colors.Add(color);
            await _context.SaveChangesAsync();
            return color;
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
                                  .Select(color => new ColorDTO
                                  {
                                      Id = color.Id,
                                      Name = color.Name,
                                      HexCode = color.HexCode,
                                      Slug = color.Slug,
                                      ProductCount = color.ProductVariants.Count(),
                                      IsActive = color.IsActive,
                                      CreatedDate = color.CreatedDate,
                                      UpdatedDate = color.UpdatedDate,
                                      IsDeleted = color.IsDeleted,
                                  })
                                  .ToListAsync();

            return new PagedResult<ColorDTO>
            {
                Items = data,
                TotalRecord = totalRecord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
            };
        }

        public async Task<Color?> FindColorByIdAsync(int colorId)
        {
            return await _context.Colors.FindAsync(colorId);
        }

        public async Task<ColorDTO?> GetColorByIdAsync(int colorId)
        {
            return await _context.Colors.Where(color => color.Id == colorId)
                                        .Select(color => new ColorDTO
                                        {
                                            Id = color.Id,
                                            Name = color.Name,
                                            HexCode = color.HexCode,
                                            Slug = color.Slug,
                                            ProductCount = color.ProductVariants.Count(),
                                            IsActive = color.IsActive,
                                            CreatedDate = color.CreatedDate,
                                            UpdatedDate = color.UpdatedDate,
                                            IsDeleted = color.IsDeleted,
                                        })
                                        .FirstOrDefaultAsync();
        }

        public async Task<Color> UpdateColorAsync(Color color)
        {
            _context.Colors.Update(color);
            await _context.SaveChangesAsync();
            return color;
        }

        public async Task<bool> IsSafeToActionAsync(int colorId)
        {
            var hasProduct = await _context.ProductVariants.AnyAsync(x => x.ColorId == colorId);

            return !hasProduct;
        }

        public async Task DeleteColorAsync(Color color)
        {
            color.IsDeleted = true;
            _context.Colors.Update(color);
            await _context.SaveChangesAsync();
        }
    }
}
