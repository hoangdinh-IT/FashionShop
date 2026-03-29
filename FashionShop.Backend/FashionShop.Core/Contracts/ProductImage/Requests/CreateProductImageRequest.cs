using FashionShop.Core.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.ProductImage.Requests
{
    public class CreateProductImageRequest
    {
        [Required]
        public Guid ProductId { get; set; }
        public int? ColorId { get; set; }

        [Required]
        public List<IFormFile> Images { get; set; }
    }
}
