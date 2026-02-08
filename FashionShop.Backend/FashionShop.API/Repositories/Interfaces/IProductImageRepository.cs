using FashionShop.Core.DTOs.ProductImage;
using FashionShop.Core.Entities;

namespace FashionShop.API.Repositories.Interfaces
{
    public interface IProductImageRepository
    {
        // HÀM CHÍNH
        Task<ProductImage> CreateProductImageAsync(ProductImage productImage);
        Task<IEnumerable<ProductImageDTO>> GetProductImagesAsync(Guid productId, int? colorId);
        Task<ProductImageDTO?> GetProductImageByIdAsync(Guid productImageId);
        Task<ProductImage> UpdateProductImageAsync(ProductImage productImage);
        Task DeleteProductImageAsync(ProductImage productImage);




        // HÀM PHỤ
        Task<bool> CheckExistProductVariant(Guid productId, int colorId);
        Task<ProductImage?> FindProductImageByIdAsync(Guid productImageId);
    }
}
