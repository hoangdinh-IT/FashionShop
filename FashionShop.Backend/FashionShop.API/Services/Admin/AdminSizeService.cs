using AutoMapper;
using FashionShop.API.Repositories;
using FashionShop.API.Repositories.Admin.Interfaces;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Services.Admin.Interfaces;
using FashionShop.Core.Contracts.Admin.Size.Requests;
using FashionShop.Core.Contracts.Admin.Size.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Exceptions;
using FashionShop.Core.Models;

namespace FashionShop.API.Services.Admin
{
    public class AdminSizeService : IAdminSizeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminSizeService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }



        // --- READ METHODS --- //

        public async Task<IEnumerable<AdminSizeResponse>> GetAllSizesAsync()
        {
            return await _unitOfWork.AdminSizes.GetAllSizesAsync();
        }

        public async Task<PagedResult<AdminSizeResponse>> GetPagedSizesAsync(AdminSizeListRequest request)
            => await _unitOfWork.AdminSizes.GetPagedSizesAsync(request);

        public async Task<AdminSizeResponse?> GetSizeByIdAsync(int sizeId)
        {
            var size = await _unitOfWork.AdminSizes.GetSizeByIdAsync(sizeId);

            if (size == null) throw new KeyNotFoundException("Không tìm thấy size!");

            return size;
        }



        // --- WRITE METHODS --- //

        public async Task<AdminSizeResponse?> CreateSizeAsync(CreateSizeRequest request)
        {
            var newSize = _mapper.Map<Size>(request);
            _unitOfWork.AdminSizes.CreateSize(newSize);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<AdminSizeResponse>(newSize);
        }

        public async Task<AdminSizeResponse?> UpdateSizeAsync(int sizeId, UpdateSizeRequest request)
        {
            var existingSize = await _unitOfWork.AdminSizes.FindSizeByIdAsync(sizeId);

            if (existingSize == null) throw new KeyNotFoundException("Không tìm thấy size!");

            if (!request.IsActive)
            {
                var isSafeToUpdate = await _unitOfWork.AdminSizes.IsSafeToActionAsync(sizeId);

                if (!isSafeToUpdate) throw new Exception("Khoan đã! Vẫn còn sản phẩm thuộc kích thước này. Hãy dọn dẹp chúng trước khi cập nhật trạng thái hoạt động của kích thước.");
            }

            _mapper.Map(request, existingSize);
            existingSize.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync();
            return await GetSizeByIdAsync(sizeId);
        }

        public async Task DeleteSizeAsync(int sizeId)
        {
            var size = await _unitOfWork.AdminSizes.FindSizeByIdAsync(sizeId);

            if (size == null) throw new KeyNotFoundException("Không tìm thấy size!");

            var isSafeToDelete = await _unitOfWork.AdminSizes.IsSafeToActionAsync(sizeId);

            if (!isSafeToDelete) throw new Exception("Khoan đã! Vẫn còn sản phẩm thuộc kích thước này. Hãy dọn dẹp chúng trước khi xoá kích thước.");

            _unitOfWork.AdminSizes.DeleteSize(size);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
