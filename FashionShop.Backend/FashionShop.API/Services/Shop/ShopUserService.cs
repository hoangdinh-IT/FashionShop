using AutoMapper;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Repositories.Shop.Interfaces;
using FashionShop.API.Services.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.User.Requests;
using FashionShop.Core.Contracts.Shop.User.Responses;
using FashionShop.Core.Exceptions;

namespace FashionShop.API.Services.Shop
{
    public class ShopUserService : IShopUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ShopUserService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }



        // --- READ METHODS --- //

        public async Task<IEnumerable<UserResponse>> GetUsersAsync()
        {
            var users = await _unitOfWork.ShopUsers.GetUsersAsync();
            return _mapper.Map<IEnumerable<UserResponse>>(users);
        }

        public async Task<UserResponse> GetUserByEmailAsync(string email)
        {
            var user = await _unitOfWork.ShopUsers.GetUserByEmailAsync(email);

            if (user == null) throw new KeyNotFoundException("Không tìm thấy người dùng");

            return _mapper.Map<UserResponse>(user);
        }



        // --- WRITE METHODS --- //

        public async Task<UserResponse> UpdateUserAsync(Guid userId, UpdateUserRequest request)
        {
            var existingUser = await _unitOfWork.ShopUsers.GetUserByIdAsync(userId);

            if (existingUser == null) throw new KeyNotFoundException("Không tìm thấy người dùng");

            if (request.Email != existingUser.Email && await _unitOfWork.ShopUsers.IsUserExistsAsync(request.Email))
            {
                throw new ConflictException("Email đã được sử dụng");
            }

            _mapper.Map(request, existingUser);
            existingUser.UpdatedDate = DateTime.UtcNow;
            var updatedUser = await _unitOfWork.ShopUsers.UpdateUserAsync(existingUser);
            return _mapper.Map<UserResponse>(existingUser);
        }

        public async Task DeleteUserAsync(Guid userId)
        {
            var existingUser = await _unitOfWork.ShopUsers.GetUserByIdAsync(userId);

            if (existingUser == null) throw new KeyNotFoundException("Không tìm thấy người dùng");

            await _unitOfWork.ShopUsers.DeleteUserAsync(existingUser);
        }
    }
}
