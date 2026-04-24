using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.Product.Responses
{
    public class ShopProductColorDto
    {
        public int ColorId { get; set; }
        public string ColorName { get; set; }
        public string ColorHexCode { get; set; }
        public string ImageUrl { get; set; }
    }
}
