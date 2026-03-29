using FashionShop.Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Color
{
    public class CreateColorDTO
    {
        [Required]
        [MaxLength(50, ErrorMessage = "Tên màu sắc không được quá 50 kí tự!")]
        public string Name { get; set; }

        [Required]
        [MaxLength(7, ErrorMessage = "Hexcode không được quá 7 kí tự!")]
        public string HexCode { get; set; }

        [Required]
        [MaxLength(50, ErrorMessage = "Slug màu sắc không được quá 50 kí tự!")]
        public string Slug { get; set; }
    }
}
