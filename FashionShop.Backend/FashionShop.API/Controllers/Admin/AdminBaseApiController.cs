using FashionShop.Core.Enums;
using FashionShop.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/[controller]")]
    [Authorize(Roles = nameof(RoleUser.Admin))]
    public class AdminBaseApiControllers : ControllerBase
    {
        protected IActionResult Success<T>(T data, string message = "Success", int statusCode = 200)
        {
            return StatusCode(statusCode, ApiResponse<T>.Success(statusCode, message, data));
        }

        protected IActionResult Created<T>(T data, string message = "Created successfully")
        {
            return StatusCode(201, ApiResponse<T>.Success(201, message, data));
        }

        // Nhiều errors
        protected IActionResult Error(int statusCode, string message, List<string> errors)
        {
            return StatusCode(statusCode, ApiResponse<object>.Fail(statusCode, message, errors));
        }

        // 1 error
        protected IActionResult Error(int statusCode, string message, string error)
        {
            return StatusCode(statusCode, ApiResponse<object>.Fail(statusCode, message, new List<String> { error }));
        }

        // 0 error
        protected IActionResult Error(int statusCode, string message)
        {
            return StatusCode(statusCode, ApiResponse<object>.Fail(statusCode, message, new List<String> { message }));
        }
    }
}
