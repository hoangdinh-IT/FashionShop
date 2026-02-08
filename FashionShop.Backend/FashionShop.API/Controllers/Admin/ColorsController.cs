using Azure.Core;
using FashionShop.API.Services.Interfaces;
using FashionShop.Core.DTOs.Color;
using FashionShop.Core.Models.Colors;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Controllers.Admin
{
    public class ColorsController : AdminBaseApiControllers
    {
        private readonly IColorService _colorService;

        public ColorsController(IColorService colorService)
        {
            _colorService = colorService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateColor(CreateColorDTO request)
        {
            var result = await _colorService.CreateColorAsync(request);
            return Created(result, "Thêm màu sắc thành công!");
        }

        [HttpGet]
        public async Task<IActionResult> GetColors([FromQuery] ColorListRequest request)
        {
            var result = await _colorService.GetPagedColorsAsync(request);
            return Success(result, "Lấy danh sách màu sắc thành công!");
        }

        [HttpGet("{colorId}")]
        public async Task<IActionResult> GetColorById(int colorId)
        {
            if (string.IsNullOrWhiteSpace(Convert.ToString(colorId))) throw new ArgumentNullException(nameof(colorId));

            var result = await _colorService.GetColorByIdAsync(colorId);
            return Success(result, "Lấy màu sắc thành công!");
        }

        [HttpPut("{colorId}")]
        public async Task<IActionResult> UpdateColor(int colorId, UpdateColorDTO request)
        {
            if (string.IsNullOrWhiteSpace(Convert.ToString(colorId))) throw new ArgumentNullException(nameof(colorId));

            var result = await _colorService.UpdateColorAsync(colorId, request);
            return Success(result, "Cập nhật màu sắc thành công!");
        }

        [HttpDelete("{colorId}")]
        public async Task<IActionResult> DeleteColor(int colorId)
        {
            if (string.IsNullOrWhiteSpace(Convert.ToString(colorId))) throw new ArgumentNullException(nameof(colorId));

            await _colorService.DeleteColorAsync(colorId);
            return Success<object?>(null, "Xoá màu sắc thành công!");
        }
    }
}
