using AutoMapper;
using FashionShop.API.Repositories.Implements;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.API.Services.Interfaces;
using FashionShop.Core.Contracts.Size.Requests;
using FashionShop.Core.Contracts.Size.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Exceptions;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.Sizes;

namespace FashionShop.API.Services.Implements
{
    public class SizeService : ISizeService
    {
        private readonly ISizeRepository _sizeRepository;
        private readonly IMapper _mapper;

        public SizeService(ISizeRepository sizeRepository, IMapper mapper)
        {
            _sizeRepository = sizeRepository;
            _mapper = mapper;
        }

        // --- READ METHODS --- //
        public async Task<IEnumerable<SizeResponse>> GetAllSizesAsync()
        {
            return await _sizeRepository.GetAllSizesAsync();
        }

        public async Task<PagedResult<SizeResponse>> GetPagedSizesAsync(SizeListRequest request)
            => await _sizeRepository.GetPagedSizesAsync(request);

        public async Task<SizeResponse?> GetSizeByIdAsync(int sizeId)
        {
            var size = await _sizeRepository.GetSizeByIdAsync(sizeId);

            if (size == null) throw new KeyNotFoundException("Không tìm thấy size!");

            return size;
        }

        // --- WRITE METHODS --- //
        public async Task<SizeResponse?> CreateSizeAsync(CreateSizeRequest dto)
        {
            var newSize = _mapper.Map<Size>(dto);
            var createdSize = await _sizeRepository.CreateSizeAsync(newSize);
            return _mapper.Map<SizeResponse>(newSize);
        }

        public async Task<SizeResponse?> UpdateSizeAsync(int sizeId, UpdateSizeRequest dto)
        {
            var existingSize = await _sizeRepository.FindSizeByIdAsync(sizeId);

            if (existingSize == null) throw new KeyNotFoundException("Không tìm thấy size!");

            if (!dto.IsActive)
            {
                var isSafeToUpdate = await _sizeRepository.IsSafeToActionAsync(sizeId);

                if (!isSafeToUpdate) throw new Exception("Khoan đã! Vẫn còn sản phẩm thuộc kích thước này. Hãy dọn dẹp chúng trước khi cập nhật trạng thái hoạt động của kích thước.");
            }

            _mapper.Map(dto, existingSize);
            existingSize.UpdatedDate = DateTime.UtcNow;
            await _sizeRepository.UpdateSizeAsync(existingSize);
            return await GetSizeByIdAsync(sizeId);
        }

        public async Task DeleteSizeAsync(int sizeId)
        {
            var size = await _sizeRepository.FindSizeByIdAsync(sizeId);

            if (size == null) throw new KeyNotFoundException("Không tìm thấy size!");

            var isSafeToDelete = await _sizeRepository.IsSafeToActionAsync(sizeId);

            if (!isSafeToDelete) throw new Exception("Khoan đã! Vẫn còn sản phẩm thuộc kích thước này. Hãy dọn dẹp chúng trước khi xoá kích thước.");

            await _sizeRepository.DeleteSizeAsync(size);
        }
    }
}
