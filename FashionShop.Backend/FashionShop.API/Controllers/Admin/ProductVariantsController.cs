using Azure.Core;
using FashionShop.API.Services.Interfaces;
using FashionShop.Core.DTOs.ProductVariant;
using FashionShop.Core.Models.ProductVariants;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Controllers.Admin
{
    [Route("api/admin/product-variants")]
    public class ProductVariantsController : AdminBaseApiControllers
    {
        private readonly IProductService _productService;

        public ProductVariantsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProductVariant([FromForm] CreateProductVariantDTO request)
        {
            var result = await _productService.CreateProductVariantAsync(request);
            return Created(result, "Thêm sản phẩm biến thể thành công!");
        }

        [HttpGet]
        public async Task<IActionResult> GetPagedProductVariants([FromQuery] ProductVariantListRequest request)
        {
            var result = await _productService.GetPagedProductVariantsAsync(request);
            return Success(result, "Lấy danh sách sản phẩm biến thể thành công!");
        }

        [HttpGet("{productVariantId}")]
        public async Task<IActionResult> GetProductVariantById(Guid productVariantId)
        {
            var result = await _productService.GetProductVariantByIdAsync(productVariantId);
            return Success(result, "Lấy sản phẩm biến thể thành công!");
        }

        [HttpGet("products/{productId}")]
        public async Task<IActionResult> GetProductVariantsByProductId(Guid productId)
        {
            var result = await _productService.GetProductVariantsByProductIdAsync(productId);
            return Success(result, "Lấy danh sách sản phẩm biến thể dựa vào sản phẩm thành công!");
        }

        [HttpPut("{productVariantId}")]
        public async Task<IActionResult> UpdateProductVariant(Guid productVariantId, UpdateProductVariantDTO request)
        {
            var result = await _productService.UpdateProductVariantAsync(productVariantId, request);
            return Success(result, "Cập nhật sản phẩm biến thể thành công!");
        }

        [HttpDelete("{productVariantId}")]
        public async Task<IActionResult> DeleteProductVariant(Guid productVariantId)
        {
            await _productService.DeleteProductVariantAsync(productVariantId);
            return Success<object?>(null, "Xoá sản phẩm biến thể thành công!");
        }
    }
}
