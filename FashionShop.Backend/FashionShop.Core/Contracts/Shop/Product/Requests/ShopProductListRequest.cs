using FashionShop.Core.Contracts.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.Product.Requests
{
    public class ShopProductListRequest : PagingBase
    {
        public string? Keyword { get; set; }
        public string CategorySlug { get; set; }
        public string BrandSlug { get; set; }
        public int? ColorId { get; set; }
        public List<int>? SizeIds { get; set; }
        public bool? IsBestSeller { get; set; }
        public bool? IsNew { get; set; }
        public string? PriceRange { get; set; }
        public bool? IsAscendingPrice { get; set; }
    }
}
