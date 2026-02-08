using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Common
{
    public abstract class BaseEntity
    {
        // 1. Khoá chính
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        // 2. Thời gian tạo
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // 3. Thời gian cập nhật
        public DateTime? UpdatedDate { get; set; } = null;

        // 3. Cờ xoá
        public bool IsDeleted { get; set; } = false;
    }
}
