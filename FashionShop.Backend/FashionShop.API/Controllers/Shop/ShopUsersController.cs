using FashionShop.API.Extensions;
using FashionShop.API.Services.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.User.Requests;
using FashionShop.Core.Exceptions;
using FashionShop.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMyProfile()
        {
            try
            {
                var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userIdStr))
                {
                    return Unauthorized(new { message = "Token không hợp lệ hoặc thiếu thông tin định danh." });
                }

                var profile = await _userService.GetMyProfileAsync(userIdStr);

                return Success(profile, "Lấy thông tin tài khoản người dùng thành công!");
            }
            catch (ArgumentException ex)
            {
                // Bắt lỗi Guid không hợp lệ từ Service -> Trả về HTTP 400 (Bad Request)
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                // Bắt lỗi không tìm thấy User trong DB -> Trả về HTTP 404 (Not Found)
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                // Bắt các lỗi hệ thống không lường trước được -> Trả về HTTP 500 (Internal Server Error)
                // Lưu ý: Ở dự án thực tế, bạn nên dùng ILogger để ghi log lỗi 'ex' ở đây
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi hệ thống." });
            }
        }



        // --- WRITE METHODS --- //

        [HttpPut]
        public async Task<IActionResult> UpdateUser(ShopUpdateUserRequest request)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdStr))
            {
                return Unauthorized(new { message = "Token không hợp lệ hoặc thiếu thông tin định danh." });
            }

            var result = await _userService.UpdateUserAsync(userIdStr, request);
            return Success(result, "Cập nhật thông tin người dùng thành công");
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
        {
            await _userService.ChangePasswordAsync(request);
            return Success<object?>(null, "Thay đổi mật khẩu thành công!");
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
