using FashionShop.Core.Contracts.User.Requests;
using FashionShop.Core.Contracts.User.Responses;

namespace FashionShop.API.Services.Interfaces
{
    public interface IUserService
    {
        // --- READ METHODS --- //
        Task<IEnumerable<UserResponse>> GetUsersAsync();
        Task<UserResponse> GetUserByEmailAsync(string email);

        // --- WRITE METHODS --- //
        Task<UserResponse> UpdateUserAsync(Guid userId, UpdateUserRequest dto);
        Task DeleteUserAsync(Guid userId);
    }
}
