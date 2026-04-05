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
        public Guid? CategoryId { get; set; }
        public Guid? BrandId { get; set; }
        public List<int>? ColorIds { get; set; }
        public List<int>? SizeIds { get; set; }
        public bool? IsBestSeller { get; set; }
        public bool? IsNew { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
    }
}
