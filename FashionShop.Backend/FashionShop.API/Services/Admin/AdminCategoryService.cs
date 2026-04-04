using AutoMapper;
using FashionShop.API.Repositories.Interfaces;
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
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public AdminCategoryService(ICategoryRepository categoryRepository, IMapper mapper, IPhotoService photoService)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
            _photoService = photoService;
        }



        // --- READ METHODS --- //

        public async Task<IEnumerable<AdminCategoryResponse>> GetAllCategoriesAsync()
            => await _categoryRepository.GetAllCategoriesAsync();

        public async Task<PagedResult<AdminCategoryResponse>> GetPagedCategoriesAsync(AdminCategoryListRequest request)
            => await _categoryRepository.GetPagedCategoriesAsync(request);

        public async Task<IEnumerable<AdminCategoryResponse>> GetLeafCategoriesAsync()
        {
            var leafCategories = await _categoryRepository.GetLeafCategoriesAsync();
            return _mapper.Map<IEnumerable<AdminCategoryResponse>>(leafCategories);
        }

        public async Task<AdminCategoryResponse> GetCategoryByIdAsync(Guid categoryId)
        {
            var category = await _categoryRepository.GetCategoryByIdAsync(categoryId);

            if (category == null) throw new KeyNotFoundException("Không tìm thấy danh mục!");

            return category;
        }

        public async Task<IEnumerable<AdminCategoryResponse>> GetCategoriesByParentIdAsync(Guid parentId)
        {
            var parentCategory = await _categoryRepository.GetCategoryByIdAsync(parentId);

            if (parentCategory == null) throw new KeyNotFoundException("Không tìm thấy danh mục!");

            return await _categoryRepository.GetCategoriesByParentIdAsync(parentId);
        }



        // --- WRITE METHODS --- //

        public async Task<AdminCategoryResponse?> CreateCategoryAsync(CreateCategoryRequest request)
        {
            if (request.ParentId.HasValue && request.ParentId != Guid.Empty)
            {
                var parentCategory = await _categoryRepository.GetCategoryByIdAsync(request.ParentId.Value);

                if (parentCategory == null) throw new KeyNotFoundException("Không tìm thấy danh mục cha!");
            }

            var isExistSlug = await _categoryRepository.CheckSlugExistAsync(request.Slug);

            if (isExistSlug) throw new ConflictException("Slug này đã tồn tại, vui lòng chọn tên khác!");

            var newCategory = _mapper.Map<Category>(request);
            newCategory.Id = Guid.NewGuid();

            if (request.Image != null)
            {
                var uploadResult = await _photoService.AddPhotoAsync(request.Image);

                if (uploadResult.Error != null) throw new Exception("Lỗi upload ảnh: " + uploadResult.Error.Message);

                newCategory.ImageUrl = uploadResult.SecureUrl.AbsoluteUri; // Lưu link ảnh vào DB
            }

            var createdCategory = await _categoryRepository.CreateCategoryAsync(newCategory);
            return _mapper.Map<AdminCategoryResponse>(newCategory);
        }

        public async Task<AdminCategoryResponse?> UpdateCategoryAsync(Guid categoryId, UpdateCategoryRequest request)
        {
            var existingCategory = await _categoryRepository.FindCategoryByIdAsync(categoryId);

            if (existingCategory == null) throw new KeyNotFoundException("Không tìm thấy danh mục!");

            if (request.ParentId.HasValue && request.ParentId != Guid.Empty)
            {
                if (request.ParentId.Value == categoryId) throw new ConflictException("Danh mục cha không thể là chính nó!");

                var parentCategory = await _categoryRepository.GetCategoryByIdAsync(request.ParentId.Value);

                if (parentCategory == null) throw new KeyNotFoundException("Không tìm thấy danh mục cha!");
            }

            if (request.Slug != existingCategory.Slug)
            {
                var isExistSlug = await _categoryRepository.CheckSlugExistAsync(request.Slug);

                if (isExistSlug) throw new ConflictException("Slug này đã tồn tại, vui lòng chọn tên khác!");
            }

            if (!request.IsActive)
            {
                var isSafeToUpdate = await _categoryRepository.IsSafeToActionAsync(categoryId);

                if (!isSafeToUpdate) throw new Exception("Khoan đã! Vẫn còn sản phẩm thuộc danh mục này. Hãy dọn dẹp chúng trước khi cập nhật trạng thái hoạt động của danh mục.");
            }

            _mapper.Map(request, existingCategory);

            if (request.Image != null)
            {
                // 1. Kiểm tra nếu ảnh cũ tồn tại thì Xóa đi
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

                // 2. Upload ảnh mới
                var uploadResult = await _photoService.AddPhotoAsync(request.Image);

                if (uploadResult.Error != null) throw new Exception(uploadResult.Error.Message);

                existingCategory.ImageUrl = uploadResult.SecureUrl.AbsoluteUri;
            }
            else if (request.IsImageDeleted)
            {
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
                existingCategory.ImageUrl = null;
            }

            existingCategory.UpdatedDate = DateTime.UtcNow;
            await _categoryRepository.UpdateCategoryAsync(existingCategory);
            return await _categoryRepository.GetCategoryByIdAsync(categoryId);
        }

        public async Task DeleteCategoryAsync(Guid categoryId)
        {
            var existingCategory = await _categoryRepository.GetCategoryByIdAsync(categoryId);

            if (existingCategory == null) throw new KeyNotFoundException("Không tìm thấy danh mục!");

            bool isSafeToDelete = await _categoryRepository.IsSafeToActionAsync(categoryId);

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

            await _categoryRepository.DeleteCategoryAsync(categoryId);
        }
    }
}
