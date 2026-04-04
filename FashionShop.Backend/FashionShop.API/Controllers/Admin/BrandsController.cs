using FashionShop.API.Services.Interfaces;
using FashionShop.Core.Contracts.Brand.Requests;
using FashionShop.Core.Models.Brand;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Controllers.Admin
{
    public class BrandsController : AdminBaseApiControllers
    {
        private readonly IBrandService _brandService;

        public BrandsController(IBrandService brandService)
        {
            _brandService = brandService;
        }



        // --- READ METHODS --- //

        [HttpGet("all")]
        public async Task<IActionResult> GetAllBrands()
        {
            var result = await _brandService.GetAllBrandsAsync();
            return Success(result, "Lấy tất cả thương hiệu thành công!");
        }

        [HttpGet]
        public async Task<IActionResult> GetBrands([FromQuery] BrandListRequest request)
        {
            var result = await _brandService.GetPagedBrandsAsync(request);
            return Success(result, "Lấy danh sách thương hiệu thành công!");
        }

        [HttpGet("{brandId}")]
        public async Task<IActionResult> GetBrandById(Guid brandId)
        {
            if (brandId == Guid.Empty) throw new ArgumentException("ID không hợp lệ!");

            var result = await _brandService.GetBrandByIdAsync(brandId);
            return Success(result, "Lấy thương hiệu thành công!");
        }



        // --- WRITE METHODS --- //

        [HttpPost]
        public async Task<IActionResult> CreateBrand([FromForm] CreateBrandRequest request)
        {
            var result = await _brandService.CreateBrandAsync(request);
            return Created(result, "Thêm thương hiệu thành công!");
        }

        [HttpPut("{brandId}")]
        public async Task<IActionResult> UpdateBrand(Guid brandId, [FromForm] UpdateBrandRequest request)
        {
            if (brandId == Guid.Empty) throw new ArgumentException("ID không hợp lệ!");

            var result = await _brandService.UpdateBrandAsync(brandId, request);
            return Success(result, "Cập nhật thương hiệu thành công!");
        }

        [HttpDelete("{brandId}")]
        public async Task<IActionResult> DeleteBrand(Guid brandId)
        {
            if (brandId == Guid.Empty) throw new ArgumentException("ID không hợp lệ!");

            await _brandService.DeleteBrandAsync(brandId);
            return Success<object?>(null, "Xoá thương hiệu thành công!");
        }
    }
}
