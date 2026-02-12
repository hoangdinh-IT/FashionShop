using AutoMapper;
using FashionShop.API.Repositories.Implements;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.API.Services.Interfaces;
using FashionShop.Core.DTOs.Color;
using FashionShop.Core.Entities;
using FashionShop.Core.Exceptions;
using FashionShop.Core.Models.Colors;
using FashionShop.Core.Models.Paging;

namespace FashionShop.API.Services.Implements
{
    public class ColorService : IColorService
    {
        private readonly IColorRepository _colorRepository;
        private readonly IMapper _mapper;

        public ColorService(IColorRepository colorRepository, IMapper mapper)
        {
            _colorRepository = colorRepository;
            _mapper = mapper;
        }

        // --- READ METHODS --- //
        public async Task<PagedResult<ColorDTO>> GetPagedColorsAsync(ColorListRequest request)
            => await _colorRepository.GetPagedColorsAsync(request);

        public async Task<ColorDTO?> GetColorByIdAsync(int colorId)
        {
            var color = await _colorRepository.GetColorByIdAsync(colorId);

            if (color == null) throw new KeyNotFoundException("Không tìm thấy màu sắc!");

            return color;
        }

        // --- WRITE METHODS --- //
        public async Task<ColorDTO?> CreateColorAsync(CreateColorDTO dto)
        {
            var isExistHexCode = await _colorRepository.CheckExistHexCodeAsync(dto.HexCode);

            if (isExistHexCode) throw new ConflictException("HexCode này đã tồn tại. Vui lòng chọn HexCode khác!");

            var isExistSlug = await _colorRepository.CheckExistSlugAsync(dto.Slug);

            if (isExistSlug) throw new ConflictException("Slug này đã tồn tại. Vui lòng chọn Slug khác!");

            var newColor = _mapper.Map<Color>(dto);
            var createdColor = await _colorRepository.CreateColorAsync(newColor);
            return _mapper.Map<ColorDTO>(createdColor);
        }

        public async Task<ColorDTO?> UpdateColorAsync(int colorId, UpdateColorDTO dto)
        {
            var existingColor = await _colorRepository.FindColorByIdAsync(colorId);

            if (existingColor == null) throw new KeyNotFoundException("Không tìm thấy màu sắc!");

            if (dto.HexCode != existingColor.HexCode)
            {
                var isExistHexCode = await _colorRepository.CheckExistHexCodeAsync(dto.HexCode);

                if (isExistHexCode) throw new ConflictException("HexCode này đã tồn tại. Vui lòng chọn HexCode khác!");
            }

            if (dto.Slug != existingColor.Slug)
            {
                var isExistSlug = await _colorRepository.CheckExistSlugAsync(dto.Slug);

                if (isExistSlug) throw new ConflictException("Slug này đã tồn tại. Vui lòng chọn Slug khác!");
            }

            if (!dto.IsActive)
            {
                var isSafeToUpdate = await _colorRepository.IsSafeToActionAsync(colorId);

                if (!isSafeToUpdate) throw new Exception("Khoan đã! Vẫn còn sản phẩm thuộc màu sắc này. Hãy dọn dẹp chúng trước khi cập nhật trạng thái hoạt động của màu sắc.");
            }

            _mapper.Map(dto, existingColor);
            existingColor.UpdatedDate = DateTime.UtcNow;
            await _colorRepository.UpdateColorAsync(existingColor);
            return await _colorRepository.GetColorByIdAsync(colorId);
        }

        public async Task DeleteColorAsync(int colorId)
        {
            var color = await _colorRepository.FindColorByIdAsync(colorId);

            if (color == null) throw new KeyNotFoundException("Không tìm thấy màu sắc!");

            var isSafeToDelete = await _colorRepository.IsSafeToActionAsync(colorId);

            if (!isSafeToDelete) throw new Exception("Khoan đã! Vẫn còn sản phẩm thuộc màu sắc này. Hãy dọn dẹp chúng trước khi xóa màu sắc.");

            await _colorRepository.DeleteColorAsync(color);
        }
    }
}
