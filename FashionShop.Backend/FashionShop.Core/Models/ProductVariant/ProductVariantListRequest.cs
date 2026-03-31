using FashionShop.Core.Models.Paging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Models.ProductVariant
{
    public class ProductVariantListRequest : PagingBase
    {
        public string? Keyword { get; set; }
        public Guid? ProductId { get; set; }
        public int? ColorId { get; set; }
        public int? SizeId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public bool? IsActive { get; set; }
    }
}
