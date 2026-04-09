using AutoMapper;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Services.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Brand.Responses;
using FashionShop.Core.Contracts.Shop.Category.Responses;

namespace FashionShop.API.Services.Shop
{
    public class ShopBrandService : IShopBrandService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ShopBrandService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }



        // --- READ METHODS --- //

        public async Task<IEnumerable<ShopBrandResponse>> GetAllBrandsAsync()
            => await _unitOfWork.ShopBrands.GetAllBrandsAsync();

        public async Task<IEnumerable<ShopCategoryResponse>> GetCategoriesByBrandAsync(Guid brandId)
            => await _unitOfWork.ShopBrands.GetCategoriesByBrandAsync(brandId);



        // --- WRITE METHODS --- //
    }
}
