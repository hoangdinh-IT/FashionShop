using FashionShop.Core.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Entities
{
    [Table("Reviews")]
    public class Review : BaseEntity
    {
        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        [Required]
        public int OrderItemId { get; set; }

        [Required]
        public int Rating { get; set; }

        public string? Content { get; set; }

        public int LikeCount { get; set; } = 0;

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }

        [ForeignKey("OrderDetailId")]
        public virtual OrderItem OrderItem { get; set; }

        public virtual ICollection<ReviewImage> ReviewImages { get; set; } = new List<ReviewImage>();
    }
}
