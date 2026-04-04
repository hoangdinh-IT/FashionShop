using AutoMapper;
using FashionShop.API.Repositories;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.API.Services.Admin.Interfaces;
using FashionShop.Core.Contracts.Admin.Color.Requests;
using FashionShop.Core.Contracts.Admin.Color.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Exceptions;
using FashionShop.Core.Models;

namespace FashionShop.API.Services.Admin
{
    public class AdminColorService : IAdminColorService
    {
        private readonly IColorRepository _colorRepository;
        private readonly IMapper _mapper;

        public AdminColorService(IColorRepository colorRepository, IMapper mapper)
        {
            _colorRepository = colorRepository;
            _mapper = mapper;
        }



        // --- READ METHODS --- //

        public async Task<IEnumerable<AdminColorResponse>> GetAllColorsAsync()
        {
            return await _colorRepository.GetAllColorsAsync();
        }

        public async Task<PagedResult<AdminColorResponse>> GetPagedColorsAsync(AdminColorListRequest request)
            => await _colorRepository.GetPagedColorsAsync(request);

        public async Task<AdminColorResponse?> GetColorByIdAsync(int colorId)
        {
            var color = await _colorRepository.GetColorByIdAsync(colorId);

            if (color == null) throw new KeyNotFoundException("Không tìm thấy màu sắc!");

            return color;
        }



        // --- WRITE METHODS --- //

        public async Task<AdminColorResponse?> CreateColorAsync(CreateColorRequest request)
        {
            var isExistHexCode = await _colorRepository.CheckExistHexCodeAsync(request.HexCode);

            if (isExistHexCode) throw new ConflictException("HexCode này đã tồn tại. Vui lòng chọn HexCode khác!");

            var isExistSlug = await _colorRepository.CheckExistSlugAsync(request.Slug);

            if (isExistSlug) throw new ConflictException("Slug này đã tồn tại. Vui lòng chọn Slug khác!");

            var newColor = _mapper.Map<Color>(request);
            var createdColor = await _colorRepository.CreateColorAsync(newColor);
            return _mapper.Map<AdminColorResponse>(createdColor);
        }

        public async Task<AdminColorResponse?> UpdateColorAsync(int colorId, UpdateColorRequest request)
        {
            var existingColor = await _colorRepository.FindColorByIdAsync(colorId);

            if (existingColor == null) throw new KeyNotFoundException("Không tìm thấy màu sắc!");

            if (request.HexCode != existingColor.HexCode)
            {
                var isExistHexCode = await _colorRepository.CheckExistHexCodeAsync(request.HexCode);

                if (isExistHexCode) throw new ConflictException("HexCode này đã tồn tại. Vui lòng chọn HexCode khác!");
            }

            if (request.Slug != existingColor.Slug)
            {
                var isExistSlug = await _colorRepository.CheckExistSlugAsync(request.Slug);

                if (isExistSlug) throw new ConflictException("Slug này đã tồn tại. Vui lòng chọn Slug khác!");
            }

            if (!request.IsActive)
            {
                var isSafeToUpdate = await _colorRepository.IsSafeToActionAsync(colorId);

                if (!isSafeToUpdate) throw new Exception("Khoan đã! Vẫn còn sản phẩm thuộc màu sắc này. Hãy dọn dẹp chúng trước khi cập nhật trạng thái hoạt động của màu sắc.");
            }

            _mapper.Map(request, existingColor);
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
