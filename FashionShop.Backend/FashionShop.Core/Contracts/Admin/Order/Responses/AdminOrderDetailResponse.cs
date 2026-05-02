using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Admin.Order.Responses
{
    public class AdminOrderDetailResponse
    {
        public int Id { get; set; }
        public Guid ProductVariantId { get; set; }

        // Thông tin sản phẩm bổ sung để FE hiển thị (Lấy từ bảng Product/Variant)
        public string ProductName { get; set; }
        public string VariantName { get; set; } // Ví dụ: "Màu Đỏ, Size L"
        public string? ImageUrl { get; set; }

        // Giá tại thời điểm mua
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal TotalLine { get; set; }

        // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
        public bool IsReviewed { get; set; }
    }
}
