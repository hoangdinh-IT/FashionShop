using FashionShop.Core.Exceptions;
using FashionShop.Core.Models;
using System.Net;
using System.Text.Json;

namespace FashionShop.API.Middwares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // Cho request đi qua tiếp các tầng sau (Controller -> Service -> Repo)
                await _next(context);
            }
            catch (Exception ex)
            {
                // Nếu ở đâu đó bên trong quăng lỗi, nó sẽ rơi vào đây
                _logger.LogError(ex, ex.Message); // Ghi log lại để debug
                await HandleExceptionAsync(context, ex); // Xử lý trả về JSON cho client
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var statusCode = (int)HttpStatusCode.InternalServerError;
            var message = "Lỗi hệ thống";
            List<string> errors = new List<string>();

            // Phân loại lỗi để trả về Status Code phù hợp
            switch (exception)
            {
                case KeyNotFoundException:
                    statusCode = (int)HttpStatusCode.NotFound;  // 404
                    message = "Không tìm thấy dữ liệu";
                    errors.Add(exception.Message);
                    break;

                case ArgumentException: 
                case InvalidOperationException:
                    statusCode = (int)HttpStatusCode.BadRequest;  // 400
                    message = "Dữ liệu không hợp lệ";
                    errors.Add(exception.Message);
                    break;

                case ConflictException:
                    statusCode = (int)HttpStatusCode.Conflict;  // 409
                    message = "Dữ liệu bị xung đột";
                    errors.Add(exception.Message);
                    break;

                case UnauthorizedAccessException: // <-- Lỗi sai mật khẩu / chưa đăng nhập
                    statusCode = (int)HttpStatusCode.Unauthorized; // 401
                    message = exception.Message;
                    break;

                default: // Các lỗi lạ khác
                    message = exception.Message; // Hoặc ẩn đi nếu là Prod
                    break;
            }

            context.Response.StatusCode = statusCode;

            var response = ApiResponse<object>.Fail(statusCode, message, errors);

            var json = JsonSerializer.Serialize(response);
            await context.Response.WriteAsync(json);
        }
    }

    // Class dùng để định dạng response trả về (Tuỳ bạn định nghĩa)
    public class ErrorResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
    }
}
