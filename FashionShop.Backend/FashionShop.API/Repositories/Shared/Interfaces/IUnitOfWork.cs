using FashionShop.API.Repositories.Admin.Interfaces;
using FashionShop.API.Repositories.Shop.Interfaces;

namespace FashionShop.API.Repositories.Shared.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IAdminBrandRepository AdminBrands { get; }
        IAdminCategoryRepository AdminCategories { get; }
        IAdminColorRepository AdminColors { get; }
        IAdminProductRepository AdminProducts { get; }
        IAdminSizeRepository AdminSizes { get; }
        IAdminVoucherRepository AdminVouchers { get; }

        IShopUserRepository ShopUsers { get; }
        IShopAddressRepository ShopAddresses { get; }
        IShopProductRepository ShopProducts { get; }

        Task<int> SaveChangesAsync();

        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}
