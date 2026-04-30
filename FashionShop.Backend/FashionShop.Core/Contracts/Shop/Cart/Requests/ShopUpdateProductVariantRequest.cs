using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.Cart.Requests
{
    public class ShopUpdateCartItemRequest
    {
        [Required(ErrorMessage = "Vui lòng chọn biến thể mới.")]
        public Guid ProductVariantId { get; set; }

        [Required(ErrorMessage = "Số lượng không được để trống.")]
        [Range(1, 1000, ErrorMessage = "Số lượng sản phẩm phải nằm trong khoảng từ 1 đến 1000.")]
        public int Quantity { get; set; }

        public bool IsSelected { get; set; }
    }
}
