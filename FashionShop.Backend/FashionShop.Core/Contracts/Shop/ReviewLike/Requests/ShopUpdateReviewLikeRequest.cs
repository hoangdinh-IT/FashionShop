using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.ReviewLike.Requests
{
    public class ShopUpdateReviewLikeRequest
    {
        [Required(ErrorMessage = "Mã bài đánh giá (ReviewId) không được để trống!")]
        public Guid ReviewId { get; set; }
    }
}
