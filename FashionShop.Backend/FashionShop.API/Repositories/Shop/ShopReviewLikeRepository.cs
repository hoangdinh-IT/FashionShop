using FashionShop.API.Data;
using FashionShop.API.Repositories.Shop.Interfaces;
using FashionShop.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace FashionShop.API.Repositories.Shop
{
    public class ShopReviewLikeRepository : IShopReviewLikeRepository
    {
        private readonly FashionDbContext _context;

        public ShopReviewLikeRepository(FashionDbContext context)
        {
            _context = context;
        }



        // --- READ METHODS --- //
        
        public async Task<ReviewLike?> FindReviewLikeAsync(Guid userId, Guid reviewId)
        {
            return await _context.ReviewLikes
                .IgnoreQueryFilters()
                .SingleOrDefaultAsync(rl => rl.UserId == userId && rl.ReviewId == reviewId);
        }

        public async Task<int> TotalLikesAsync(Guid reviewId)
        {
            return await _context.ReviewLikes
                .CountAsync(rl => rl.ReviewId == reviewId && !rl.IsDeleted);
        }



        // --- VALIDATE METHODS --- //

        public async Task<bool> IsReviewAuthorAsync(Guid userId, Guid reviewId)
        {
            return await _context.Reviews
                .Where(review => review.UserId == userId &&
                                 review.Id == reviewId)
                .AnyAsync();
        }



        // --- WRITE METHODS --- //

        public void CreateReviewLike(ReviewLike reviewLike)
        {
            _context.ReviewLikes.Add(reviewLike);
        }
    }
}
