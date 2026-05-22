using AutoMapper;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Services.Shared.Interfaces;
using FashionShop.API.Services.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Review.Requests;
using FashionShop.Core.Contracts.Shop.Review.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Services.Shop
{
    public class ShopReviewService : IShopReviewService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public ShopReviewService(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _photoService = photoService;   
        }



        // --- READ METHODS --- //

        public async Task<IEnumerable<ShopReviewResponse?>> GetReviewsAsync(string productSlug)
        {
            var product = await _unitOfWork.ShopProducts.FindProductByProductSlugAsync(productSlug);
            if (product == null) throw new KeyNotFoundException("Không tìm thấy sản phẩm!");

            return await _unitOfWork.ShopReviews.GetReviewsAsync(productSlug);
        }



        // --- WRITE METHODS --- //

        public async Task<ShopReviewResponse?> CreateReviewAsync(Guid userId, ShopCreateReviewRequest request)
        {
            var review = await _unitOfWork.ShopReviews.IsExistReview(userId, request.ProductId, request.OrderItemId);
            if (review) throw new ConflictException("Đánh giá này đã tồn tại!");

            var newReview = _mapper.Map<Review>(request);
            newReview.Id = Guid.NewGuid();
            newReview.UserId = userId;
            newReview.CreatedDate = DateTime.UtcNow;

            var listImages = new List<ReviewImage>();

            if (request.ReviewImages != null && request.ReviewImages.Any())
            {
                var uploadTasks = request.ReviewImages.Select(async (file, index) =>
                {
                    var uploadResult = await _photoService.AddPhotoAsync(file);

                    if (uploadResult.Error != null) throw new Exception($"Lỗi upload ảnh thứ {index + 1}: {uploadResult.Error.Message}");

                    return new
                    {
                        Index = index,
                        ImageUrl = uploadResult.SecureUrl.AbsoluteUri,
                    };
                }).ToList();

                var uploadResults = await Task.WhenAll(uploadTasks);


                var sortedResults = uploadResults.OrderBy(x => x.Index).ToList();

                foreach (var result in sortedResults)
                {
                    var newImage = new ReviewImage
                    {
                        ImageUrl = result.ImageUrl,
                        SortOrder = result.Index + 1,
                    };

                    _unitOfWork.ShopReviews.CreateReviewImage(newImage);
                    listImages.Add(newImage);
                }
            }
            
            newReview.ReviewImages = listImages;

            _unitOfWork.ShopReviews.CreateReview(newReview);

            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<ShopReviewResponse>(newReview);
        }
    }
}
