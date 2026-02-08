using FashionShop.API.Services.Interfaces;
using FashionShop.Core.DTOs.ProductImage;
using FashionShop.Core.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Drawing;

namespace FashionShop.API.Controllers.Admin
{
    [Route("api/admin/product-images")]
    public class ProductImagesController : AdminBaseApiControllers
    {
        private readonly IProductImageService _productImageService;

        public ProductImagesController(IProductImageService productImageService)
        {
            _productImageService = productImageService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProductImage([FromForm] CreateProductImageDTO request)
        {
            var result = await _productImageService.CreateProductImageAsync(request);
            return Created(result, "Thêm hình ảnh sản phẩm thành công!");
        }

        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetProductImages([FromRoute] Guid productId, [FromQuery] int? colorId)
        {
            var result = await _productImageService.GetProductImagesAsync(productId, colorId);
            return Success(result, "Lấy danh sách hình ảnh sản phẩm thành công!");
        }

        [HttpGet("{productImageId}")]
        public async Task<IActionResult> GetProductImageById([FromRoute] Guid productImageId)
        {
            var result = await _productImageService.GetProductImageByIdAsync(productImageId);
            return Success(result, "Lấy hình ảnh sản phẩm thành công!");
        }

        [HttpPut("{productImageId}")]
        public async Task<IActionResult> UpdateProductImage([FromRoute] Guid productImageId, [FromBody] UpdateProductImageDTO request)
        {
            var result = await _productImageService.UpdateProductImageAsync(productImageId, request);
            return Success(result, "Cập nhật hình ảnh sản phẩm thành công!");
        }

        [HttpDelete("{productImageId}")]
        public async Task<IActionResult> DeleteProductImage([FromRoute] Guid productImageId)
        {
            await _productImageService.DeleteProductImageAsync(productImageId);
            return Success<object>(null, "Xoá hình ảnh sản phẩm thành công!");
        }
    }
}
