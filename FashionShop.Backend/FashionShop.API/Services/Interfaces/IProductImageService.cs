using FashionShop.Core.DTOs.ProductImage;

namespace FashionShop.API.Services.Interfaces
{
    public interface IProductImageService
    {
        Task<ProductImageDTO> CreateProductImageAsync(CreateProductImageDTO dto);
        Task<IEnumerable<ProductImageDTO>> GetProductImagesAsync(Guid productId, int? colorId);
        Task<ProductImageDTO?> GetProductImageByIdAsync(Guid productImageId);
        Task<ProductImageDTO?> UpdateProductImageAsync(Guid productImageId, UpdateProductImageDTO dto);
        Task DeleteProductImageAsync(Guid productImageId);
    }
}
