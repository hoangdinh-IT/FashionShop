using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Models
{
    public class ApiResponse<T>
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }
        public int StatusCode { get; set; }
        public List<string> Errors { get; set; }

        // Constructor mặc định
        public ApiResponse() { }

        // Constructor cho Success
        public ApiResponse(int statusCode, string message, T data)
        {
            Succeeded = true;
            StatusCode = statusCode;
            Message = message;
            Data = data;
            Errors = null;
        }

        // Constructor cho Fail
        public ApiResponse(int statusCode, string message, List<string> errors)
        {
            Succeeded = false;
            StatusCode = statusCode;
            Message = message;
            Data = default;
            Errors = errors;
        }

        public static ApiResponse<T> Success(int statusCode, string message, T data)
        {
            return new ApiResponse<T>(statusCode, message, data);
        }
        public static ApiResponse<T> Fail(int statusCode, string message, List<string> errors)
        {
            return new ApiResponse<T>(statusCode, message, errors);
        }
    }
}
