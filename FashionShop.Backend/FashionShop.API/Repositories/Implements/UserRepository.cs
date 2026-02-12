using FashionShop.API.Data;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace FashionShop.API.Repositories.Implements
{
    public class UserRepository : IUserRepository
    {
        private readonly FashionDbContext _context;

        public UserRepository(FashionDbContext context)
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
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Email == email);
        }

        // --- VALIDATION METHODS --- //
        public async Task<bool> IsUserExistsAsync(string email)
        {
            return await _context.Users
                .IgnoreQueryFilters()
                .AnyAsync(user => user.Email == email);
        }

        // --- WRITE METHODS --- //
        public async Task<User?> CreateUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User?> UpdateUserAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task DeleteUserAsync(User user)
        {
            user.IsDeleted = true;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
    }
}
