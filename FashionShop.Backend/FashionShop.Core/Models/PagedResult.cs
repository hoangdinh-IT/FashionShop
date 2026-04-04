using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Models
{
    public class PagedResult<T>
    {
        public List<T> Items { get; set; }
        public int TotalRecord { get; set; }  // Tổng số dòng trong DB
        public int PageSize { get; set; }  // Số dòng trong 1 trang
        public int PageIndex { get; set; }  // Trang hiện tại
        
        public int TotalPages => (int)Math.Ceiling((double)TotalRecord / PageSize);
        public bool HasNextPage => PageIndex < TotalPages;
        public bool HasPreviousPage => PageIndex > 1;

        public PagedResult()
        {
            Items = new List<T>();
        }

        public PagedResult(List<T> items, int totalRecord, int pageSize, int pageIndex)
        {
            Items = items;
            TotalRecord = totalRecord;
            PageSize = pageSize;
            PageIndex = pageIndex;
        }
    }
}
