using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shared
{
    public class PagingBase
    {
        public int PageSize { get; set; } = 5;
        public int PageIndex { get; set; } = 1;
        public string? SortBy { get; set; }
        public bool IsAscending { get; set; } = true;
    }
}
