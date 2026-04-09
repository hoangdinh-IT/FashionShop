using FashionShop.API.Services.Shop.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Controllers.Shop
{
    [Route("api/shop/categories")]
    public class ShopCategoriesController : ShopBaseApiController
    {
        private readonly IShopCategoryService _categoryService;

        public ShopCategoriesController(IShopCategoryService categoryService)
        {
            _categoryService = categoryService;
        }
    }
}