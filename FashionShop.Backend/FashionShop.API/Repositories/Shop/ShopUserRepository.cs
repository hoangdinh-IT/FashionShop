using FashionShop.API.Data;
using FashionShop.API.Repositories.Shop.Interfaces;
using FashionShop.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace FashionShop.API.Repositories.Shop
{
    public class ShopUserRepository : IShopUserRepository
    {
        private readonly FashionDbContext _context;

        public ShopUserRepository(FashionDbContext context)
        {
            _context = context;
        }



        // --- READ METHODS --- //

        public async Task<IEnumerable<User>> GetUsersAsync()
            => await _context.Users.AsNoTracking().ToListAsync();

        public async Task<User?> GetUserByIdAsync(Guid userId)
            => await _context.Users.FindAsync(userId);

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(x => x.Email == email);
        }



        // --- VALIDATION METHODS --- //

        public async Task<bool> CheckUserExistAsync(string email)
        {
            return await _context.Users
                .IgnoreQueryFilters()
                .AnyAsync(user => user.Email == email);
        }



        // --- WRITE METHODS --- //

        public void Create(User user)
        {
            _context.Users.Add(user);
        }

        public void Delete(User user)
        {
            user.IsDeleted = true;
        }
    }
}
