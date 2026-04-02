using AutoMapper;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.API.Services.Interfaces;
using FashionShop.Core.Contracts.User.Requests;
using FashionShop.Core.Contracts.User.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Exceptions;

namespace FashionShop.API.Services.Implements
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        // --- READ METHODS --- //
        public async Task<IEnumerable<UserResponse>> GetUsersAsync()
        {
            var users = await _userRepository.GetUsersAsync();
            return _mapper.Map<IEnumerable<UserResponse>>(users);
        }

        public async Task<UserResponse> GetUserByEmailAsync(string email)
        {
            var user = await _userRepository.GetUserByEmailAsync(email);

            if (user == null) throw new KeyNotFoundException("Không tìm thấy người dùng");

            return _mapper.Map<UserResponse>(user);
        }

        // --- WRITE METHODS --- //
        public async Task<UserResponse> UpdateUserAsync(Guid userId, UpdateUserRequest request)
        {
            var existingUser = await _userRepository.GetUserByIdAsync(userId);

            if (existingUser == null) throw new KeyNotFoundException("Không tìm thấy người dùng");

            if (request.Email != existingUser.Email && await _userRepository.IsUserExistsAsync(request.Email))
            {
                throw new ConflictException("Email đã được sử dụng");
            }

            _mapper.Map(request, existingUser);
            existingUser.UpdatedDate = DateTime.UtcNow;
            var updatedUser = await _userRepository.UpdateUserAsync(existingUser);
            return _mapper.Map<UserResponse>(existingUser);
        }

        public async Task DeleteUserAsync(Guid userId)
        {
            var existingUser = await _userRepository.GetUserByIdAsync(userId);

            if (existingUser == null) throw new KeyNotFoundException("Không tìm thấy người dùng");

            await _userRepository.DeleteUserAsync(existingUser);
        }
    }
}
