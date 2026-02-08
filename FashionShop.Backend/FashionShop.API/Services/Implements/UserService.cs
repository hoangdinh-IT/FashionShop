using AutoMapper;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.API.Services.Interfaces;
using FashionShop.Core.DTOs.User;
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

        public async Task<IEnumerable<UserDTO>> GetUsersAsync()
        {
            var users = await _userRepository.GetUsersAsync();
            return _mapper.Map<IEnumerable<UserDTO>>(users);
        }

        public async Task<UserDTO> GetUserByEmailAsync(string email)
        {
            var user = await _userRepository.GetUserByEmailAsync(email);

            if (user == null)
            {
                throw new KeyNotFoundException("Không tìm thấy người dùng");
            }

            return _mapper.Map<UserDTO>(user);
        }

        public async Task<UserDTO> UpdateUserAsync(Guid userId, UpdateUserDTO dto)
        {
            var existingUser = await _userRepository.GetUserByIdAsync(userId);

            if (existingUser == null)
            {
                throw new KeyNotFoundException("Không tìm thấy người dùng");
            }

            if (dto.Email != existingUser.Email && await _userRepository.IsUserExistsAsync(dto.Email))
            {
                throw new ConflictException("Email đã được sử dụng");
            }

            _mapper.Map(dto, existingUser);
            existingUser.UpdatedDate = DateTime.UtcNow;
            var updatedUser = await _userRepository.UpdateUserAsync(existingUser);
            return _mapper.Map<UserDTO>(existingUser);
        }

        public async Task DeleteUserAsync(Guid userId)
        {
            var existingUser = await _userRepository.GetUserByIdAsync(userId);

            if (existingUser == null)
            {
                throw new KeyNotFoundException("Không tìm thấy người dùng");
            }

            await _userRepository.DeleteUserAsync(existingUser);
        }
    }
}
