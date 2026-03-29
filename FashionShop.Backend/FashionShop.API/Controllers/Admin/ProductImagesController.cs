using FashionShop.API.Services.Interfaces;
using FashionShop.Core.Contracts.ProductImage.Requests;
using FashionShop.Core.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Drawing;

namespace FashionShop.API.Controllers.Admin
{
    [Route("api/admin/products/{productId}/images")]
    public class ProductImagesController : AdminBaseApiControllers
    {
        private readonly IProductService _productService;

        public ProductImagesController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProductImage(Guid productId, [FromForm] CreateProductImageRequest request)
        {
            var result = await _productService.CreateProductImageAsync(request);
            return Created(result, "Thêm hình ảnh sản phẩm thành công!");
        }

        [HttpGet]
        public async Task<IActionResult> GetProductImages(Guid productId, [FromQuery] int? colorId)
        {
            var result = await _productService.GetProductImagesAsync(productId, colorId);
            return Success(result, "Lấy danh sách hình ảnh sản phẩm thành công!");
        }

        //[HttpGet("{productImageId}")]
        //public async Task<IActionResult> GetProductImageById([FromRoute] Guid productImageId)
        //{
        //    var result = await _productService.GetProductImageByIdAsync(productImageId);
        //    return Success(result, "Lấy hình ảnh sản phẩm thành công!");
        //}

        [HttpPut("{productImageId}")]
        public async Task<IActionResult> UpdateProductImage(Guid productId, [FromRoute] Guid productImageId, [FromBody] UpdateProductImageRequest request)
        {
            var result = await _productService.UpdateProductImageAsync(productImageId, request);
            return Success(result, "Cập nhật hình ảnh sản phẩm thành công!");
        }

        [HttpDelete("{productImageId}")]
        public async Task<IActionResult> DeleteProductImage(Guid productId, [FromRoute] Guid productImageId)
        {
            await _productService.DeleteProductImageAsync(productImageId);
            return Success<object?>(null, "Xoá hình ảnh sản phẩm thành công!");
        }
    }
}
