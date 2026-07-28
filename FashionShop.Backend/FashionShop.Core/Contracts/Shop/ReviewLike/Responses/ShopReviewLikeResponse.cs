using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.ReviewLike.Responses
{
    public class ShopReviewLikeResponse
    {
        public Guid UserId { get; set; }
        public Guid ReviewId { get; set; }
        public bool IsLiked { get; set; }
        public int TotalLikes { get; set; }
    }
}
