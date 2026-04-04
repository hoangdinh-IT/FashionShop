using FashionShop.Core.Contracts.Shared.Auth;
using FashionShop.Core.Contracts.Shop.User.Responses;
using Microsoft.AspNetCore.Identity.Data;

namespace FashionShop.API.Services.Shared.Interfaces
{
    public interface IAuthService
    {
        Task<UserResponse?> CreateUserAsync(AppRegisterRequest dto);
        Task<UserResponse?> LoginUserAsync(AppLoginRequest dto);
        Task<UserResponse> RefreshTokenAsync(RefreshTokenRequest request);
        Task ForgotPasswordAsync(AppForgotPasswordRequest request);
        Task ResetPasswordAsync(AppResetPasswordRequest request);
    }
}
