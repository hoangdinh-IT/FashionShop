using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.ProductImage.Requests
{
    public class UpdateSortOrderRequest
    {
        public int? ColorId { get; set; }

        [Required]
        public List<Guid> ImageIds { get; set; }
    }
}
