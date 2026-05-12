using FashionShop.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Shop.User.Responses
{
    public class ShopUserResponse
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public RoleUser Role { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public Gender Gender { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string Avatar { get; set; }
        public MembershipClass MembershipClass { get; set; }
    }
}
