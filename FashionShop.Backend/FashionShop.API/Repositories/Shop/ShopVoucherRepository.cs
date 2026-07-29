using FashionShop.API.Data;
using FashionShop.API.Repositories.Shop.Interfaces;
using FashionShop.Core.Contracts.Admin.Voucher.Responses;
using FashionShop.Core.Contracts.Shop.Voucher.Responses;
using FashionShop.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FashionShop.API.Repositories.Shop
{
    public class ShopVoucherRepository : IShopVoucherRepository
    {
        private readonly FashionDbContext _context;

        public ShopVoucherRepository(FashionDbContext context)
        {
            _context = context;
        }

        private static readonly Expression<Func<Voucher, ShopVoucherResponse>> _voucherSelector =
            x => new ShopVoucherResponse
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
            };

        private static readonly Expression<Func<VoucherUsage, ShopVoucherUsageResponse>> _voucherUsageSelector =
            x => new ShopVoucherUsageResponse
            {
                Id = x.Id,
                UserId = x.UserId,
                VoucherId = x.VoucherId,
                OrderId = x.OrderId,
                UsedDate = x.UsedDate,
            };



        // --- READ METHODS --- //

        public async Task<IEnumerable<ShopVoucherResponse>> GetVouchersAsync(Guid userId)
        {
            var now = DateTime.UtcNow;
            return await _context.Vouchers
                .Where(voucher =>
                    voucher.IsActive &&
                    voucher.StartDate <= now && 
                    voucher.EndDate >= now &&
                    voucher.UsedCount < voucher.Quantity &&
                    voucher.VoucherUsages.Count(vu => vu.UserId == userId && !vu.IsDeleted) < voucher.MaxUsagePerUser
                )
                .Select(_voucherSelector)
                .ToListAsync();
        }

        public async Task<Voucher?> FindVoucherByIdAsync(Guid voucherId)
        {
            return await _context.Vouchers.FindAsync(voucherId);
        }

        public async Task<ShopVoucherUsageResponse?> GetVoucherUsageByIdAsync(int voucherUsageId)
        {
            return await _context.VoucherUsages
                .Where(vu => vu.Id == voucherUsageId)
                .Select(_voucherUsageSelector)
                .FirstOrDefaultAsync();
        }



        // --- WRITE METHODS --- //

        public void CreateVoucherUsage(VoucherUsage voucherUsage)
        {
            _context.VoucherUsages.Add(voucherUsage);
        }
    }
}
