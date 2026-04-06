using FashionShop.API.Services.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Product.Requests;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Controllers.Shop
{
    [Route("api/shop/products")]
    public class ShopProductController : ShopBaseApiController
    {
        private readonly IShopProductService _productService;

        public ShopProductController(IShopProductService productService)
        {
            _productService = productService;
        }



        // --- READ METHODS --- //

        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery] ShopProductListRequest request)
        {
            var result = await _productService.GetPagedProductsAsync(request);
            return Success(result, "Lấy danh sách sản phẩm thành công!");
        }

        [HttpGet("{productId}")]
        public async Task<IActionResult> GetProductById(Guid productId)
        {
            var result = await _productService.GetProductByIdAsync(productId);
            return Success(result, "Lấy chi tiết sản phẩm thành công!");
        }
    }
}
