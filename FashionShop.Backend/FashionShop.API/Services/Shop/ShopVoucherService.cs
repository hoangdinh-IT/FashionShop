using AutoMapper;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Services.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Voucher.Requests;
using FashionShop.Core.Contracts.Shop.Voucher.Responses;
using FashionShop.Core.Entities;

namespace FashionShop.API.Services.Shop
{
    public class ShopVoucherService : IShopVoucherService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ShopVoucherService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }



        // --- READ METHODS --- //

        public async Task<IEnumerable<ShopVoucherResponse>> GetVouchersAsync(Guid userId)
        {
            return await _unitOfWork.ShopVouchers.GetVouchersAsync(userId);
        }
    }
}
