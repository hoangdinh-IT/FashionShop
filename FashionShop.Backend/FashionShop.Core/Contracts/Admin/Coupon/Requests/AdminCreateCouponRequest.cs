using FashionShop.Core.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FashionShop.Core.Contracts.Admin.Coupon.Requests
{
    public class AdminCreateCouponRequest
    {
        [Required]
        public string Name { get; set; }

        [Required]
        [MaxLength(50, ErrorMessage = "Code giảm giá không được quá 50 kí tự!")]
        public string Code { get; set; }

        [Required]
        [MaxLength(500, ErrorMessage = "Mô tả giảm giá không được quá 500 kí tự!")]
        public string Description { get; set; }

        [Required]
        public DiscountType DiscountType { get; set; } = DiscountType.FixedAmount;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountAmount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MaxDiscountAmount { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal MinOrderValue { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public int MaxUsagePerUser { get; set; } = 1;

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;
    }
}
