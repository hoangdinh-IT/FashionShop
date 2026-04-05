using FashionShop.Core.Contracts.Admin.ProductVariant.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Admin.Product.Responses
{
    public class AdminProductDetailResponse : AdminProductResponse
    {
        public IEnumerable<AdminProductVariantResponse>? ProductVariants { get; set; }
    }
}
