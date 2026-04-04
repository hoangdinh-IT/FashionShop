using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Admin.Brand.Requests
{
    public class CreateBrandRequest
    {
        [Required]
        [MaxLength(100, ErrorMessage = "Tên thương hiệu không được vượt quá 100 ký tự!")]
        public string Name { get; set; }

        [MaxLength(500, ErrorMessage = "Mô tả không được vượt quá 500 ký tự!")]    
        public string? Description { get; set; }

        [Required]
        [MaxLength(100, ErrorMessage = "Slug thương hiệu không được vượt quá 100 ký tự!")]
        public string Slug { get; set; }

        [Required]
        public IFormFile Logo { get; set; }
    }
}
