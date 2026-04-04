using AutoMapper;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.API.Services.Shop.Interfaces;

namespace FashionShop.API.Services.Shop
{
    public class ShopProductService : IShopProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        public ShopProductService(IProductRepository productRepository, IMapper mapper)
        {
            _productRepository = productRepository;
            _mapper = mapper;
        }
    }
}
