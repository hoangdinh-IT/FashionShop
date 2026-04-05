using AutoMapper;
using FashionShop.API.Repositories.Admin.Interfaces;
using FashionShop.API.Repositories.Shared.Interfaces;
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
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public AdminBrandService(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _photoService = photoService;
        }



        // --- READ METHODS --- //

        public async Task<IEnumerable<AdminBrandResponse>> GetAllBrandsAsync()
        {
            var brands = await _unitOfWork.AdminBrands.GetAllBrandsAsync();
            return _mapper.Map<IEnumerable<AdminBrandResponse>>(brands);
        }

        public async Task<PagedResult<AdminBrandResponse>> GetPagedBrandsAsync(AdminBrandListRequest request)
            => await _unitOfWork.AdminBrands.GetPagedBrandsAsync(request);

        public async Task<AdminBrandResponse?> GetBrandByIdAsync(Guid brandId)
        {
            var brand = await _unitOfWork.AdminBrands.GetBrandByIdAsync(brandId);

            if (brand == null) throw new KeyNotFoundException("Không tìm thấy thương hiệu!");

            return brand;
        }



        // --- WRITE METHODS --- //

        public async Task<AdminBrandResponse?> CreateBrandAsync(CreateBrandRequest request)
        {
            var isExistSlug = await _unitOfWork.AdminBrands.CheckExistSlugAsync(request.Slug);

            if (isExistSlug) throw new ConflictException("Slug này đã tồn tại, vui lòng chọn tên khác!");

            var newBrand = _mapper.Map<Brand>(request);
            newBrand.Id = Guid.NewGuid();

            if (request.Logo != null)
            {
                var uploadResult = await _photoService.AddPhotoAsync(request.Logo);

                if (uploadResult.Error != null) throw new Exception("Lỗi upload ảnh: " + uploadResult.Error.Message);

                newBrand.LogoUrl = uploadResult.SecureUrl.AbsoluteUri; // Lưu link ảnh vào DB
            }

            _unitOfWork.AdminBrands.CreateBrand(newBrand);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<AdminBrandResponse>(newBrand);
        }

        public async Task<AdminBrandResponse?> UpdateBrandAsync(Guid brandId, UpdateBrandRequest request)
        {
            var existingBrand = await _unitOfWork.AdminBrands.FindBrandByIdAsync(brandId);

            if (existingBrand == null) throw new KeyNotFoundException("Không tìm thấy thương hiệu!");

            if (request.Slug != existingBrand.Slug)
            {
                var isExistSlug = await _unitOfWork.AdminBrands.CheckExistSlugAsync(request.Slug);

                if (isExistSlug) throw new ConflictException("Slug này đã tồn tại, vui lòng chọn tên khác!");
            }

            if (!request.IsActive)
            {
                var isSafeToUpdate = await _unitOfWork.AdminBrands.IsSafeToActionAsync(brandId);

                if (!isSafeToUpdate) throw new Exception("Khoan đã! Vẫn còn sản phẩm thuộc thương hiệu này. Hãy dọn dẹp chúng trước khi cập nhật trạng thái hoạt động của thương hiệu.");
            }

            _mapper.Map(request, existingBrand);
            existingBrand.UpdatedDate = DateTime.UtcNow;

            string? oldLogoPublicId = null;

            if (request.Logo != null)
            {
                var uploadResult = await _photoService.AddPhotoAsync(request.Logo);
                if (uploadResult.Error != null) throw new Exception(uploadResult.Error.Message);

                if (!string.IsNullOrEmpty(existingBrand.LogoUrl))
                {
                    oldLogoPublicId = _photoService.GetPublicIdFromUrl(existingBrand.LogoUrl);
                }

                existingBrand.LogoUrl = uploadResult.SecureUrl.AbsoluteUri;
            }

            await _unitOfWork.SaveChangesAsync();

            if (!string.IsNullOrEmpty(oldLogoPublicId))
            {
                try
                {
                    await _photoService.DeletePhotoAsync(oldLogoPublicId);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi xóa ảnh cũ: " + ex.Message);
                }
            }

            return await _unitOfWork.AdminBrands.GetBrandByIdAsync(brandId);
        }

        public async Task DeleteBrandAsync(Guid brandId)
        {
            var existingBrand = await _unitOfWork.AdminBrands.FindBrandByIdAsync(brandId);

            if (existingBrand == null) throw new KeyNotFoundException("Không tìm thấy thương hiệu!");

            var isSafeToDelete = await _unitOfWork.AdminBrands.IsSafeToActionAsync(brandId);

            if (!isSafeToDelete) throw new Exception("Khoan đã! Vẫn còn sản phẩm thuộc thương hiệu này. Hãy dọn dẹp chúng trước khi xóa thương hiệu.");

            _unitOfWork.AdminBrands.DeleteBrand(existingBrand);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
