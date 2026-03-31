using FashionShop.Core.Enums;
using FashionShop.Core.Models.Paging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Models.Size
{
    public class SizeListRequest : PagingBase
    {
        public string? Keyword { get; set; }
        public SizeType? Type { get; set; }
        public bool? IsActive { get; set; }
    }
}
