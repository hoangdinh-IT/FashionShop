using AutoMapper;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.API.Services.Interfaces;
using FashionShop.Core.DTOs.Product;
using FashionShop.Core.Entities;
using FashionShop.Core.Exceptions;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.Products;

namespace FashionShop.API.Services.Implements
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public ProductService(IProductRepository productRepository, IMapper mapper, IPhotoService photoService)
        {
            _productRepository = productRepository;
            _mapper = mapper;
            _photoService = photoService;
        }

        public async Task<ProductDTO> CreateProductAsync(CreateProductDTO dto)
        {
            var isExistSlug = await _productRepository.CheckExistSlugAsync(dto.Slug);

            if (isExistSlug) throw new ConflictException("Slug này đã tồn tại, vui lòng chọn tên khác!");

            var newProduct = _mapper.Map<Product>(dto);
            newProduct.Id = Guid.NewGuid();

            if (dto.Thumbnail != null)
            {
                var uploadResult = await _photoService.AddPhotoAsync(dto.Thumbnail);

                if (uploadResult.Error != null) throw new Exception("Lỗi upload ảnh: " + uploadResult.Error.Message);

                newProduct.ThumbnailUrl = uploadResult.SecureUrl.AbsoluteUri; // Lưu link ảnh vào DB
            }

            var createdProduct = await _productRepository.CreateProductAsync(newProduct);
            return _mapper.Map<ProductDTO>(createdProduct);
        }

        public async Task<PagedResult<ProductDTO>> GetPagedProductsAsync(ProductListRequest request)
        {
            return await _productRepository.GetPagedProductsAsync(request);
        }

        public async Task<ProductDTO?> GetProductByIdAsync(Guid productId)
        {
            var product = await _productRepository.GetProductByIdAsync(productId);

            if (product == null) throw new KeyNotFoundException("Không tìm thấy sản phẩm");

            return product;
        }

        public async Task<ProductDTO?> UpdateProductAsync(Guid productId, UpdateProductDTO dto)
        {
            var existingProduct = await _productRepository.FindProductByIdAsync(productId);

            if (existingProduct == null) throw new KeyNotFoundException("Không tìm thấy sản phẩm");

            if (dto.Slug != existingProduct.Slug)
            {
                var isExistSlug = await _productRepository.CheckExistSlugAsync(dto.Slug);

                if (isExistSlug) throw new ConflictException("Slug này đã tồn tại, vui lòng chọn tên khác!");
            }

            _mapper.Map(dto, existingProduct);
            existingProduct.UpdatedDate = DateTime.UtcNow;

            if (dto.Thumbnail != null)
            {
                // 1. Kiểm tra nếu ảnh cũ tồn tại thì Xóa đi
                if (!string.IsNullOrEmpty(existingProduct.ThumbnailUrl))
                {
                    try
                    {
                        var publicId = _photoService.GetPublicIdFromUrl(existingProduct.ThumbnailUrl);
                        await _photoService.DeletePhotoAsync(publicId);
                    }
                    catch (Exception ex)
                    {
                        throw new Exception("Lỗi xóa ảnh cũ: " + ex.Message);
                    }
                }

                // 2. Upload ảnh mới
                var uploadResult = await _photoService.AddPhotoAsync(dto.Thumbnail);

                if (uploadResult.Error != null) throw new Exception(uploadResult.Error.Message);

                existingProduct.ThumbnailUrl = uploadResult.SecureUrl.AbsoluteUri;
            }

            await _productRepository.UpdateProductAsync(existingProduct);
            return await _productRepository.GetProductByIdAsync(productId);
        }

        public async Task DeleteProductAsync(Guid productId)
        {
            var existingProduct = await _productRepository.FindProductByIdAsync(productId);

            if (existingProduct == null) throw new KeyNotFoundException("Không tìm thấy sản phẩm");

            if (!string.IsNullOrEmpty(existingProduct.ThumbnailUrl))
            {
                try
                {
                    var publicId = _photoService.GetPublicIdFromUrl(existingProduct.ThumbnailUrl);
                    await _photoService.DeletePhotoAsync(publicId);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi xóa ảnh cũ: " + ex.Message);
                }
            }

            await _productRepository.DeleteProductAsync(existingProduct);
        }
    }
}
