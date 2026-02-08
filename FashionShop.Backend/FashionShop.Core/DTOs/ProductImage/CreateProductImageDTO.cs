using FashionShop.Core.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.DTOs.ProductImage
{
    public class CreateProductImageDTO
    {
        [Required]
        public Guid ProductId { get; set; }
        public int? ColorId { get; set; }

        [Required]
        public IFormFile Image { get; set; }

        [Required]
        public int SortOrder { get; set; } = 0;
    }
}
