using FashionShop.Core.DTOs.Product;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.Products;

namespace FashionShop.API.Services.Interfaces
{
    public interface IProductService
    {
        Task<ProductDTO> CreateProductAsync(CreateProductDTO dto);
        Task<PagedResult<ProductDTO>> GetPagedProductsAsync(ProductListRequest request);
        Task<ProductDTO?> GetProductByIdAsync(Guid productId);
        Task<ProductDTO?> UpdateProductAsync(Guid productId, UpdateProductDTO dto);
        Task DeleteProductAsync(Guid productId);
    }
}
