using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.Product.Requests
{
    public class ShopFilterOptionsRequest
    {
        public string? BrandSlug { get; set; }
        public string? CategorySlug { get; set; }
    }
}
