using FashionShop.API.Data;
using FashionShop.API.Repositories.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Review.Responses;
using FashionShop.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FashionShop.API.Repositories.Shop
{
    public class ShopReviewRepository : IShopReviewRepository
    {
        private readonly FashionDbContext _context;

        public ShopReviewRepository(FashionDbContext context)
        {
            _context = context;
        }

        private static Expression<Func<Review, ShopReviewResponse>> _reviewSelector(Guid? currentUserId)
        {
            return review => new ShopReviewResponse
            {
                ReviewId = review.Id,
                UserId = review.UserId,
                Fullname = review.User.FullName ?? "",
                Avatar = review.User.Avatar,
                ProductId = review.ProductId,
                OrderItemId = review.OrderItemId,
                Rating = review.Rating,
                Content = review.Content,
                IsLiked = currentUserId.HasValue && review.ReviewLikes.Any(rl => rl.UserId == currentUserId.Value && !rl.IsDeleted),
                TotalLikes = review.ReviewLikes.Count(rl => !rl.IsDeleted),
                ReviewImages = review.ReviewImages != null
                    ? review.ReviewImages
                            .Select(ri => new ShopReviewImageResponse
                            {
                                ReviewImageId = ri.Id,
                                ImageUrl = ri.ImageUrl,
                                SortOrder = ri.SortOrder,
                            })
                            .ToList()
                    : new List<ShopReviewImageResponse>(),
                CreatedDate = review.CreatedDate,
            };
        }
            



        // --- READ METHODS --- //

        public async Task<IEnumerable<ShopReviewResponse>> GetReviewsAsync(Guid? currentUserId, string productSlug)
        {
            return await _context.Reviews
                .AsNoTracking()
                .AsSplitQuery()
                .Where(review => review.Product.Slug == productSlug)
                .Select(_reviewSelector(currentUserId))
                .ToListAsync();
        }

        public async Task<Review?> FindReviewAsync(Guid reviewId)
        {
            return await _context.Reviews.FindAsync(reviewId);
        }

        public async Task<ShopReviewResponse?> GetReviewAsync(Guid? currentUserId, Guid reviewId)
        {
            return await _context.Reviews
                .AsNoTracking()
                .Where(review => review.Id == reviewId)
                .Select(_reviewSelector(currentUserId))
                .FirstOrDefaultAsync();
        }



        // --- VALIDATE METHODS --- //

        public async Task<bool> IsExistReviewAsync(Guid userId, Guid productId, int orderItemId)
        {
            return await _context.Reviews
                .Where(review => review.UserId == userId &&
                                 review.ProductId == productId &&
                                 review.OrderItemId == orderItemId)
                .AnyAsync();
        }

        public async Task<bool> IsReviewAuthorAsync(Guid userId, Guid reviewId)
        {
            return await _context.Reviews
                .Where(review => review.UserId == userId &&
                                 review.Id == reviewId)
                .AnyAsync();
        }

        public async Task<bool> IsReviewLikedAsync(Guid userId, Guid reviewId)
        {
            return await _context.ReviewLikes
                .AnyAsync(rl => rl.UserId == userId && rl.ReviewId == reviewId);
        }



        // --- WRITE METHODS --- //

        public void CreateReview(Review review)
        {
            _context.Reviews.Add(review);
        } 

        public void DeleteReview(Review review)
        {
            _context.Reviews.Remove(review);
        }

        public void CreateReviewImage(ReviewImage reviewImage)
        {
            _context.ReviewImages.Add(reviewImage);
        }

        public void DeleteReviewImage(ReviewImage reviewImage)
        {
            _context.ReviewImages.Remove(reviewImage);
        }
    }
}
