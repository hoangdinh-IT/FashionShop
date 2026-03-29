using FashionShop.Core.Contracts.ProductVariant.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Product.Responses
{
    public class ProductDetailResponse : ProductResponse
    {
        public List<ProductVariantResponse> ProductVariants { get; set; }
    }
}
