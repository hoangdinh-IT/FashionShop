using FashionShop.Core.Enums;
using FashionShop.Core.Models.Paging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Models.Voucher
{
    public class VoucherListRequest : PagingBase
    {
        public string? Keyword { get; set; }
        public DiscountType? DiscountType { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string? Status { get; set; } // Upcoming - Ongoing - Expired
        public bool? IsAvailable { get; set; }
        public decimal? FromMinOrderValue { get; set; }
        public decimal? ToMinOrderValue { get; set; }
    }
}
