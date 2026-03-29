using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Address
{
    public class CreateAddressDTO
    {
        [Required]
        public Guid UserId { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập địa chỉ cụ thể")]
        [MaxLength(200)]
        public string Street { get; set; }

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
