using FashionShop.API.Services.Interfaces;
using FashionShop.Core.DTOs.Product;
using FashionShop.Core.Entities;
using FashionShop.Core.Models.Products;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Controllers.Admin
{
    public class ProductsController : AdminBaseApiControllers
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromForm] CreateProductDTO request)
        {
            var result = await _productService.CreateProductAsync(request);
            return Created(result, "Thêm sản phẩm thành công!");
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery] ProductListRequest request)
        {
            var result = await _productService.GetPagedProductsAsync(request);
            return Success(result, "Lấy danh sách sản phẩm thành công!");
        }

        [HttpGet("{productId}")]
        public async Task<IActionResult> GetProductById(Guid productId)
        {
            if (productId == Guid.Empty) throw new ArgumentException("ID không hợp lệ!");

            var result = await _productService.GetProductByIdAsync(productId);
            return Success(result, "Lấy sản phẩm thành công!");
        }

        [HttpPut("{productId}")]
        public async Task<IActionResult> UpdateProduct(Guid productId, [FromForm] UpdateProductDTO request)
        {
            if (productId == Guid.Empty) throw new ArgumentException("ID không hợp lệ!");

            var result = await _productService.UpdateProductAsync(productId, request);
            return Success(result, "Cập nhật sản phầm thành công!");
        }

        [HttpDelete("{productId}")]
        public async Task<IActionResult> DeleteProduct(Guid productId)
        {
            if (productId == Guid.Empty) throw new ArgumentException("ID không hợp lệ!");

            await _productService.DeleteProductAsync(productId);
            return Success<object?>(null, "Xoá sản phẩm thành công!");
        }
    }
}
