using FashionShop.API.Services;
using FashionShop.Core.Exceptions;
using FashionShop.Core.Contracts;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using FashionShop.API.Services.Shared.Interfaces;
using FashionShop.Core.Contracts.Shared.Auth.Requests;

namespace FashionShop.API.Controllers
{
    public class AuthController : BaseApiControllers
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AppRegisterRequest request)
        {
            var result = await _authService.CreateUserAsync(request);
            return Created(result, "Đăng ký tài khoản thành công!");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AppLoginRequest request)
        {
            var result = await _authService.LoginUserAsync(request);
            return Success(result, "Đăng nhập thành công!");
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            try
            {
                var result = await _authService.RefreshTokenAsync(request);

                // Trả về 200 OK nếu thành công (Giả sử Success là hàm custom trả về form chuẩn của bạn)
                return Success(result, "Làm mới Token thành công!");
            }
            catch (SecurityTokenException ex)
            {
                // Trả về 400 Bad Request thay vì 500
                return BadRequest(new { message = "Token không hợp lệ", error = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                // Trả về 401 Unauthorized thay vì 500
                return Unauthorized(new { message = "Phiên đăng nhập hết hạn", error = ex.Message });
            }
            catch (Exception ex)
            {
                // Chỉ trả về 500 khi thực sự là lỗi hệ thống không lường trước
                return StatusCode(500, new { message = "Lỗi hệ thống cục bộ", error = ex.Message });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] AppForgotPasswordRequest request)
        {
            await _authService.ForgotPasswordAsync(request);
            return Success<object?>(null, "Lấy mã OTP thành công!");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] AppResetPasswordRequest request)
        {
            await _authService.ResetPasswordAsync(request);
            return Success<object?>(null, "Cập nhật mật khẩu mới thành công!");
        }
    }
}
