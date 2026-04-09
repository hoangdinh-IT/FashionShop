using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.Category.Responses
{
    public class ShopCategoryResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public string Slug { get; set; }
        public Guid? ParentId { get; set; }
        public string? ImageUrl { get; set; }
        public List<ShopCategoryResponse> Children { get; set; } = new List<ShopCategoryResponse>();
    }
}
