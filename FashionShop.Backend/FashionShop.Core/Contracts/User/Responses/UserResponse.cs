using FashionShop.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.User.Responses
{
    public class UserResponse
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public RoleUser Role { get; set; }
        public string? Token { get; set; }
    }
}
