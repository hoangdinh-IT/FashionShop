using FashionShop.Core.Contracts.Shared;
using FashionShop.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Admin.Size.Requests
{
    public class AdminSizeListRequest : PagingBase
    {
        public string? Keyword { get; set; }
        public SizeType? Type { get; set; }
        public bool? IsActive { get; set; }
    }
}
