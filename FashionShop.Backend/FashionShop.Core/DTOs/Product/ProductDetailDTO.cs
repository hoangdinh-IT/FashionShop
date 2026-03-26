using FashionShop.Core.DTOs.ProductVariant;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.DTOs.Product
{
    public class ProductDetailDTO : ProductDTO
    {
        public List<ProductVariantDTO> ProductVariants { get; set; }
    }
}
