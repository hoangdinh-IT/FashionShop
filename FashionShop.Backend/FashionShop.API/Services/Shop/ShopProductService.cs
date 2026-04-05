using AutoMapper;
using FashionShop.API.Repositories.Admin.Interfaces;
using FashionShop.API.Services.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Product.Requests;
using FashionShop.Core.Contracts.Shop.Product.Responses;

namespace FashionShop.API.Services.Shop
{
    public class ShopProductService : IShopProductService
    {
        private readonly IAdminProductRepository _productRepository;
        private readonly IMapper _mapper;

        public ShopProductService(IAdminProductRepository productRepository, IMapper mapper)
        {
            _productRepository = productRepository;
            _mapper = mapper;
        }



        // --- READ METHODS --- //

        //public async Task<IEnumerable<ShopProductResponse>> GetProductsAsync(ShopProductListRequest request)
        //{

        //}



        // --- WRITE METHODS --- //
    }
}
