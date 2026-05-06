using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.Product.Requests
{
    public class ShopCollectionProductListRequest
    {
        public bool? IsBestSeller { get; set; }
        public bool? IsNew { get; set; }
    }
}
