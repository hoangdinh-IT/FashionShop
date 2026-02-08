using FashionShop.Core.Models.Paging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Models.Products
{
    public class ProductListRequest : PagingBase
    {
        public string? Keyword { get; set; }
        public Guid? CategoryId { get; set; }
        public Guid? BrandId { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsBestSeller { get; set; }
        public bool? IsNew { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
    }
}
