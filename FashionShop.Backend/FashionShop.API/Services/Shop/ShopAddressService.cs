using AutoMapper;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Repositories.Shop.Interfaces;
using FashionShop.API.Services.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Address.Requests;
using FashionShop.Core.Contracts.Shop.Address.Responses;
using FashionShop.Core.Entities;

namespace FashionShop.API.Services.Shop
{
    public class ShopAddressService : IShopAddressService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ShopAddressService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }



        // --- READ METHODS --- //

        public async Task<IEnumerable<ShopAddressResponse>> GetAddressesByUserIdAsync(Guid userId)
        {
            var addresses = await _unitOfWork.ShopAddresses.GetAddressesByUserIdAsync(userId);

            return _mapper.Map<IEnumerable<ShopAddressResponse>>(addresses);
        }



        // --- WRITE METHODS --- //

        public async Task<ShopAddressResponse> CreateAddressAsync(Guid userId, ShopCreateAddressRequest request)
        {
            if (await _unitOfWork.ShopUsers.GetUserByIdAsync(userId) == null)
            {
                throw new KeyNotFoundException("Không tìm thấy người dùng!");
            }

            var newAddress = _mapper.Map<Address>(request);
            newAddress.Id = Guid.NewGuid();
            newAddress.UserId = userId;

            var addressCount = await _unitOfWork.ShopAddresses.CountAddressesByUserIdAsync(userId);

            if (addressCount == 0) newAddress.IsDefault = true;
            else
            {
                if (request.IsDefault)
                {
                    await _unitOfWork.ShopAddresses.UnsetDefaultAddressAsync(userId);
                }
            }

            _unitOfWork.ShopAddresses.CreateAddress(newAddress);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<ShopAddressResponse>(newAddress);
        }

        public async Task<ShopAddressResponse?> UpdateAddressByUserIdAsync(Guid userId, Guid addressId, ShopUpdateAddressRequest request)
        {
            var existingAddress = await _unitOfWork.ShopAddresses.GetAddressByUserIdAsync(userId, addressId);

            if (existingAddress == null) throw new KeyNotFoundException("Không tìm thấy dữ liệu!");

            if (!existingAddress.IsDefault && request.IsDefault)
            {
                await _unitOfWork.ShopAddresses.UnsetDefaultAddressAsync(userId);
            }
            else if (existingAddress.IsDefault && !request.IsDefault)
            {
                request.IsDefault = true;
            }

            _mapper.Map(request, existingAddress);
            existingAddress.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<ShopAddressResponse>(existingAddress);
        }

        public async Task<ShopAddressResponse?> UpdateAddressDefaultAsync(Guid userId, Guid addressId)
        {
            var existingAddress = await _unitOfWork.ShopAddresses.GetAddressByUserIdAsync(userId, addressId);

            if (existingAddress == null) throw new KeyNotFoundException("Không tìm thấy dữ liệu!");

            existingAddress.IsDefault = true;
            await _unitOfWork.ShopAddresses.UnsetDefaultAddressAsync(userId);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<ShopAddressResponse>(existingAddress);
        }

        public async Task DeleteAddressAsync(Guid userId, Guid addressId)
        {
            var existingAddress = await _unitOfWork.ShopAddresses.GetAddressByUserIdAsync(userId, addressId);

            if (existingAddress == null) throw new KeyNotFoundException("Không tìm thấy dữ liệu!");

            if (existingAddress.IsDefault && await _unitOfWork.ShopAddresses.CountAddressesByUserIdAsync(userId) >= 2)
            {
                var newestAddress = await _unitOfWork.ShopAddresses.GetNewestAddressByUserIdAsync(userId, addressId);

                if (newestAddress != null)
                {
                    existingAddress.IsDefault = false;
                    newestAddress.IsDefault = true;
                }
            }
            
            _unitOfWork.ShopAddresses.DeleteAddress(existingAddress);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
