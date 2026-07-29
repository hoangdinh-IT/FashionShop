using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.Voucher.Responses
{
    public class ShopVoucherUsageResponse
    {
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public Guid VoucherId { get; set; }
        public Guid OrderId { get; set; }
        public DateTime UsedDate { get; set; }
    }
}
