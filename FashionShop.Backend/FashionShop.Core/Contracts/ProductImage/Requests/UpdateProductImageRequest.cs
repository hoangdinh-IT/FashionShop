using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.ProductImage.Requests
{
    public class UpdateProductImageRequest
    {
        public int? ColorId { get; set; }

        [Required]
        public int SortOrder { get; set; } = 0;
    }
}
