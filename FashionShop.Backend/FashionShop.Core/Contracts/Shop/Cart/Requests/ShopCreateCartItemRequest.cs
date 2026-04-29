using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.Cart.Requests
{
    public class ShopCreateCartItemRequest
    {
        [Required(ErrorMessage = "Vui lòng chọn biến thể sản phẩm.")]
        public Guid ProductVariantId { get; set; }

        [Required]
        [Range(1, 999, ErrorMessage = "Số lượng phải lớn hơn 0.")]
        public int Quantity { get; set; } = 1;
    }
}
