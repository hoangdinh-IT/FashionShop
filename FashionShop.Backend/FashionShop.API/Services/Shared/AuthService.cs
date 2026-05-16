using AutoMapper;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Repositories.Shop.Interfaces;
using FashionShop.API.Services.Shared.Interfaces;
using FashionShop.Core.Common;
using FashionShop.Core.Contracts.Shared.Auth.Requests;
using FashionShop.Core.Contracts.Shared.Auth.Responses;
using FashionShop.Core.Contracts.Shop.User.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Enums;
using FashionShop.Core.Exceptions;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace FashionShop.API.Services.Shared
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthService(IUnitOfWork unitOfWork, IMapper mapper, IConfiguration configuration, IEmailService emailService )
        {
            _unitOfWork =unitOfWork;
            _mapper = mapper;
            _configuration = configuration;
            _emailService = emailService;
        }

        public async Task<ShopUserResponse?> CreateAsync(AppRegisterRequest request)
        {
            if (await _unitOfWork.ShopUsers.CheckUserExistAsync(request.Email))
            {
                throw new ConflictException("Email đã được đăng ký!");
            }

            var newUser = _mapper.Map<User>(request);
            newUser.Id = Guid.NewGuid();
            newUser.Role = RoleUser.Customer;
            newUser.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);

            _unitOfWork.ShopUsers.Create(newUser);

            if (newUser == null)
            {
                throw new Exception("Đăng ký tài khoản thất bại!");
            }

            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<ShopUserResponse>(newUser);
        }

        public async Task<AuthResponse?> LoginAsync(AppLoginRequest request)
        {
            var user = await _unitOfWork.ShopUsers.GetUserByEmailAsync(request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                throw new UnauthorizedAccessException("Thông tin đăng nhập không chính xác.");
            }

            var accessToken = GenerateAccessToken(user);
            user.RefreshToken = GenerateRefreshToken();

            if (user.Role == RoleUser.Admin)
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(3);
            else
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            
            var userResponse = _mapper.Map<ShopUserResponse>(user);

            await _unitOfWork.SaveChangesAsync();

            return new AuthResponse
            {
                User = userResponse,
                AccessToken = accessToken,
                RefreshToken = user.RefreshToken,
                RefreshTokenExpiryTime = user.RefreshTokenExpiryTime.Value,
            };
        }

        public async Task<AuthResponse?> GoogleLoginAsync(GoogleLoginRequest request)
        {
            try
            {
                // 1. Xác thực Token gửi từ Frontend với Google
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string>() { _configuration["Google:ClientId"] }
                };

                var payload = await GoogleJsonWebSignature.ValidateAsync(request.Token, settings);

                // 2. Tìm user trong Database theo Email từ Google trả về
                var user = await _unitOfWork.ShopUsers.GetUserByEmailAsync(payload.Email);

                if (user == null)
                {
                    user = new User
                    {
                        Id = Guid.NewGuid(),
                        Email = payload.Email,
                        Password = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()),
                        FullName = payload.Name,
                        Avatar = payload.Picture
                    };

                    _unitOfWork.ShopUsers.Create(user);
                }

                // 4. Tạo AccessToken và RefreshToken
                var accessToken = GenerateAccessToken(user);
                user.RefreshToken = GenerateRefreshToken();

                if (user.Role == RoleUser.Admin)
                    user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(3);
                else
                    user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

                var userResponse = _mapper.Map<ShopUserResponse>(user);

                await _unitOfWork.SaveChangesAsync();

                try
                {
                    string emailSubject = "[FashionShop] Thông báo đăng nhập hệ thống bằng tài khoản Google";
                    string emailBody = EmailTemplateHelper.GetGoogleLoginNotificationTemplate(user.FullName, user.Email);

                    // Nhờ EmailService đi giao (sử dụng toán tử await giống hệt forgot-password)
                    await _emailService.SendEmailAsync(user.Email, emailSubject, emailBody);
                }
                catch (Exception emailEx)
                {
                    // Log lỗi gửi mail ở đây nếu có hệ thống Logger (ví dụ: _logger.LogError)
                    // Lưu ý: Không ném (throw) lỗi ra ngoài ở đây để tránh làm gián đoạn luồng đăng nhập chính của khách hàng
                }

                return new AuthResponse
                {
                    User = userResponse,
                    AccessToken = accessToken,
                    RefreshToken = user.RefreshToken,
                    RefreshTokenExpiryTime = user.RefreshTokenExpiryTime.Value,
                };
            }
            catch (InvalidJwtException)
            {
                throw new UnauthorizedAccessException("Token Google không hợp lệ hoặc đã hết hạn.");
            }
            catch (Exception ex)
            {
                throw new Exception("Lỗi hệ thống khi đăng nhập Google: " + ex.Message);
            }
        }

        private string GenerateAccessToken(User user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]);

            var durationInMinutes = jwtSettings.GetValue("DurationInMinutes", 15);

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
                Expires = DateTime.UtcNow.AddMinutes(durationInMinutes), // AccessToken hết hạn sau 15 phút
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

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public async Task<AuthResponse?> RefreshTokenAsync(RefreshTokenRequest request)
        {
            // 1. Lấy thông tin User từ Access Token cũ (dù đã hết hạn)
            var principal = GetPrincipalFromExpiredToken(request.AccessToken);
            var userIdString = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
                throw new SecurityTokenException("Lỗi 1: Không tìm thấy UserId trong Token");

            // 2. Tìm User trong Database
            var user = await _unitOfWork.ShopUsers.GetUserByIdAsync(userId);

            // Kiểm tra xem user có tồn tại không, RefreshToken có khớp không, và có hết hạn không
            if (user == null ||
                user.RefreshToken != request.RefreshToken ||
                user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                // Bắn lỗi này ra, Controller sẽ bắt được và chuyển thành 401 Unauthorized
                throw new UnauthorizedAccessException("Refresh token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
            }

            // 3. Cấp bộ Token mới
            var newAccessToken = GenerateAccessToken(user);
            var newRefreshToken = GenerateRefreshToken();

            // 4. Lưu Refresh Token mới vào DB (Xoay vòng Token để bảo mật hơn)
            user.RefreshToken = newRefreshToken;

            // FIX LỖI LOGIC: Cập nhật hạn sử dụng cho cả Admin và Customer giống y hệt lúc Login
            if (user.Role == RoleUser.Admin)
            {
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(3);
            }
            else
            {
                // Mặc định Customer hoặc các role khác
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            }

            // 5. Trả về
            var response = _mapper.Map<AuthResponse>(user);
            response.AccessToken = newAccessToken;

            await _unitOfWork.SaveChangesAsync();

            return response;
        }

        // Hàm phụ trợ để giải mã Token cũ
        private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]);

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = true,
                ValidAudience = jwtSettings["Audience"],
                ValidateIssuer = true,
                ValidIssuer = jwtSettings["Issuer"],
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateLifetime = false // Quan trọng: Tắt kiểm tra hết hạn vì ta biết nó đã hết hạn rồi
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);

            if (!(securityToken is JwtSecurityToken jwtSecurityToken) || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Lỗi 2: Sai thuật toán mã hóa");

            return principal;
        }

        public async Task ForgotPasswordAsync(AppForgotPasswordRequest request)
        {
            var user = await _unitOfWork.ShopUsers.GetUserByEmailAsync(request.Email);

            if (user == null) throw new KeyNotFoundException("Không tìm thấy người dùng");

            string otp = GenerateOTP();

            user.Otp = otp;
            user.OtpExpiryTime = DateTime.UtcNow.AddMinutes(5);
            string emailSubject = "[FashionShop] Mã xác thực đặt lại mật khẩu";
            string emailBody = EmailTemplateHelper.GetResetPasswordTemplate(user.FullName, otp);

            // 2. Nhờ EmailService đi giao
            await _emailService.SendEmailAsync(user.Email, emailSubject, emailBody);

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task ResetPasswordAsync(AppResetPasswordRequest request)
        {
            if (request.NewPassword != request.ConfirmNewPassword)
                throw new ArgumentException("Mật khẩu mới và xác nhận mật khẩu mới không khớp!");

            var user = await _unitOfWork.ShopUsers.GetUserByEmailAsync(request.Email);

            if (user == null) throw new KeyNotFoundException("Không tìm thấy người dùng");

            if (user.Otp != request.Otp) throw new ArgumentException("Mã OTP không chính xác.");

            if (user.OtpExpiryTime < DateTime.UtcNow) throw new ArgumentException("Mã OTP đã hết hạn (hiệu lực 5 phút).");

            user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.Otp = null;
            user.OtpExpiryTime = null;

            await _unitOfWork.SaveChangesAsync();
        }

        private string GenerateOTP()
        {
            int otpValue = RandomNumberGenerator.GetInt32(0, 1000000);

            return otpValue.ToString("D6");
        }
    }
}
