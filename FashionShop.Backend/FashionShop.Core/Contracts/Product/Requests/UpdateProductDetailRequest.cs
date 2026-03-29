using FashionShop.Core.Contracts.ProductVariant.Requests;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Product.Requests
{
    public class UpdateProductDetailRequest : UpdateProductRequest
    {
        [Required]
        [MinLength(1, ErrorMessage = "Sản phẩm phải có ít nhất 1 biến thể!")]
        public List<UpdateProductVariantRequest> ProductVariants { get; set; }
    }
}
