using AutoMapper;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.API.Services.Admin.Interfaces;
using FashionShop.API.Services.Shared.Interfaces;
using FashionShop.Core.Contracts.Admin.Brand.Requests;
using FashionShop.Core.Contracts.Admin.Brand.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Exceptions;
using FashionShop.Core.Models;

namespace FashionShop.API.Services.Admin
{
    public class AdminBrandService : IAdminBrandService
    {
        private readonly IBrandRepository _brandRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public AdminBrandService(IBrandRepository brandRepository, IMapper mapper, IPhotoService photoService)
        {
            _brandRepository = brandRepository;
            _mapper = mapper;
            _photoService = photoService;
        }



        // --- READ METHODS --- //

        public async Task<IEnumerable<AdminBrandResponse>> GetAllBrandsAsync()
        {
            var brands = await _brandRepository.GetAllBrandsAsync();
            return _mapper.Map<IEnumerable<AdminBrandResponse>>(brands);
        }

        public async Task<PagedResult<AdminBrandResponse>> GetPagedBrandsAsync(AdminBrandListRequest request)
            => await _brandRepository.GetPagedBrandsAsync(request);

        public async Task<AdminBrandResponse?> GetBrandByIdAsync(Guid brandId)
        {
            var brand = await _brandRepository.GetBrandByIdAsync(brandId);

            if (brand == null) throw new KeyNotFoundException("Không tìm thấy thương hiệu!");

            return brand;
        }



        // --- WRITE METHODS --- //

        public async Task<AdminBrandResponse?> CreateBrandAsync(CreateBrandRequest request)
        {
            var isExistSlug = await _brandRepository.CheckExistSlugAsync(request.Slug);

            if (isExistSlug) throw new ConflictException("Slug này đã tồn tại, vui lòng chọn tên khác!");

            var newBrand = _mapper.Map<Brand>(request);
            newBrand.Id = Guid.NewGuid();

            if (request.Logo != null)
            {
                var uploadResult = await _photoService.AddPhotoAsync(request.Logo);

                if (uploadResult.Error != null) throw new Exception("Lỗi upload ảnh: " + uploadResult.Error.Message);

                newBrand.LogoUrl = uploadResult.SecureUrl.AbsoluteUri; // Lưu link ảnh vào DB
            }

            var createdBrand = await _brandRepository.CreateBrandAsync(newBrand);
            return _mapper.Map<AdminBrandResponse>(createdBrand);
        }

        public async Task<AdminBrandResponse?> UpdateBrandAsync(Guid brandId, UpdateBrandRequest request)
        {
            var existingBrand = await _brandRepository.FindBrandByIdAsync(brandId);

            if (existingBrand == null) throw new KeyNotFoundException("Không tìm thấy thương hiệu!");

            if (request.Slug != existingBrand.Slug)
            {
                var isExistSlug = await _brandRepository.CheckExistSlugAsync(request.Slug);

                if (isExistSlug) throw new ConflictException("Slug này đã tồn tại, vui lòng chọn tên khác!");
            }

            if (!request.IsActive)
            {
                var isSafeToUpdate = await _brandRepository.IsSafeToActionAsync(brandId);

                if (!isSafeToUpdate) throw new Exception("Khoan đã! Vẫn còn sản phẩm thuộc thương hiệu này. Hãy dọn dẹp chúng trước khi cập nhật trạng thái hoạt động của thương hiệu.");
            }

            _mapper.Map(request, existingBrand);
            existingBrand.UpdatedDate = DateTime.UtcNow;

            if (request.Logo != null)
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
                var uploadResult = await _photoService.AddPhotoAsync(request.Logo);

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
