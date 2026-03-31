using FashionShop.Core.Models.Paging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Models.Color
{
    public class ColorListRequest : PagingBase
    {
        public string? Keyword { get; set; }
        public bool? IsActive { get; set; }
    }
}
