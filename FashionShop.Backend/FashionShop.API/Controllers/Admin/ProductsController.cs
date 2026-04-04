using FashionShop.API.Services.Interfaces;
using FashionShop.Core.Contracts.Product.Requests;
using FashionShop.Core.Entities;
using FashionShop.Core.Models.Product;
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



        // --- READ METHODS --- //

        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery] ProductListRequest request)
        {
            var result = await _productService.GetPagedProductsAsync(request);
            return Success(result, "Lấy danh sách sản phẩm thành công!");
        }

        [HttpGet("{productId}")]
        public async Task<IActionResult> GetProductById([FromRoute] Guid productId)
        {
            if (productId == Guid.Empty) throw new ArgumentException("ID không hợp lệ!");

            var result = await _productService.GetProductByIdAsync(productId);
            return Success(result, "Lấy sản phẩm thành công!");
        }

        [HttpGet("detail/{productId}")]
        public async Task<IActionResult> GetProductDetailById([FromRoute] Guid productId)
        {
            if (productId == Guid.Empty) throw new ArgumentException("ID không hợp lệ!");

            var result = await _productService.GetProductDetailByIdAsync(productId);
            return Success(result, "Lấy chi tiết sản phẩm thành công!");
        }

        [HttpGet("{productId}/colors")]
        public async Task<IActionResult> GetColorsByProductId([FromRoute] Guid productId)
        {
            var result = await _productService.GetColorsByProductIdAsync(productId);
            return Success(result, "Lấy danh sách màu sắc dựa vào productId thành công!");
        }



        // --- WRITE METHODS --- //

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromForm] CreateProductRequest request)
        {
            var result = await _productService.CreateProductAsync(request);
            return Created(result, "Thêm sản phẩm thành công!");
        }

        [HttpPost("detail")]
        public async Task<IActionResult> CreateProductDetail([FromForm] CreateProductDetailRequest request)
        {
            var result = await _productService.CreateProductDetailAsync(request);
            return Created(result, "Thêm chi tiết sản phẩm thành công!");
        }

        [HttpPut("{productId}")]
        public async Task<IActionResult> UpdateProduct(Guid productId, [FromForm] UpdateProductRequest request)
        {
            if (productId == Guid.Empty) throw new ArgumentException("ID không hợp lệ!");

            var result = await _productService.UpdateProductAsync(productId, request);
            return Success(result, "Cập nhật sản phầm thành công!");
        }

        [HttpPut("detail/{productId}")]
        public async Task<IActionResult> UpdateProductDetail(Guid productId, [FromForm] UpdateProductDetailRequest request)
        {
            if (productId == Guid.Empty) throw new ArgumentException("ID không hợp lệ!");

            var result = await _productService.UpdateProductDetailAsync(productId, request);
            return Success(result, "Cập nhật chi tiết sản phẩm thành công!");
        }

        [HttpDelete("{productId}")]
        public async Task<IActionResult> DeleteProduct(Guid productId)
        {
            if (productId == Guid.Empty) throw new ArgumentException("ID không hợp lệ!");

            await _productService.DeleteProductAsync(productId);
            return Success<object?>(null, "Xoá sản phẩm thành công!");
        }

        [HttpDelete("detail/{productId}")]
        public async Task<IActionResult> DeleteProductDetail(Guid productId)
        {
            if (productId == Guid.Empty) throw new ArgumentException("ID không hợp lệ!");

            await _productService.DeleteProductDetailAsync(productId);
            return Success<object?>(null, "Xoá chi tiết sản phẩm thành công!");
        }
    }
}
