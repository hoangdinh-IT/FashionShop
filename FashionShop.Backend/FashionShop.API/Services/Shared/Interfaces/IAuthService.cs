using FashionShop.Core.Contracts.Shared.Auth.Requests;
using FashionShop.Core.Contracts.Shared.Auth.Responses;
using FashionShop.Core.Contracts.Shop.User.Responses;

namespace FashionShop.API.Services.Shared.Interfaces
{
    public interface IAuthService
    {
        Task<ShopUserResponse?> CreateUserAsync(AppRegisterRequest dto);
        Task<AuthResponse?> LoginUserAsync(AppLoginRequest dto);
        Task<AuthResponse?> RefreshTokenAsync(RefreshTokenRequest request);
        Task ForgotPasswordAsync(AppForgotPasswordRequest request);
        Task ResetPasswordAsync(AppResetPasswordRequest request);
    }
}
