using FashionShop.Core.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.User.Requests
{
    public class ShopUpdateUserRequest
    {

        [Required(ErrorMessage = "Full Name is required")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Phone number is required")]
        public string PhoneNumber { get; set; }
        
        public Gender Gender { get; set; }

        public DateOnly DateOfBirth { get; set; }
    }
}
