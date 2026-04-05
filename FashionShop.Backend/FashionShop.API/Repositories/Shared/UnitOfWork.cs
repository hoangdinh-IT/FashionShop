using FashionShop.API.Data;
using FashionShop.API.Repositories.Admin;
using FashionShop.API.Repositories.Admin.Interfaces;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Repositories.Shop;
using FashionShop.API.Repositories.Shop.Interfaces;

namespace FashionShop.API.Repositories.Shared
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly FashionDbContext _context;

        private IAdminBrandRepository _adminBrands;
        private IAdminCategoryRepository _adminCategories;
        private IAdminColorRepository _adminColors;
        private IAdminProductRepository _adminProducts;
        private IAdminSizeRepository _adminSizes;
        private IAdminVoucherRepository _adminVouchers;
        
        private IShopUserRepository _shopUsers;
        private IShopAddressRepository _shopAddresses;

        public UnitOfWork(FashionDbContext context)
        {
            _context = context;
        }

        public IAdminBrandRepository AdminBrands => _adminBrands ??= new AdminBrandRepository(_context);
        public IAdminCategoryRepository AdminCategories => _adminCategories ??= new AdminCategoryRepository(_context);
        public IAdminColorRepository AdminColors => _adminColors ??= new AdminColorRepository(_context);
        public IAdminProductRepository AdminProducts => _adminProducts ??= new AdminProductRepository(_context);
        public IAdminSizeRepository AdminSizes => _adminSizes ??= new AdminSizeRepository(_context);
        public IAdminVoucherRepository AdminVouchers => _adminVouchers ??= new AdminVoucherRepository(_context);

        public IShopUserRepository ShopUsers => _shopUsers ??= new ShopUserRepository(_context);
        public IShopAddressRepository ShopAddresses => _shopAddresses ??= new ShopAddressRepository(_context);

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            await _context.Database.CommitTransactionAsync();
        }

        public async Task RollbackTransactionAsync()
        {
            await _context.Database.RollbackTransactionAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}
