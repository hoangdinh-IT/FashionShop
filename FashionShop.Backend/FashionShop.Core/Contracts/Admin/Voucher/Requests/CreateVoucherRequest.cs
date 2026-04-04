using FashionShop.Core.Entities;
using FashionShop.Core.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Admin.Voucher.Requests
{
    public class CreateVoucherRequest
    {
        [Required]
        public string Name { get; set; }

        [Required]
        [MaxLength(50, ErrorMessage = "Code voucher không được quá 500 kí tự!")]
        public string Code { get; set; }

        [Required]
        [MaxLength(500, ErrorMessage = "Mô tả voucher không được quá 500 kí tự!")]
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
    }
}
