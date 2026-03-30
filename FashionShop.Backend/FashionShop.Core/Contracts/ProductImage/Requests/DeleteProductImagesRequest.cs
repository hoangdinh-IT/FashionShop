using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Contracts.ProductImage.Requests
{
    public class DeleteProductImagesRequest
    {

        [Required]
        [MinLength(1, ErrorMessage = "Vui lòng chọn ít nhất 1 hình ảnh để xóa!")]
        public List<Guid>? ImageIds { get; set; }
    }
}
