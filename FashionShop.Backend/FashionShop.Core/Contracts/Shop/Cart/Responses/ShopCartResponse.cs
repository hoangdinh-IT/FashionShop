using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.Cart.Responses
{
    public class ShopCartResponse
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public List<ShopCartItemResponse> CartItems { get; set; }
    }
}
