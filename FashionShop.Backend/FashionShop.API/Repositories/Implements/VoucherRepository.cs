using FashionShop.API.Data;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.Core.Contracts.Voucher.Requests;
using FashionShop.Core.Contracts.Voucher.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Extensions;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.Voucher;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FashionShop.API.Repositories.Implements
{
    public class VoucherRepository : IVoucherRepository
    {
        private readonly FashionDbContext _context;

        private static readonly Expression<Func<Voucher, VoucherResponse>> _voucherSelector =
            x => new VoucherResponse
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

        public VoucherRepository(FashionDbContext context)
        {
            _context = context;
        }



        // --- READ METHODS --- //

        public async Task<PagedResult<VoucherResponse>> GetPagedVouchers(VoucherListRequest request)
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

            return new PagedResult<VoucherResponse>
            {
                Items = data,
                TotalRecord = totalRecord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex
            };
        }

        public async Task<VoucherResponse?> GetVoucherByIdAsync(Guid voucherId)
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

        public async Task<Voucher> CreateVoucherAsync(Voucher voucher)
        {
            _context.Vouchers.Add(voucher);
            await _context.SaveChangesAsync();
            return voucher;
        }

        public async Task<Voucher> UpdateVoucherAsync(Voucher voucher)
        {
            await _context.SaveChangesAsync();
            return voucher;
        }

        public async Task DeleteVoucherAsync(Voucher voucher)
        {
            voucher.IsDeleted = true;
            await _context.SaveChangesAsync();
        }
    }
}
