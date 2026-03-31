using FashionShop.Core.Models.Paging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Models.Category
{
    public class CategoryListRequest : PagingBase
    {
        public string? Keyword { get; set; }
        public bool? IsActive { get; set; }
        public Guid? ParentId { get; set; }
    }
}
