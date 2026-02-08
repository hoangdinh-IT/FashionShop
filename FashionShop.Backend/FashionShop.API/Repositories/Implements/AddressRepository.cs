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

        public async Task<int> CountAddressesByUserIdAsync(Guid userId)
        {
            return await _context.Addresses.CountAsync(address => address.UserId == userId);
        }

        public async Task RemoveDefaultAddressAsync(Guid userId)
        {
            var defaultAddresses = await _context.Addresses
                                                 .Where(address => address.UserId == userId &&
                                                                   address.IsDefault)
                                                 .ToListAsync();

            foreach (var address in defaultAddresses)
            {
                address.IsDefault = false;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<Address?> CreateAddressAsync(Address address)
        {
            _context.Addresses.Add(address);
            await _context.SaveChangesAsync();
            return address;
        }

        public async Task<IEnumerable<Address>> GetAddressesByUserIdAsync(Guid userId)
        {
            return await _context.Addresses.Where(address => address.UserId == userId)
                                           .AsNoTracking()
                                           .ToListAsync();
        }

        public async Task<Address?> GetAddressByUserIdAsync(Guid userId, Guid addressId)
        {
            return await _context.Addresses.AsNoTracking()
                                           .FirstOrDefaultAsync(address => address.UserId == userId && 
                                                                           address.Id == addressId);
        }

        public async Task<Address?> GetNewestAddressByUserIdAsync(Guid userId, Guid excludeAddressId)
        {
            return await _context.Addresses.Where(address => address.UserId == userId && address.Id != excludeAddressId)
                                           .OrderByDescending(address => address.CreatedDate)
                                           .AsNoTracking()
                                           .FirstOrDefaultAsync();
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
