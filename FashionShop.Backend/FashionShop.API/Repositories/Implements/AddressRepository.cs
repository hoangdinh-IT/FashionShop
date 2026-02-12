using FashionShop.API.Data;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace FashionShop.API.Repositories.Implements
{
    public class AddressRepository : IAddressRepository
    {
        private readonly FashionDbContext _context;

        public AddressRepository(FashionDbContext context)
        {
            _context = context;
        }

        // --- READ METHODS --- //
        public async Task<int> CountAddressesByUserIdAsync(Guid userId)
            => await _context.Addresses.CountAsync(x => x.UserId == userId);

        public async Task<IEnumerable<Address>> GetAddressesByUserIdAsync(Guid userId)
        {
            return await _context.Addresses
                .AsNoTracking()
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.IsDefault)
                .ThenByDescending(x => x.CreatedDate)
                .ToListAsync();
        }

        public async Task<Address?> GetAddressByUserIdAsync(Guid userId, Guid addressId)
        {
            return await _context.Addresses
                .AsNoTracking()
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
            //var defaultAddresses = await _context.Addresses
            //    .Where(x => x.UserId == userId && x.IsDefault)
            //    .ToListAsync();

            //foreach (var address in defaultAddresses)
            //{
            //    address.IsDefault = false;
            //}

            //await _context.SaveChangesAsync();

            await _context.Addresses
                .Where(x => x.UserId == userId && x.IsDefault)
                .ExecuteUpdateAsync(setters => setters.SetProperty(a => a.IsDefault, false));
        }

        public async Task<Address?> CreateAddressAsync(Address address)
        {
            _context.Addresses.Add(address);
            await _context.SaveChangesAsync();
            return address;
        }

        public async Task<Address?> UpdateAddressByUserIdAsync(Address address)
        {
            _context.Addresses.Update(address);
            await _context.SaveChangesAsync();
            return address;
        }

        public async Task DeleteAddressAsync(Address address)
        {
            address.IsDeleted = true;
            _context.Addresses.Update(address);
            await _context.SaveChangesAsync();
        }
    }
}
