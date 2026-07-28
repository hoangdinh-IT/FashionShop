using AutoMapper;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Repositories.Shop.Interfaces;
using FashionShop.API.Services.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.ReviewLike.Requests;
using FashionShop.Core.Contracts.Shop.ReviewLike.Responses;
using FashionShop.Core.Entities;

namespace FashionShop.API.Services.Shop
{
    public class ShopReviewLikeService : IShopReviewLikeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ShopReviewLikeService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ShopReviewLikeResponse> UpdateReviewLikeAsync(Guid userId, ShopUpdateReviewLikeRequest request)
        {
            bool isAuthor = await _unitOfWork.ShopReviews.IsReviewAuthorAsync(userId, request.ReviewId);
            if (isAuthor) throw new Exception("Không thể tự like đánh giá của chính mình!");

            var review = await _unitOfWork.ShopReviews.FindReviewAsync(request.ReviewId);
            if (review == null) throw new KeyNotFoundException("Không tìm thấy bài đánh giá!");

            var reviewLike = await _unitOfWork.ShopReviewLikes.FindReviewLikeAsync(userId, request.ReviewId);
            bool isLiked = false;

            if (reviewLike == null)
            {
                var newReviewLike = _mapper.Map<ReviewLike>(request);
                newReviewLike.UserId = userId;
                newReviewLike.LikedAt = DateTime.UtcNow;
                newReviewLike.IsDeleted = false;

                _unitOfWork.ShopReviewLikes.CreateReviewLike(newReviewLike);
                isLiked = true;
            } 
            else if (reviewLike.IsDeleted)
            {
                reviewLike.IsDeleted = false;
                reviewLike.LikedAt = DateTime.UtcNow;
                isLiked = true;
            }
            else
            {
                reviewLike.IsDeleted = true;
                isLiked = false;
            }

            await _unitOfWork.SaveChangesAsync();

            int totalLikes = await _unitOfWork.ShopReviewLikes.TotalLikesAsync(request.ReviewId);
            review.TotalLikes = totalLikes;
            await _unitOfWork.SaveChangesAsync();

            return new ShopReviewLikeResponse
            {
                UserId = userId,
                ReviewId = request.ReviewId,
                IsLiked = isLiked,
                TotalLikes = totalLikes,
            };
        }
    }
}
