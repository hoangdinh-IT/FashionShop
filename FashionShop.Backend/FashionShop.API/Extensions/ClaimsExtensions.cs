using System.Security.Claims;

namespace FashionShop.API.Extensions
{
    public static class ClaimsExtensions
    {
        public static Guid GetUserId(this ClaimsPrincipal user)
        {
            // Tìm claim chứa ID (thường là NameIdentifier hoặc 'sub')
            // Khi cấu hình JWT, bạn thường gán: new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            var idClaim = user.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null)
            {
                // Nếu không tìm thấy (do chưa đăng nhập hoặc token sai format)
                throw new UnauthorizedAccessException("Token không hợp lệ hoặc thiếu thông tin User ID.");
            }

            return Guid.Parse(idClaim.Value);
        }
    }
}
