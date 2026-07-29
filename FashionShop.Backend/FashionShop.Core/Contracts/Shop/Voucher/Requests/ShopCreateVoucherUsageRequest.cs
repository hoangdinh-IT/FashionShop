using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.Voucher.Requests
{
    public class ShopCreateVoucherUsageRequest
    {
        [Required(ErrorMessage = "Mã voucher (VoucherId) là bắt buộc.")]
        public Guid VoucherId { get; set; }

        [Required(ErrorMessage = "Mã đơn hàng (OrderId) là bắt buộc.")]
        public Guid OrderId { get; set; }

        [Required(ErrorMessage = "Thời gian sử dụng (UsedDate) là bắt buộc.")]
        [DataType(DataType.DateTime)]
        public DateTime UsedDate { get; set; } = DateTime.UtcNow;
    }
}
