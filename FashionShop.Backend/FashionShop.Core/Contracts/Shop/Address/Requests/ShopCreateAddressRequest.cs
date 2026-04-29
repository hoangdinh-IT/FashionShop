using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.Address.Requests
{
    public class ShopCreateAddressRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập họ tên")]
        [MaxLength(200)]
        public string FullName { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập số điện thoại")]
        [MaxLength(200)]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập địa chỉ cụ thể")]
        [MaxLength(200)]
        public string AddressDetail { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn Phường/Xã")]
        [MaxLength(100)]
        public string Commune { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn Quận/Huyện")]
        [MaxLength(100)]
        public string District { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn Tỉnh/Thành phố")]
        [MaxLength(100)]
        public string City { get; set; }

        public bool IsDefault { get; set; } = false;
    }
}
