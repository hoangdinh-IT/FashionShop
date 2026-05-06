using FashionShop.API.Services.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Product.Requests;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Controllers.Shop
{
    [Route("api/shop/products")]
    public class ShopProductsController : ShopBaseApiController
    {
        private readonly IShopProductService _productService;

        public ShopProductsController(IShopProductService productService)
        {
            _productService = productService;
        }



        // --- READ METHODS --- //

        [HttpGet]
        public async Task<IActionResult> GetPagedProducts([FromQuery] ShopProductListRequest request)
        {
            var result = await _productService.GetPagedProductsAsync(request);
            return Success(result, "Lấy danh sách sản phẩm thành công!");
        }

        [HttpGet("collection")]
        public async Task<IActionResult> GetCollectionProducts([FromQuery] ShopCollectionProductListRequest request)
        {
            var result = await _productService.GetCollectionProductsAsync(request);
            return Success(result, "Lấy danh sách sản phẩm thành công!");
        }

        [HttpGet("{productSlug}")]
        public async Task<IActionResult> GetProductById(string productSlug)
        {
            var result = await _productService.GetProductBySlugAsync(productSlug);
            return Success(result, "Lấy chi tiết sản phẩm thành công!");
        }

        [HttpGet("filter-options")]
        public async Task<IActionResult> GetFilterOptions([FromQuery] ShopFilterOptionsRequest request)
        {
            var result = await _productService.GetFilterOptionsAsync(request);
            return Success(result, "Lấy các lựa chọn lọc thành công!");
        }
    }
}
