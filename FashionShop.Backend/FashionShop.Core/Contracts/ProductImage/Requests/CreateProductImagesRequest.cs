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
    public class CreateProductImagesRequest
    {
        public int? ColorId { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "Sản phẩm phải có ít nhất 1 hình ảnh!")]
        public List<IFormFile> Images { get; set; }
    }
}
