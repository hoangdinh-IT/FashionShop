using AutoMapper;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Repositories.Shop.Interfaces;
using FashionShop.API.Services.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.User.Requests;
using FashionShop.Core.Contracts.Shop.User.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Exceptions;
using System.Security.Claims;

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

        public async Task<IEnumerable<ShopUserResponse>> GetUsersAsync()
        {
            var users = await _unitOfWork.ShopUsers.GetUsersAsync();
            return _mapper.Map<IEnumerable<ShopUserResponse>>(users);
        }

        public async Task<ShopUserResponse?> GetUserByEmailAsync(string email)
        {
            var user = await _unitOfWork.ShopUsers.GetUserByEmailAsync(email);

            if (user == null) throw new KeyNotFoundException("Không tìm thấy người dùng");

            return _mapper.Map<ShopUserResponse>(user);
        }

        public async Task<ShopUserResponse?> GetMyProfileAsync(Guid userId)
        {
            var user = await _unitOfWork.ShopUsers.GetUserByIdAsync(userId);
            if (user == null) throw new KeyNotFoundException("Không tìm thấy thông tin người dùng.");

            return _mapper.Map<ShopUserResponse>(user);
        }



        // --- WRITE METHODS --- //

        public async Task<ShopUserResponse> UpdateUserAsync(Guid userId, ShopUpdateUserRequest request)
        {

            var user = await _unitOfWork.ShopUsers.GetUserByIdAsync(userId);
            if (user == null) throw new KeyNotFoundException("Không tìm thấy người dùng");

            _mapper.Map(request, user);
            user.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<ShopUserResponse>(user);
        }

        public async Task ChangePasswordAsync(ChangePasswordRequest request)
        {
            if (request.NewPassword != request.ConfirmNewPassword)
                throw new ArgumentException("Xác nhận mật khẩu mới không khớp!");

            var user = await _unitOfWork.ShopUsers.GetUserByEmailAsync(request.Email);
            if (user == null) throw new KeyNotFoundException("Không tìm thấy người dùng");

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.OldPassword, user.Password))
            {
                throw new UnauthorizedAccessException("Thông tin đăng nhập không chính xác.");
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteUserAsync(Guid userId)
        {
            var existingUser = await _unitOfWork.ShopUsers.GetUserByIdAsync(userId);

            if (existingUser == null) throw new KeyNotFoundException("Không tìm thấy người dùng");

            _unitOfWork.ShopUsers.DeleteUser(existingUser);

            await _unitOfWork.SaveChangesAsync();
        }
    }
}
