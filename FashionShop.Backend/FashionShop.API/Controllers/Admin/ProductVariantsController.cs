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
        private readonly IProductVariantService _productVariantService;

        public ProductVariantsController(IProductVariantService productVariantService)
        {
            _productVariantService = productVariantService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProductVariant([FromForm] CreateProductVariantDTO request)
        {
            var result = await _productVariantService.CreateProductVariantAsync(request);
            return Created(result, "Thêm sản phẩm biến thể thành công!");
        }

        [HttpGet]
        public async Task<IActionResult> GetPagedProductVariants([FromQuery] ProductVariantListRequest request)
        {
            var result = await _productVariantService.GetPagedProductVariantsAsync(request);
            return Success(result, "Lấy danh sách sản phẩm biến thể thành công!");
        }

        [HttpGet("{productVariantId}")]
        public async Task<IActionResult> GetProductVariantById(Guid productVariantId)
        {
            var result = await _productVariantService.GetProductVariantByIdAsync(productVariantId);
            return Success(result, "Lấy sản phẩm biến thể thành công!");
        }

        [HttpPut("{productVariantId}")]
        public async Task<IActionResult> UpdateProductVariant(Guid productVariantId, UpdateProductVariantDTO request)
        {
            var result = await _productVariantService.UpdateProductVariantAsync(productVariantId, request);
            return Success(result, "Cập nhật sản phẩm biến thể thành công!");
        }

        [HttpDelete("{productVariantId}")]
        public async Task<IActionResult> DeleteProductVariant(Guid productVariantId)
        {
            await _productVariantService.DeleteProductVariantAsync(productVariantId);
            return Success<object?>(null, "Xoá sản phẩm biến thể thành công!");
        }
    }
}
