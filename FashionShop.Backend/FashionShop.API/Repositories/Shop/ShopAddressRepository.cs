using FashionShop.API.Data;
using FashionShop.API.Repositories.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Address.Responses;
using FashionShop.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FashionShop.API.Repositories.Shop
{
    public class ShopAddressRepository : IShopAddressRepository
    {
        private readonly FashionDbContext _context;

        public ShopAddressRepository(FashionDbContext context)
        {
            _context = context;
        }

        private static readonly Expression<Func<Address, ShopAddressResponse>> _addressSelector =
            x => new ShopAddressResponse
            {
                Id = x.Id,
                UserId = x.UserId,
                FullName = x.User.FullName,
                PhoneNumber = x.User.PhoneNumber,
                AddressDetail = x.AddressDetail,
                Commune = x.Commune,
                District = x.District,
                City = x.City,
                IsDefault = x.IsDefault,
                CreatedDate = x.CreatedDate,
            };



        // --- READ METHODS --- //

        public async Task<int> CountAddressesByUserIdAsync(Guid userId)
            => await _context.Addresses.CountAsync(x => x.UserId == userId);

        public async Task<IEnumerable<ShopAddressResponse>> GetAddressesByUserIdAsync(Guid userId)
        {
            return await _context.Addresses
                .AsNoTracking()
                .Select(_addressSelector)
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.IsDefault)
                .ThenByDescending(x => x.CreatedDate)
                .ToListAsync();
        }

        public async Task<Address?> GetAddressByUserIdAsync(Guid userId, Guid addressId)
        {
            return await _context.Addresses
                .Where(x => x.UserId == userId && x.Id == addressId)
                .FirstOrDefaultAsync();
        }

        public async Task<Address?> GetNewestAddressByUserIdAsync(Guid userId, Guid excludeAddressId)
        {
            return await _context.Addresses
                .AsNoTracking()
                .Where(x => x.UserId == userId && x.Id != excludeAddressId)
                .OrderByDescending(x => x.CreatedDate)
                .FirstOrDefaultAsync();
        }



        // --- WRITE METHODS --- //

        public async Task UnsetDefaultAddressAsync(Guid userId)
        {
            await _context.Addresses
                .Where(x => x.UserId == userId && x.IsDefault)
                .ExecuteUpdateAsync(setters => setters.SetProperty(a => a.IsDefault, false));
        }

        public void CreateAddress(Address address)
        {
            _context.Addresses.Add(address);
        }

        public void DeleteAddress(Address address)
        {
            address.IsDeleted = true;
        }
    }
}
