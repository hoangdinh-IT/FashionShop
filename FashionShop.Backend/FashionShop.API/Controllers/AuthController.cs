using FashionShop.API.Services.Interfaces;
using FashionShop.Core.Contracts.Auth;
using FashionShop.Core.Exceptions;
using FashionShop.Core.Models;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<IActionResult> Register([FromBody] RegisterDTO request)
        {
            var result = await _authService.CreateUserAsync(request);
            return Created(result, "Đăng ký tài khoản thành công!");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO request)
        {
            var result = await _authService.LoginUserAsync(request);
            return Success(result, "Đăng nhập thành công!");
        }
    }
}
