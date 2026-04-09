using FashionShop.API.Services.Shop.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Controllers.Shop
{
    [Route("api/shop/brands")]
    public class ShopBrandsController : ShopBaseApiController
    {
        private readonly IShopBrandService _brandService;

        public ShopBrandsController(IShopBrandService brandService)
        {
            _brandService = brandService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBrands()
        {
            var result = await _brandService.GetAllBrandsAsync();
            return Success(result, "lấy danh sách thương hiệu thành công!");
        }

        [HttpGet("{brandId}/categories")]
        public async Task<IActionResult> GetCategoriesByBrand(Guid brandId)
        {
            var result = await _brandService.GetCategoriesByBrandAsync(brandId);
            return Success(result, "Lấy danh sách danh mục thành công!");
        }
    }
}
