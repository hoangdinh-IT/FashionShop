using AutoMapper;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.API.Services.Interfaces;
using FashionShop.Core.DTOs.Product;
using FashionShop.Core.DTOs.ProductImage;
using FashionShop.Core.DTOs.ProductVariant;
using FashionShop.Core.Entities;
using FashionShop.Core.Exceptions;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.Products;
using FashionShop.Core.Models.ProductVariants;

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

        #region 1. PRODUCTS

        // --- READ METHODS --- //
        public async Task<PagedResult<ProductDTO>> GetPagedProductsAsync(ProductListRequest request)
            => await _productRepository.GetPagedProductsAsync(request);

        public async Task<ProductDTO?> GetProductByIdAsync(Guid productId)
        {
            var product = await _productRepository.GetProductByIdAsync(productId);

            if (product == null) throw new KeyNotFoundException("Không tìm thấy sản phẩm");

            return product;
        }

        // --- WRITE METHODS --- //
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
        #endregion


        #region 2. PRODUCT VARIANTS

        // --- READ METHODS --- //
        public async Task<PagedResult<ProductVariantDTO>> GetPagedProductVariantsAsync(ProductVariantListRequest request)
            => await _productRepository.GetPagedProductVariantsAsync(request);

        public async Task<ProductVariantDTO?> GetProductVariantByIdAsync(Guid productVariantId)
        {
            var productVariant = await _productRepository.GetProductVariantByIdAsync(productVariantId);

            if (productVariant == null) throw new KeyNotFoundException("Không tìm thấy biến thể sản phẩm");

            return productVariant;
        }

        // --- WRITE METHODS --- //
        public async Task<ProductVariantDTO> CreateProductVariantAsync(CreateProductVariantDTO dto)
        {
            var isExistSKU = await _productRepository.CheckExistSKUAsync(dto.SKU);

            if (isExistSKU) throw new ConflictException("SKU này đã tồn tại, vui lòng chọn tên khác!");

            var newProductVariant = _mapper.Map<ProductVariant>(dto);
            newProductVariant.Id = Guid.NewGuid();

            if (dto.VariantImage != null)
            {
                var uploadResult = await _photoService.AddPhotoAsync(dto.VariantImage);

                if (uploadResult.Error != null) throw new Exception("Lỗi upload ảnh: " + uploadResult.Error.Message);

                newProductVariant.VariantImageUrl = uploadResult.SecureUrl.AbsoluteUri; // Lưu link ảnh vào DB
            }

            var createdProductVariant = await _productRepository.CreateProductVariantAsync(newProductVariant);
            return _mapper.Map<ProductVariantDTO>(createdProductVariant);
        }

        public async Task<ProductVariantDTO?> UpdateProductVariantAsync(Guid productVariantId, UpdateProductVariantDTO dto)
        {
            var existingProductVariant = await _productRepository.FindProductVariantByIdAsync(productVariantId);

            if (existingProductVariant == null) throw new KeyNotFoundException("Không tìm thấy biến thể sản phẩm");

            if (dto.SKU != existingProductVariant.SKU)
            {
                var isExistSKU = await _productRepository.CheckExistSKUAsync(dto.SKU);

                if (isExistSKU) throw new ConflictException("SKU này đã tồn tại, vui lòng chọn tên khác!");
            }

            _mapper.Map(dto, existingProductVariant);
            existingProductVariant.UpdatedDate = DateTime.UtcNow;

            if (dto.VariantImage != null)
            {
                // 1. Kiểm tra nếu ảnh cũ tồn tại thì Xóa đi
                if (!string.IsNullOrEmpty(existingProductVariant.VariantImageUrl))
                {
                    try
                    {
                        var publicId = _photoService.GetPublicIdFromUrl(existingProductVariant.VariantImageUrl);
                        await _photoService.DeletePhotoAsync(publicId);
                    }
                    catch (Exception ex)
                    {
                        throw new Exception("Lỗi xóa ảnh cũ: " + ex.Message);
                    }
                }

                // 2. Upload ảnh mới
                var uploadResult = await _photoService.AddPhotoAsync(dto.VariantImage);

                if (uploadResult.Error != null) throw new Exception(uploadResult.Error.Message);

                existingProductVariant.VariantImageUrl = uploadResult.SecureUrl.AbsoluteUri;
            }

            await _productRepository.UpdateProductVariantAsync(existingProductVariant);
            return await _productRepository.GetProductVariantByIdAsync(productVariantId);
        }

        public async Task DeleteProductVariantAsync(Guid productVariantId)
        {
            var existingProductVariant = await _productRepository.FindProductVariantByIdAsync(productVariantId);

            if (existingProductVariant == null) throw new KeyNotFoundException("Không tìm thấy biến thể sản phẩm");

            if (!string.IsNullOrEmpty(existingProductVariant.VariantImageUrl))
            {
                try
                {
                    var publicId = _photoService.GetPublicIdFromUrl(existingProductVariant.VariantImageUrl);
                    await _photoService.DeletePhotoAsync(publicId);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi xóa ảnh cũ: " + ex.Message);
                }
            }

            await _productRepository.DeleteProductVariantAsync(existingProductVariant);
        }
        #endregion


        #region 3. PRODUCT IMAGES

        // --- READ METHODS --- //
        public async Task<IEnumerable<ProductImageDTO>> GetProductImagesAsync(Guid productId, int? colorId)
        {
            var existingProduct = await _productRepository.FindProductByIdAsync(productId);

            if (existingProduct == null) throw new KeyNotFoundException("Không tìm thấy sản phẩm!");

            return await _productRepository.GetProductImagesAsync(productId, colorId);
        }

        public async Task<ProductImageDTO?> GetProductImageByIdAsync(Guid productImageId)
        {
            var existingProductImage = await _productRepository.FindProductImageByIdAsync(productImageId);

            if (existingProductImage == null) throw new KeyNotFoundException("Không tìm thấy hình ảnh sản phẩm!");

            return await _productRepository.GetProductImageByIdAsync(productImageId);
        }

        // --- WRITE METHODS --- //
        public async Task<ProductImageDTO> CreateProductImageAsync(CreateProductImageDTO dto)
        {
            var newProductImage = _mapper.Map<ProductImage>(dto);
            newProductImage.Id = Guid.NewGuid();

            if (dto.ColorId.HasValue)
            {
                var isExistProductVariant = await _productRepository.CheckExistProductVariant(dto.ProductId, dto.ColorId.Value);

                if (!isExistProductVariant) throw new Exception("Lỗi: Bạn không thể upload ảnh màu này vì chưa có biến thể sản phẩm (Variant) tương ứng!");
            }

            if (dto.Image != null)
            {
                var uploadResult = await _photoService.AddPhotoAsync(dto.Image);

                if (uploadResult.Error != null) throw new Exception("Lỗi upload ảnh: " + uploadResult.Error.Message);

                newProductImage.ImageUrl = uploadResult.SecureUrl.AbsoluteUri; // Lưu link ảnh vào DB
            }

            var createdProductImage = await _productRepository.CreateProductImageAsync(newProductImage);
            return _mapper.Map<ProductImageDTO>(createdProductImage);
        }

        public async Task<ProductImageDTO?> UpdateProductImageAsync(Guid productImageId, UpdateProductImageDTO dto)
        {
            var existingProductImage = await _productRepository.FindProductImageByIdAsync(productImageId);

            if (existingProductImage == null) throw new KeyNotFoundException("Không tìm thấy hình ảnh sản phẩm!");

            _mapper.Map(dto, existingProductImage);
            existingProductImage.UpdatedDate = DateTime.UtcNow;

            await _productRepository.UpdateProductImageAsync(existingProductImage);
            return await _productRepository.GetProductImageByIdAsync(productImageId);
        }

        public async Task DeleteProductImageAsync(Guid productImageId)
        {
            var existingProductImage = await _productRepository.FindProductImageByIdAsync(productImageId);

            if (existingProductImage == null) throw new KeyNotFoundException("Không tìm thấy hình ảnh sản phẩm!");

            if (!string.IsNullOrEmpty(existingProductImage.ImageUrl))
            {
                try
                {
                    var publicId = _photoService.GetPublicIdFromUrl(existingProductImage.ImageUrl);
                    await _photoService.DeletePhotoAsync(publicId);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi xóa ảnh cũ: " + ex.Message);
                }
            }

            await _productRepository.DeleteProductImageAsync(existingProductImage);
        }
        #endregion
    }
}
