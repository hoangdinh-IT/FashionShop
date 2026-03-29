using Azure.Core;
using FashionShop.API.Services.Implements;
using FashionShop.API.Services.Interfaces;
using FashionShop.Core.Contracts.Size.Requests;
using FashionShop.Core.Models.Sizes;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Controllers.Admin
{
    public class SizesController : AdminBaseApiControllers
    {
        private readonly ISizeService _sizeService;

        public SizesController(ISizeService sizeService)
        {
            _sizeService = sizeService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateSize(CreateSizeRequest request)
        {
            var result = await _sizeService.CreateSizeAsync(request);
            return Created(result, "Thêm kích thước thành công!");
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllSizes()
        {
            var result = await _sizeService.GetAllSizesAsync();
            return Success(result, "Lấy tất cả kích thước thành công!");
        }

        [HttpGet]
        public async Task<IActionResult> GetSizes([FromQuery] SizeListRequest request)
        {
            var result = await _sizeService.GetPagedSizesAsync(request);
            return Success(result, "Lấy danh sách kích thước thành công!");
        }

        [HttpGet("{sizeId}")]
        public async Task<IActionResult> GetSizeById(int sizeId)
        {
            if (string.IsNullOrWhiteSpace(Convert.ToString(sizeId))) throw new ArgumentNullException(nameof(sizeId));

            var result = await _sizeService.GetSizeByIdAsync(sizeId);
            return Success(result, "Lấy kích thước thành công!");
        }

        [HttpPut("{sizeId}")]
        public async Task<IActionResult> UpdateSize(int sizeId, UpdateSizeRequest request)
        {
            if (string.IsNullOrWhiteSpace(Convert.ToString(sizeId))) throw new ArgumentNullException(nameof(sizeId));

            var result = await _sizeService.UpdateSizeAsync(sizeId, request);
            return Success(result, "Cập nhật kích thước thành công!");
        }

        [HttpDelete("{sizeId}")]
        public async Task<IActionResult> DeleteSize(int sizeId)
        {
            if (string.IsNullOrWhiteSpace(Convert.ToString(sizeId))) throw new ArgumentNullException(nameof(sizeId));

            await _sizeService.DeleteSizeAsync(sizeId);
            return Success<object?>(null, "Xoá kích thước thành công!");
        }
    }
}
