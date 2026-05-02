using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Enums
{
    public enum OrderStatus : byte
    {
        Pending = 0,    // Đang xử lí
        Confirmed = 1,  // Đã xác nhận
        Shipping = 2,   // Đang vận chuyển
        Success = 3,    // Giao hàng thành công
        Cancelled = 4,  // Đơn hàng bị huỷ
        Failed = 5,     // Giao hàng thất bại
        Returned = 6,   // Trả hàng
        Refunded = 7,   // Hoàn tiền
    }
}
