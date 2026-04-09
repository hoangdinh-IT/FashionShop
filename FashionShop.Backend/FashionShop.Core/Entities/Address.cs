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
    [Table("Addresses")]
    public class Address : BaseEntity
    {
        [Required]
        public Guid UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; }

        [Required]
        [MaxLength(10)]
        public string PhoneNumber { get; set; }

        [Required]
        [MaxLength(200)]
        public string AddressDetail {  get; set; }

        [Required]
        [MaxLength(100)]
        public string Commune { get; set; }

        [Required]
        [MaxLength(100)]
        public string District { get; set; }

        [Required]
        [MaxLength(100)]
        public string City { get; set; }

        public bool IsDefault { get; set; } = false;

        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}
