using AutoMapper;
using FashionShop.API.Repositories.Admin.Interfaces;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Services.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Product.Requests;
using FashionShop.Core.Contracts.Shop.Product.Responses;
using FashionShop.Core.Models;

namespace FashionShop.API.Services.Shop
{
    public class ShopProductService : IShopProductService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ShopProductService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }



        // --- READ METHODS --- //

        public async Task<PagedResult<ProductGridItemResponse>> GetPagedProductsAsync(ShopProductListRequest request)
            => await _unitOfWork.ShopProducts.GetPagedProductsAsync(request);

        public async Task<ShopProductDetailResponse?> GetProductBySlugAsync(string productSlug)
            => await _unitOfWork.ShopProducts.GetProductBySlugAsync(productSlug);

        public async Task<ShopFilterOptionsResponse?> GetFilterOptionsAsync(ShopFilterOptionsRequest request)
            => await _unitOfWork.ShopProducts.GetFilterOptionsAsync(request);

        // --- WRITE METHODS --- //
    }
}
