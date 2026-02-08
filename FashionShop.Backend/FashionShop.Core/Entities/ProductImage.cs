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
    [Table("ProductImages")]
    public class ProductImage : BaseEntity
    {
        [Required]
        public Guid ProductId { get; set; }

        public int? ColorId { get; set; }

        [Required]
        [MaxLength(500)]
        [Column(TypeName = "varchar(500)")]
        public string ImageUrl { get; set; }

        [Required]
        public int SortOrder { get; set; } = 0;

        public virtual Product Product { get; set; }
        public virtual Color Color { get; set; }
    }
}
