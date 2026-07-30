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

        private static Expression<Func<Voucher, ShopVoucherResponse>> _voucherSelector(Guid userId)
        {
            return voucher => new ShopVoucherResponse
            {
                Id = voucher.Id,
                Name = voucher.Name,
                Code = voucher.Code,
                Description = voucher.Description,
                DiscountType = voucher.DiscountType,
                DiscountAmount = voucher.DiscountAmount,
                MaxDiscountAmount = voucher.MaxDiscountAmount,
                MinOrderValue = voucher.MinOrderValue,
                Quantity = voucher.Quantity,
                UsedCount = voucher.UsedCount,
                RemainingUsagePerUser = voucher.MaxUsagePerUser - voucher.Orders.Count(order => order.UserId == userId),
                StartDate = voucher.StartDate,
                EndDate = voucher.EndDate,
            };
        }
            

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
                .Select(_voucherSelector(userId))
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
