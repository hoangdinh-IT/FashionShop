using AutoMapper;
using FashionShop.API.Repositories.Implements;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.API.Services.Interfaces;
using FashionShop.Core.Contracts.Brand.Requests;
using FashionShop.Core.Contracts.Brand.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Exceptions;
using FashionShop.Core.Models.Brands;
using FashionShop.Core.Models.Paging;

namespace FashionShop.API.Services.Implements
{
    public class BrandService : IBrandService
    {
        private readonly IBrandRepository _brandRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public BrandService(IBrandRepository brandRepository, IMapper mapper, IPhotoService photoService)
        {
            _brandRepository = brandRepository;
            _mapper = mapper;
            _photoService = photoService;
        }

        // --- READ METHODS --- //
        public async Task<IEnumerable<BrandResponse>> GetAllBrandsAsync()
        {
            var brands = await _brandRepository.GetAllBrandsAsync();
            return _mapper.Map<IEnumerable<BrandResponse>>(brands);
        }

        public async Task<PagedResult<BrandResponse>> GetPagedBrandsAsync(BrandListRequest request)
            => await _brandRepository.GetPagedBrandsAsync(request);

        public async Task<BrandResponse?> GetBrandByIdAsync(Guid brandId)
        {
            var brand = await _brandRepository.GetBrandByIdAsync(brandId);

            if (brand == null) throw new KeyNotFoundException("Không tìm thấy thương hiệu!");

            return brand;
        }

        // --- WRITE METHODS --- //
        public async Task<BrandResponse?> CreateBrandAsync(CreateBrandRequest dto)
        {
            var isExistSlug = await _brandRepository.CheckExistSlugAsync(dto.Slug);

            if (isExistSlug) throw new ConflictException("Slug này đã tồn tại, vui lòng chọn tên khác!");

            var newBrand = _mapper.Map<Brand>(dto);
            newBrand.Id = Guid.NewGuid();

            if (dto.Logo != null)
            {
                var uploadResult = await _photoService.AddPhotoAsync(dto.Logo);

                if (uploadResult.Error != null) throw new Exception("Lỗi upload ảnh: " + uploadResult.Error.Message);

                newBrand.LogoUrl = uploadResult.SecureUrl.AbsoluteUri; // Lưu link ảnh vào DB
            }

            var createdBrand = await _brandRepository.CreateBrandAsync(newBrand);
            return _mapper.Map<BrandResponse>(createdBrand);
        }

        public async Task<BrandResponse?> UpdateBrandAsync(Guid brandId, UpdateBrandRequest dto)
        {
            var existingBrand = await _brandRepository.FindBrandByIdAsync(brandId);

            if (existingBrand == null) throw new KeyNotFoundException("Không tìm thấy thương hiệu!");

            if (dto.Slug != existingBrand.Slug)
            {
                var isExistSlug = await _brandRepository.CheckExistSlugAsync(dto.Slug);

                if (isExistSlug) throw new ConflictException("Slug này đã tồn tại, vui lòng chọn tên khác!");
            }

            if (!dto.IsActive)
            {
                var isSafeToUpdate = await _brandRepository.IsSafeToActionAsync(brandId);

                if (!isSafeToUpdate) throw new Exception("Khoan đã! Vẫn còn sản phẩm thuộc thương hiệu này. Hãy dọn dẹp chúng trước khi cập nhật trạng thái hoạt động của thương hiệu.");
            }

            _mapper.Map(dto, existingBrand);
            existingBrand.UpdatedDate = DateTime.UtcNow;

            if (dto.Logo != null)
            {
                // 1. Kiểm tra nếu ảnh cũ tồn tại thì Xóa đi
                if (!string.IsNullOrEmpty(existingBrand.LogoUrl))
                {
                    try
                    {
                        var publicId = _photoService.GetPublicIdFromUrl(existingBrand.LogoUrl);
                        await _photoService.DeletePhotoAsync(publicId);
                    }
                    catch (Exception ex)
                    {
                        throw new Exception("Lỗi xóa ảnh cũ: " + ex.Message);
                    }
                }

                // 2. Upload ảnh mới
                var uploadResult = await _photoService.AddPhotoAsync(dto.Logo);

                if (uploadResult.Error != null) throw new Exception(uploadResult.Error.Message);

                existingBrand.LogoUrl = uploadResult.SecureUrl.AbsoluteUri;
            }

            await _brandRepository.UpdateBrandAsync(existingBrand);
            return await _brandRepository.GetBrandByIdAsync(brandId);
        }

        public async Task DeleteBrandAsync(Guid brandId)
        {
            var existingBrand = await _brandRepository.FindBrandByIdAsync(brandId);

            if (existingBrand == null) throw new KeyNotFoundException("Không tìm thấy thương hiệu!");

            var isSafeToDelete = await _brandRepository.IsSafeToActionAsync(brandId);

            if (!isSafeToDelete) throw new Exception("Khoan đã! Vẫn còn sản phẩm thuộc thương hiệu này. Hãy dọn dẹp chúng trước khi xóa thương hiệu.");

            await _brandRepository.DeleteBrandAsync(existingBrand);
        }
    }
}
