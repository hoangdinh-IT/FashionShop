using FashionShop.Core.Common;
using FashionShop.Core.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Entities
{
    [Table("Users")]
    public class User : BaseEntity
    {

        [Required]
        [MaxLength(100)]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MaxLength(255)]
        public string Password { get; set; }

        [Required]
        public RoleUser Role { get; set; } = RoleUser.Customer;

        [MaxLength(100)]
        public string? FullName { get; set; }

        [MaxLength(10)]
        [Column(TypeName = "varchar(10)")]
        public string? PhoneNumber { get; set; }

        [Required]
        public Gender Gender { get; set; } = Gender.Other;

        [Required]
        public DateOnly DateOfBirth { get; set; }
        public MembershipClass MembershipClass { get; set; } = MembershipClass.New;
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        public string? Otp { get; set; } = null;
        public DateTime? OtpExpiryTime { get; set; }


        public virtual ICollection<Address> Addresses { get; set; } = new List<Address>();

        public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();

        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

        public virtual ICollection<VoucherUsage> VoucherUsages { get; set; } = new List<VoucherUsage>();

        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

        public virtual ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
    }
}
