using FashionShop.API.Services.Admin.Interfaces;
using FashionShop.Core.Contracts.Admin.ProductImage.Requests;
using FashionShop.Core.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Drawing;

namespace FashionShop.API.Controllers.Admin
{
    [Route("api/admin/products/{productId}/images")]
    public class AdminProductImagesController : AdminBaseApiControllers
    {
        private readonly IAdminProductService _productService;

        public AdminProductImagesController(IAdminProductService productService)
        {
            _productService = productService;
        }



        // --- READ METHODS --- //

        [HttpGet]
        public async Task<IActionResult> GetProductImages(Guid productId, [FromQuery] int? colorId)
        {
            var result = await _productService.GetProductImagesAsync(productId, colorId);
            return Success(result, "Lấy danh sách hình ảnh sản phẩm thành công!");
        }



        // --- WRITE METHODS --- //

        [HttpPost]
        public async Task<IActionResult> CreateProductImage(Guid productId, [FromForm] CreateProductImagesRequest request)
        {
            var result = await _productService.CreateProductImageAsync(productId, request);
            return Created(result, "Thêm hình ảnh sản phẩm thành công!");
        }

        //[HttpPut("{productImageId}")]
        //public async Task<IActionResult> UpdateProductImage(Guid productId, Guid productImageId, [FromBody] UpdateProductImageRequest request)
        //{
        //    var result = await _productService.UpdateProductImageAsync(productImageId, request);
        //    return Success(result, "Cập nhật hình ảnh sản phẩm thành công!");
        //}

        [HttpPut("sortOrder")]
        public async Task<IActionResult> UpdateSortOrder(Guid productId, [FromBody] UpdateSortOrderRequest request)
        {
            var result = await _productService.UpdateSortOrderAsync(productId, request);
            return Success(result, "Cập nhật thứ tự hình ảnh thành công!");
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteProductImage(Guid productId, [FromBody] DeleteProductImagesRequest? request)
        {
            await _productService.DeleteProductImageAsync(productId, request);
            return Success<object?>(null, "Xoá hình ảnh sản phẩm thành công!");
        }
    }
}
