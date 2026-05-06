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
        public string? CategorySlug { get; set; }
        public string? BrandSlug { get; set; }
        public List<string>? SizeSlugs { get; set; }
        public string? ColorSlug { get; set; }
        public bool? IsBestSeller { get; set; }
        public bool? IsNew { get; set; }
        public List<string>? PriceRange { get; set; }
    }
}
