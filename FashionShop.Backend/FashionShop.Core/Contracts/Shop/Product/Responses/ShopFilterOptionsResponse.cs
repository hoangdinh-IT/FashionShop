using FashionShop.Core.Contracts.Shop.Color.Responses;
using FashionShop.Core.Contracts.Shop.Size.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.Product.Responses
{
    public class ShopFilterOptionsResponse
    {
        public List<ShopColorResponse> AvailableColors { get; set; }
        public List<ShopSizeResponse> AvailableSizes { get; set; }
    }
}
