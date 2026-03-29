using AutoMapper;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.API.Services.Interfaces;
using FashionShop.Core.Contracts.Auth;
using FashionShop.Core.Contracts.User;
using FashionShop.Core.Entities;
using FashionShop.Core.Enums;
using FashionShop.Core.Exceptions;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FashionShop.API.Services.Implements
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public AuthService(IUserRepository userRepository, IMapper mapper, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _configuration = configuration;
        }

        public async Task<UserDTO?> CreateUserAsync(RegisterDTO dto)
        {
            if (await _userRepository.IsUserExistsAsync(dto.Email))
            {
                throw new ConflictException("Email đã được đăng ký!");
            }

            var newUser = _mapper.Map<User>(dto);
            newUser.Id = Guid.NewGuid();
            newUser.Role = RoleUser.Customer;
            newUser.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var createdUser = await _userRepository.CreateUserAsync(newUser);

            if (createdUser == null)
            {
                throw new Exception("Đăng ký tài khoản thất bại!");
            }

            return _mapper.Map<UserDTO>(createdUser);
        }

        public async Task<UserDTO?> LoginUserAsync(LoginDTO dto)
        {
            var user = await _userRepository.GetUserByEmailAsync(dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
            {
                throw new UnauthorizedAccessException("Thông tin đăng nhập không chính xác.");
            }

            var userDTO = _mapper.Map<UserDTO>(user);
            userDTO.Token = GenerateJwtToken(user);
            return userDTO;
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]);

            // Tạo danh sách thông tin lưu trong Token (Claims)
            var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
        };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(1), // Token hết hạn sau 1 ngày
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token); // Trả về chuỗi Token
        }
    }
}
