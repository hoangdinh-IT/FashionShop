using FashionShop.Core.Contracts.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Admin.Brand.Requests
{
    public class AdminBrandListRequest : PagingBase
    {
        public string? Keyword { get; set; }
        public bool? IsActive { get; set; }
    }
}
