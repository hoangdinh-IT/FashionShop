using FashionShop.Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.Color.Responses
{
    public class ColorResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string HexCode { get; set; }
        public string Slug { get; set; }
        public int ProductCount { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
