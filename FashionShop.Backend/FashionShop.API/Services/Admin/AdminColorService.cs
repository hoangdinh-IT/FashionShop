using AutoMapper;
using FashionShop.API.Repositories;
using FashionShop.API.Repositories.Admin.Interfaces;
using FashionShop.API.Repositories.Shared.Interfaces;
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
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminColorService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }



        // --- READ METHODS --- //

        public async Task<IEnumerable<AdminColorResponse>> GetAllColorsAsync()
        {
            return await _unitOfWork.AdminColors.GetAllColorsAsync();
        }

        public async Task<PagedResult<AdminColorResponse>> GetPagedColorsAsync(AdminColorListRequest request)
            => await _unitOfWork.AdminColors.GetPagedColorsAsync(request);

        public async Task<AdminColorResponse?> GetColorByIdAsync(int colorId)
        {
            var color = await _unitOfWork.AdminColors.GetColorByIdAsync(colorId);

            if (color == null) throw new KeyNotFoundException("Không tìm thấy màu sắc!");

            return color;
        }



        // --- WRITE METHODS --- //

        public async Task<AdminColorResponse?> CreateColorAsync(CreateColorRequest request)
        {
            var isExistHexCode = await _unitOfWork.AdminColors.CheckExistHexCodeAsync(request.HexCode);

            if (isExistHexCode) throw new ConflictException("HexCode này đã tồn tại. Vui lòng chọn HexCode khác!");

            var isExistSlug = await _unitOfWork.AdminColors.CheckExistSlugAsync(request.Slug);

            if (isExistSlug) throw new ConflictException("Slug này đã tồn tại. Vui lòng chọn Slug khác!");

            var newColor = _mapper.Map<Color>(request);
            _unitOfWork.AdminColors.CreateColor(newColor);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<AdminColorResponse>(newColor);
        }

        public async Task<AdminColorResponse?> UpdateColorAsync(int colorId, UpdateColorRequest request)
        {
            var existingColor = await _unitOfWork.AdminColors.FindColorByIdAsync(colorId);

            if (existingColor == null) throw new KeyNotFoundException("Không tìm thấy màu sắc!");

            if (request.HexCode != existingColor.HexCode)
            {
                var isExistHexCode = await _unitOfWork.AdminColors.CheckExistHexCodeAsync(request.HexCode);

                if (isExistHexCode) throw new ConflictException("HexCode này đã tồn tại. Vui lòng chọn HexCode khác!");
            }

            if (request.Slug != existingColor.Slug)
            {
                var isExistSlug = await _unitOfWork.AdminColors.CheckExistSlugAsync(request.Slug);

                if (isExistSlug) throw new ConflictException("Slug này đã tồn tại. Vui lòng chọn Slug khác!");
            }

            if (!request.IsActive)
            {
                var isSafeToUpdate = await _unitOfWork.AdminColors.IsSafeToActionAsync(colorId);

                if (!isSafeToUpdate) throw new Exception("Khoan đã! Vẫn còn sản phẩm thuộc màu sắc này. Hãy dọn dẹp chúng trước khi cập nhật trạng thái hoạt động của màu sắc.");
            }

            _mapper.Map(request, existingColor);
            existingColor.UpdatedDate = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();
            return await _unitOfWork.AdminColors.GetColorByIdAsync(colorId);
        }

        public async Task DeleteColorAsync(int colorId)
        {
            var color = await _unitOfWork.AdminColors.FindColorByIdAsync(colorId);

            if (color == null) throw new KeyNotFoundException("Không tìm thấy màu sắc!");

            var isSafeToDelete = await _unitOfWork.AdminColors.IsSafeToActionAsync(colorId);

            if (!isSafeToDelete) throw new Exception("Khoan đã! Vẫn còn sản phẩm thuộc màu sắc này. Hãy dọn dẹp chúng trước khi xóa màu sắc.");

            _unitOfWork.AdminColors.DeleteColor(color);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
