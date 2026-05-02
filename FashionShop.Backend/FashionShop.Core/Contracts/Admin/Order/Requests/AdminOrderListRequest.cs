using FashionShop.Core.Contracts.Shared;
using FashionShop.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Admin.Order.Requests
{
    public class AdminOrderListRequest : PagingBase
    {
        public string? Keyword { get; set; }
        public OrderStatus? OrderStatus { get; set; }
        public PaymentMethod? PaymentMethod { get; set; }
        public PaymentStatus? PaymentStatus { get; set; }
        public DateTime? FromOrderDate { get; set; }
        public DateTime? ToOrderDate { get; set; }
    }
}
