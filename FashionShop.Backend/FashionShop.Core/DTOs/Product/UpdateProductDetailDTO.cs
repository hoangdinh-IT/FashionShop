using FashionShop.Core.DTOs.ProductVariant;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.DTOs.Product
{
    public class UpdateProductDetailDTO : UpdateProductDTO
    {
        [Required]
        [MinLength(1, ErrorMessage = "Sản phẩm phải có ít nhất 1 biến thể!")]
        public List<UpdateProductVariantDTO> ProductVariants { get; set; }
    }
}
