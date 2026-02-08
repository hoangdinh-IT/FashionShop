using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.DTOs.ProductImage
{
    public class ProductImageDTO
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public int? ColorId { get; set; }
        public string? ColorName { get; set; }
        public string? ColorCode { get; set; }
        public string ImageUrl { get; set; }
        public int SortOrder { get; set; } = 0;
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
