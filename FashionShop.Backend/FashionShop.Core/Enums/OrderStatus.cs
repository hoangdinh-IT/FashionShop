using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Enums
{
    public enum OrderStatus : byte
    {
        Pending = 0,
        Confirmed = 1,
        Shipping = 2,
        Success = 3
    }
}
