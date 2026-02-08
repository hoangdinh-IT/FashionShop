using FashionShop.Core.DTOs.Product;
using FashionShop.Core.Entities;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.Products;

namespace FashionShop.API.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<bool> CheckExistSlugAsync(string slug);
        Task<Product> CreateProductAsync(Product product);
        Task<PagedResult<ProductDTO>> GetPagedProductsAsync(ProductListRequest request);
        Task<ProductDTO?> GetProductByIdAsync(Guid productId);
        Task<Product?> FindProductByIdAsync(Guid productId);
        Task<Product> UpdateProductAsync(Product product);
        Task DeleteProductAsync(Product product);
    }
}
