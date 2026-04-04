using FashionShop.Core.Contracts.Shop.User.Requests;
using FashionShop.Core.Contracts.Shop.User.Responses;
using Microsoft.AspNetCore.Identity.Data;

namespace FashionShop.API.Services.Shop.Interfaces
{
    public interface IShopUserService
    {

        // --- READ METHODS --- //

        Task<IEnumerable<UserResponse>> GetUsersAsync();
        Task<UserResponse> GetUserByEmailAsync(string email);



        // --- WRITE METHODS --- //

        Task<UserResponse> UpdateUserAsync(Guid userId, UpdateUserRequest dto);
        Task DeleteUserAsync(Guid userId);
    }
}
