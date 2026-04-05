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
        //    [HttpGet]
        //    public async Task<IActionResult> GetProducts(ShopProductListRequest request)
        //    {

        //    }
    }
}
