using FashionShop.Core.Contracts.Shop.User.Requests;
using FashionShop.Core.Contracts.Shop.User.Responses;
using Microsoft.AspNetCore.Identity.Data;

namespace FashionShop.API.Services.Shop.Interfaces
{
    public interface IShopUserService
    {

        // --- READ METHODS --- //

        Task<IEnumerable<ShopUserResponse>> GetUsersAsync();
        Task<ShopUserResponse?> GetUserByEmailAsync(string email);
        Task<ShopUserResponse?> GetMyProfileAsync(string userIdStr);



        // --- WRITE METHODS --- //

        Task<ShopUserResponse> UpdateUserAsync(string userIdStr, ShopUpdateUserRequest dto);
        Task ChangePasswordAsync(ChangePasswordRequest request);
        Task DeleteUserAsync(Guid userId);
    }
}
