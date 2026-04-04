using Azure.Core;
using FashionShop.API.Services.Admin.Interfaces;
using FashionShop.Core.Contracts.Admin.Category.Requests;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Controllers.Admin
{
    [Route("api/admin/categories")]
    public class AdminCategoriesController : AdminBaseApiControllers
    {
        private readonly IAdminCategoryService _categoryService;

        public AdminCategoriesController(IAdminCategoryService categoryService)
        {
            _categoryService = categoryService;
        }



        // --- READ METHODS --- //

        [HttpGet("all")]
        public async Task<IActionResult> GetAllCategories()
        {
            var result = await _categoryService.GetAllCategoriesAsync();
            return Success(result, "Lấy tất cả danh mục thành công!");
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories([FromQuery] AdminCategoryListRequest request)
        {
            var result = await _categoryService.GetPagedCategoriesAsync(request);
            return Success(result, "Lấy danh sách danh mục thành công!");
        }

        [HttpGet("leaf")]
        public async Task<IActionResult> GetLeafCategories()
        {
            var result = await _categoryService.GetLeafCategoriesAsync();
            return Success(result, "Lấy danh sách danh mục lá thành công!");
        }

        [HttpGet("{categoryId}")]
        public async Task<IActionResult> GetCategoryById(Guid categoryId)
        {
            if (categoryId == Guid.Empty)
            {
                throw new ArgumentException("ID không hợp lệ!");
            }

            var result = await _categoryService.GetCategoryByIdAsync(categoryId);
            return Success(result, "Lấy danh mục thành công!");
        }

        [HttpGet("parent/{parentId}")]
        public async Task<IActionResult> GetCategoriesByParentId(Guid parentId)
        {
            if (parentId == Guid.Empty)
            {
                throw new ArgumentException("ID không hợp lệ!");
            }

            var result = await _categoryService.GetCategoriesByParentIdAsync(parentId);
            return Success(result, "Lấy danh sách danh mục thành công!");
        }



        // --- WRITE METHODS --- //

        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromForm] CreateCategoryRequest request)
        {
            var result = await _categoryService.CreateCategoryAsync(request);
            return Created(result, "Thêm danh mục thành công!");
        }

        [HttpPut("{categoryId}")]
        public async Task<IActionResult> UpdateCategory(Guid categoryId, [FromForm] UpdateCategoryRequest request)
        {
            if (categoryId == Guid.Empty)
            {
                throw new ArgumentException("ID không hợp lệ!");
            }

            var result = await _categoryService.UpdateCategoryAsync(categoryId, request);
            return Success(result, "Cập nhật danh mục thành công!");
        }

        [HttpDelete("{categoryId}")]
        public async Task<IActionResult> DeleteCategory(Guid categoryId)
        {
            await _categoryService.DeleteCategoryAsync(categoryId);
            return Success<object?>(null, "Xoá danh mục thành công!");
        }
    }
}
