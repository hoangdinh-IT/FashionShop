using FashionShop.API.Extensions;
using FashionShop.API.Services.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.User.Requests;
using FashionShop.Core.Exceptions;
using FashionShop.Core.Models;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Controllers.Shop
{
    [Route("api/shop/users")]
    public class ShopUsersController : BaseApiControllers
    {
        private readonly IShopUserService _userService;

        public ShopUsersController(IShopUserService userService)
        {
            _userService = userService;
        }



        // --- READ METHODS --- //

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userService.GetUsersAsync();
            return Success(users, "Lấy danh sách người dùng thành công");
        }

        [HttpGet("email")]
        public async Task<IActionResult> GetUserByEmail([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                throw new ArgumentException("Email không được để trống");
            }

            var user = await _userService.GetUserByEmailAsync(email);
            return Success(user, "Lấy thông tin người dùng thành công!");
        }



        // --- WRITE METHODS --- //

        [HttpPut]
        public async Task<IActionResult> UpdateUser(UpdateUserRequest request)
        {
            Guid userId = User.GetUserId();

            if (userId == Guid.Empty) throw new ArgumentException("ID không hợp lệ!");

            var result = await _userService.UpdateUserAsync(userId, request);
            return Success(result, "Cập nhật thông tin người dùng thành công");
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteUser()
        {
            Guid userId = User.GetUserId();

            await _userService.DeleteUserAsync(userId);
            return Success<object?>(null, "Xoá người dùng thành công");
        }
    }
}
