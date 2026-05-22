using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.Review.Responses
{
    public class ShopReviewResponse
    {
        public Guid ReviewId { get; set; }
        public Guid UserId { get; set; }
        public string Fullname { get; set; }
        public string? Avatar { get; set; }

        public Guid ProductId { get; set; }

        public int OrderItemId { get; set; }

        public int Rating { get; set; }

        public string? Content { get; set; }

        public int LikeCount { get; set; } = 0;
        public ICollection<ShopReviewImageResponse> ReviewImages { get; set; } = new List<ShopReviewImageResponse>();
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
