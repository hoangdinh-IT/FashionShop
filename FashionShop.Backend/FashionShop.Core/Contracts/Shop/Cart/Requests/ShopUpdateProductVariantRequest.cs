using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.Cart.Requests
{
    public class ShopUpdateProductVariantRequest
    {
        [Required(ErrorMessage = "Vui lòng chọn biến thể mới.")]
        public Guid ProductVariantId { get; set; }
    }
}
