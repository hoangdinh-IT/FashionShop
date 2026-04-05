using FashionShop.API.Data;
using FashionShop.API.Repositories.Admin.Interfaces;
using FashionShop.Core.Contracts.Admin.Voucher.Requests;
using FashionShop.Core.Contracts.Admin.Voucher.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Extensions;
using FashionShop.Core.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FashionShop.API.Repositories.Admin
{
    public class AdminVoucherRepository : IAdminVoucherRepository
    {
        private readonly FashionDbContext _context;

        private static readonly Expression<Func<Voucher, AdminVoucherResponse>> _voucherSelector =
            x => new AdminVoucherResponse
            {
                Id = x.Id,
                Name = x.Name,
                Code = x.Code,
                Description = x.Description,
                DiscountType = x.DiscountType,
                DiscountAmount = x.DiscountAmount,
                MaxDiscountAmount = x.MaxDiscountAmount,
                MinOrderValue = x.MinOrderValue,
                Quantity = x.Quantity,
                UsedCount = x.UsedCount,
                MaxUsagePerUser = x.MaxUsagePerUser,
                StartDate = x.StartDate,
                EndDate = x.EndDate,
                IsActive = x.IsActive,
                CreatedDate = x.CreatedDate,
                UpdatedDate = x.UpdatedDate,
                IsDeleted = x.IsDeleted,
            };

        public AdminVoucherRepository(FashionDbContext context)
        {
            _context = context;
        }



        // --- READ METHODS --- //

        public async Task<PagedResult<AdminVoucherResponse>> GetPagedVouchers(AdminVoucherListRequest request)
        {
            var query = _context.Vouchers.AsNoTracking().AsQueryable();

            query = query.FilterByKeyword(request.Keyword)
                         .FilterByDiscountType(request.DiscountType)
                         .FilterByActive(request.IsActive)
                         .FilterByDate(request.FromDate, request.ToDate)
                         .FilterByStatus(request.Status)
                         .FilterByAvailable(request.IsAvailable)
                         .FilterByMinOrderValue(request.FromMinOrderValue, request.ToMinOrderValue)
                         .Sort(request.SortBy, request.IsAscending);

            var totalRecord = await query.CountAsync();

            var data = await query.Skip((request.PageIndex - 1) * request.PageSize)
                                  .Take(request.PageSize)
                                  .Select(_voucherSelector)
                                  .ToListAsync();

            return new PagedResult<AdminVoucherResponse>
            {
                Items = data,
                TotalRecord = totalRecord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex
            };
        }

        public async Task<AdminVoucherResponse?> GetVoucherByIdAsync(Guid voucherId)
        {
            return await _context.Vouchers
                .Where(x => x.Id == voucherId)
                .Select(_voucherSelector)
                .FirstOrDefaultAsync();
        }

        public async Task<Voucher?> FindVoucherByIdAsync(Guid voucherId)
            => await _context.Vouchers.FindAsync(voucherId);



        // --- VALIDATION METHODS --- //

        public async Task<bool> CheckExistCode(string code)
            => await _context.Vouchers.AnyAsync(x => x.Code.ToLower() == code.ToLower());



        // --- WRITE METHODS --- //

        public void CreateVoucher(Voucher voucher)
        {
            _context.Vouchers.Add(voucher);
        }

        public void DeleteVoucher(Voucher voucher)
        {
            voucher.IsDeleted = true;
        }
    }
}
