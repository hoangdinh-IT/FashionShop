using FashionShop.Core.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Admin.Size.Requests
{
    public class UpdateSizeRequest
    {
        [Required]
        [MaxLength(50, ErrorMessage = "Tên kích thước không được quá 50 kí tự!")]
        public string Name { get; set; }

        [Required]
        [MaxLength(50, ErrorMessage = "Slug không được quá 50 kí tự!")]
        public string Slug { get; set; }

        [Required]
        public int SortOrder { get; set; }

        [Required]
        public SizeType Type { get; set; }

        public bool IsActive { get; set; }
    }
}
