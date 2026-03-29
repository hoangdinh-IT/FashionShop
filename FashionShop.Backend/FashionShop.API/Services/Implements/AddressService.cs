using AutoMapper;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.API.Services.Interfaces;
using FashionShop.Core.Contracts.Address.Requests;
using FashionShop.Core.Contracts.Address.Responses;
using FashionShop.Core.Entities;

namespace FashionShop.API.Services.Implements
{
    public class AddressService : IAddressService
    {
        private readonly IAddressRepository _addressRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public AddressService(IAddressRepository addressRepository, IUserRepository userRepository, IMapper mapper)
        {
            _addressRepository = addressRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        // --- READ METHODS --- //
        public async Task<IEnumerable<AddressResponse>> GetAddressesByUserIdAsync(Guid userId)
        {
            var addresses = await _addressRepository.GetAddressesByUserIdAsync(userId);

            return _mapper.Map<IEnumerable<AddressResponse>>(addresses);
        }

        // --- WRITE METHODS --- //
        public async Task<AddressResponse> CreateAddressAsync(CreateAddressRequest dto)
        {
            if (await _userRepository.GetUserByIdAsync(dto.UserId) == null)
            {
                throw new KeyNotFoundException("Không tìm thấy người dùng!");
            }

            var newAddress = _mapper.Map<Address>(dto);
            newAddress.Id = Guid.NewGuid();

            var addressCount = await _addressRepository.CountAddressesByUserIdAsync(dto.UserId);

            if (addressCount == 0) newAddress.IsDefault = true;
            else
            {
                if (newAddress.IsDefault)
                {
                    await _addressRepository.UnsetDefaultAddressAsync(dto.UserId);
                }
            }

            var createdAddress = await _addressRepository.CreateAddressAsync(newAddress);
            
            return _mapper.Map<AddressResponse>(createdAddress);
        }


        public async Task<AddressResponse?> UpdateAddressByUserIdAsync(Guid userId, Guid addressId, UpdateAddressRequest dto)
        {
            var existingAddress = await _addressRepository.GetAddressByUserIdAsync(userId, addressId);

            if (existingAddress == null) throw new KeyNotFoundException("Không tìm thấy dữ liệu!");

            if (!existingAddress.IsDefault && dto.IsDefault)
            {
                await _addressRepository.UnsetDefaultAddressAsync(userId);
            }
            else if (existingAddress.IsDefault && !dto.IsDefault)
            {
                dto.IsDefault = true;
            }

            _mapper.Map(dto, existingAddress);
            existingAddress.UpdatedDate = DateTime.UtcNow;
            var updatedAddress = await _addressRepository.UpdateAddressByUserIdAsync(existingAddress);
            return _mapper.Map<AddressResponse>(updatedAddress);
        }

        public async Task DeleteAddressAsync(Guid userId, Guid addressId)
        {
            var existingAddress = await _addressRepository.GetAddressByUserIdAsync(userId, addressId);

            if (existingAddress == null) throw new KeyNotFoundException("Không tìm thấy dữ liệu!");

            if (existingAddress.IsDefault && await _addressRepository.CountAddressesByUserIdAsync(userId) >= 2)
            {
                var newestAddress = await _addressRepository.GetNewestAddressByUserIdAsync(userId, addressId);

                if (newestAddress != null)
                {
                    existingAddress.IsDefault = false;
                    newestAddress.IsDefault = true;
                    await _addressRepository.UpdateAddressByUserIdAsync(newestAddress);
                }
            }
            
            await _addressRepository.DeleteAddressAsync(existingAddress);    
        }
    }
}
