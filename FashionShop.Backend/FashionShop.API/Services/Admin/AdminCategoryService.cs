using AutoMapper;
using FashionShop.API.Repositories.Admin.Interfaces;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Services.Admin.Interfaces;
using FashionShop.API.Services.Shared.Interfaces;
using FashionShop.Core.Contracts.Admin.Category.Requests;
using FashionShop.Core.Contracts.Admin.Category.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Exceptions;
using FashionShop.Core.Models;

namespace FashionShop.API.Services.Admin
{
    public class AdminCategoryService : IAdminCategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public AdminCategoryService(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _photoService = photoService;
        }



        // --- READ METHODS --- //

        public async Task<IEnumerable<AdminCategoryResponse>> GetAllCategoriesAsync()
            => await _unitOfWork.AdminCategories.GetAllCategoriesAsync();

        public async Task<PagedResult<AdminCategoryResponse>> GetPagedCategoriesAsync(AdminCategoryListRequest request)
            => await _unitOfWork.AdminCategories.GetPagedCategoriesAsync(request);

        public async Task<IEnumerable<AdminCategoryResponse>> GetLeafCategoriesAsync()
        {
            var leafCategories = await _unitOfWork.AdminCategories.GetLeafCategoriesAsync();
            return _mapper.Map<IEnumerable<AdminCategoryResponse>>(leafCategories);
        }

        public async Task<AdminCategoryResponse> GetCategoryByIdAsync(Guid categoryId)
        {
            var category = await _unitOfWork.AdminCategories.GetCategoryByIdAsync(categoryId);

            if (category == null) throw new KeyNotFoundException("Không tìm thấy danh mục!");

            return category;
        }

        public async Task<IEnumerable<AdminCategoryResponse>> GetCategoriesByParentIdAsync(Guid parentId)
        {
            var parentCategory = await _unitOfWork.AdminCategories.GetCategoryByIdAsync(parentId);

            if (parentCategory == null) throw new KeyNotFoundException("Không tìm thấy danh mục!");

            return await _unitOfWork.AdminCategories.GetCategoriesByParentIdAsync(parentId);
        }



        // --- WRITE METHODS --- //

        public async Task<AdminCategoryResponse?> CreateCategoryAsync(CreateCategoryRequest request)
        {
            if (request.ParentId.HasValue && request.ParentId != Guid.Empty)
            {
                var parentCategory = await _unitOfWork.AdminCategories.GetCategoryByIdAsync(request.ParentId.Value);

                if (parentCategory == null) throw new KeyNotFoundException("Không tìm thấy danh mục cha!");
            }

            var isExistSlug = await _unitOfWork.AdminCategories.CheckSlugExistAsync(request.Slug);

            if (isExistSlug) throw new ConflictException("Slug này đã tồn tại, vui lòng chọn tên khác!");

            var newCategory = _mapper.Map<Category>(request);
            newCategory.Id = Guid.NewGuid();

            if (request.Image != null)
            {
                var uploadResult = await _photoService.AddPhotoAsync(request.Image);

                if (uploadResult.Error != null) throw new Exception("Lỗi upload ảnh: " + uploadResult.Error.Message);

                newCategory.ImageUrl = uploadResult.SecureUrl.AbsoluteUri; // Lưu link ảnh vào DB
            }

            _unitOfWork.AdminCategories.CreateCategory(newCategory);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<AdminCategoryResponse>(newCategory);
        }

        public async Task<AdminCategoryResponse?> UpdateCategoryAsync(Guid categoryId, UpdateCategoryRequest request)
        {
            var existingCategory = await _unitOfWork.AdminCategories.FindCategoryByIdAsync(categoryId);

            if (existingCategory == null) throw new KeyNotFoundException("Không tìm thấy danh mục!");

            if (request.ParentId.HasValue && request.ParentId != Guid.Empty)
            {
                if (request.ParentId.Value == categoryId) throw new ConflictException("Danh mục cha không thể là chính nó!");

                var parentCategory = await _unitOfWork.AdminCategories.GetCategoryByIdAsync(request.ParentId.Value);

                if (parentCategory == null) throw new KeyNotFoundException("Không tìm thấy danh mục cha!");
            }

            if (request.Slug != existingCategory.Slug)
            {
                var isExistSlug = await _unitOfWork.AdminCategories.CheckSlugExistAsync(request.Slug);

                if (isExistSlug) throw new ConflictException("Slug này đã tồn tại, vui lòng chọn tên khác!");
            }

            if (!request.IsActive)
            {
                var isSafeToUpdate = await _unitOfWork.AdminCategories.IsSafeToActionAsync(categoryId);

                if (!isSafeToUpdate) throw new Exception("Khoan đã! Vẫn còn sản phẩm thuộc danh mục này. Hãy dọn dẹp chúng trước khi cập nhật trạng thái hoạt động của danh mục.");
            }

            _mapper.Map(request, existingCategory);
            existingCategory.UpdatedDate = DateTime.UtcNow;

            string? oldImagePublicId = null;

            if (request.Image != null)
            {
                var uploadResult = await _photoService.AddPhotoAsync(request.Image);
                if (uploadResult.Error != null) throw new Exception(uploadResult.Error.Message);

                if (!string.IsNullOrEmpty(existingCategory.ImageUrl))
                {
                    oldImagePublicId = _photoService.GetPublicIdFromUrl(existingCategory.ImageUrl);
                }

                existingCategory.ImageUrl = uploadResult.SecureUrl.AbsoluteUri;
            } else if (request.IsImageDeleted)
            {
                if (!string.IsNullOrEmpty(existingCategory.ImageUrl))
                {
                    oldImagePublicId = _photoService.GetPublicIdFromUrl(existingCategory.ImageUrl);
                }

                existingCategory.ImageUrl = null;
            }

            await _unitOfWork.SaveChangesAsync();

            if (!string.IsNullOrEmpty(oldImagePublicId))
            {
                try
                {
                    await _photoService.DeletePhotoAsync(oldImagePublicId);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi xóa ảnh cũ: " + ex.Message);
                }
            }

            return await _unitOfWork.AdminCategories.GetCategoryByIdAsync(categoryId);
        }

        public async Task DeleteCategoryAsync(Guid categoryId)
        {
            var existingCategory = await _unitOfWork.AdminCategories.GetCategoryByIdAsync(categoryId);

            if (existingCategory == null) throw new KeyNotFoundException("Không tìm thấy danh mục!");

            bool isSafeToDelete = await _unitOfWork.AdminCategories.IsSafeToActionAsync(categoryId);

            if (!isSafeToDelete) throw new Exception("Khoan đã! Vẫn còn sản phẩm thuộc danh mục này. Hãy dọn dẹp chúng trước khi xóa danh mục.");

            if (!string.IsNullOrEmpty(existingCategory.ImageUrl))
            {
                try
                {
                    var publicId = _photoService.GetPublicIdFromUrl(existingCategory.ImageUrl);
                    await _photoService.DeletePhotoAsync(publicId);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi xóa ảnh cũ: " + ex.Message);
                }
            }

            await _unitOfWork.AdminCategories.DeleteCategoryAsync(categoryId);
        }
    }
}
