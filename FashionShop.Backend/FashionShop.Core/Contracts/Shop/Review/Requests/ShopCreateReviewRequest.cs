using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.Review.Requests
{
    public class ShopCreateReviewRequest
    {
        [Required(ErrorMessage = "ProductId không được để trống.")]
        public Guid ProductId { get; set; }

        [Required(ErrorMessage = "OrderItemId không được để trống.")]
        public int OrderItemId { get; set; }

        [Required(ErrorMessage = "Rating không được để trống.")]
        [Range(1, 5, ErrorMessage = "Đánh giá (Rating) phải từ 1 đến 5 sao.")]
        public int Rating { get; set; }

        [MaxLength(2000, ErrorMessage = "Nội dung đánh giá không được vượt quá 2000 ký tự.")]
        public string? Content { get; set; }

        [MaxLength(5, ErrorMessage = "Chỉ được upload tối đa 5 ảnh")]
        public List<IFormFile>? ReviewImages { get; set; }
    }
}
