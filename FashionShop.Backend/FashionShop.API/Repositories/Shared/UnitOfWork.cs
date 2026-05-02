using FashionShop.API.Data;
using FashionShop.API.Repositories.Admin;
using FashionShop.API.Repositories.Admin.Interfaces;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Repositories.Shop;
using FashionShop.API.Repositories.Shop.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;

namespace FashionShop.API.Repositories.Shared
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly FashionDbContext _context;
        private IDbContextTransaction _transaction;

        private IAdminBrandRepository _adminBrands;
        private IAdminCategoryRepository _adminCategories;
        private IAdminColorRepository _adminColors;
        private IAdminProductRepository _adminProducts;
        private IAdminSizeRepository _adminSizes;
        private IAdminVoucherRepository _adminVouchers;
        private IAdminOrderRepository _adminOrders;
        
        private IShopUserRepository _shopUsers;
        private IShopAddressRepository _shopAddresses;
        private IShopProductRepository _shopProducts;
        private IShopBrandRepository _shopBrands;
        private IShopCategoryRepository _shopCategories;
        private IShopCartRepository _shopCarts;
        private IShopOrderRepository _shopOrders;

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
        public IAdminOrderRepository AdminOrders => _adminOrders ??= new AdminOrderRepository(_context);

        public IShopUserRepository ShopUsers => _shopUsers ??= new ShopUserRepository(_context);
        public IShopAddressRepository ShopAddresses => _shopAddresses ??= new ShopAddressRepository(_context);
        public IShopProductRepository ShopProducts => _shopProducts ??= new ShopProductRepository(_context);
        public IShopBrandRepository ShopBrands => _shopBrands ??= new ShopBrandRepository(_context);
        public IShopCategoryRepository ShopCategories => _shopCategories ??= new ShopCategoryRepository(_context);
        public IShopCartRepository ShopCarts => _shopCarts ??= new ShopCartRepository(_context);
        public IShopOrderRepository ShopOrders => _shopOrders ??= new ShopOrderRepository(_context);

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            if (_transaction != null) return;
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            try
            {
                await _context.SaveChangesAsync(); // Lưu data trước khi commit
                if (_transaction != null)
                {
                    await _transaction.CommitAsync();
                }
            }
            finally
            {
                await ResetTransaction();
            }
        }

        public async Task RollbackTransactionAsync()
        {
            try
            {
                if (_transaction != null)
                {
                    await _transaction.RollbackAsync();
                }
            }
            finally
            {
                await ResetTransaction();
            }
        }

        private async Task ResetTransaction()
        {
            if (_transaction != null)
            {
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            _context.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}
