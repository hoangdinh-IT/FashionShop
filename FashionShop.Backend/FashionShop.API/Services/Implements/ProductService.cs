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
using static System.Net.Mime.MediaTypeNames;

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

        public async Task<ProductDetailDTO?> GetProductDetailByIdAsync(Guid productId)
        {
            var productDetail = await _productRepository.GetProductDetailByIdAsync(productId);

            if (productDetail == null) throw new KeyNotFoundException("Không tìm thấy sản phẩm");

            return productDetail;
        }

        // --- WRITE METHODS --- //
        public async Task<ProductDTO?> CreateProductAsync(CreateProductDTO dto)
        {
            var isExistSlug = await _productRepository.CheckExistSlugAsync(dto.Slug);

            if (isExistSlug) throw new ConflictException("Slug này đã tồn tại, vui lòng chọn tên khác!");

            var newProduct = _mapper.Map<Product>(dto);

            if (dto.Thumbnail != null)
            {
                var uploadResult = await _photoService.AddPhotoAsync(dto.Thumbnail);

                if (uploadResult.Error != null) throw new Exception("Lỗi upload ảnh: " + uploadResult.Error.Message);

                newProduct.ThumbnailUrl = uploadResult.SecureUrl.AbsoluteUri; // Lưu link ảnh vào DB
            }

            var createdProduct = await _productRepository.CreateProductAsync(newProduct);
            return _mapper.Map<ProductDTO>(createdProduct);
        }

        public async Task<ProductDetailDTO?> CreateProductDetailAsync(CreateProductDetailDTO dto)
        {
            using var transaction = await _productRepository.BeginTransactionAsync();

            try
            {
                var createdProduct = await CreateProductAsync(dto);

                if (dto.ProductVariants != null && dto.ProductVariants.Any())
                {
                    foreach (var variantDto in dto.ProductVariants)
                    {
                        variantDto.ProductId = createdProduct!.Id;

                        await CreateProductVariantAsync(variantDto);
                    }
                }

                await transaction.CommitAsync();

                return await GetProductDetailByIdAsync(createdProduct!.Id);
            } 
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
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

        public async Task<ProductDetailDTO?> UpdateProductDetailAsync(Guid productId, UpdateProductDetailDTO dto)
        {
            using var transaction = await _productRepository.BeginTransactionAsync();

            try
            {
                var updatedProduct = await UpdateProductAsync(productId, dto);

                var existingProductVariants = await _productRepository.GetProductVariantsByProductIdAsync(productId);

                var inputIDs = dto.ProductVariants
                                  .Where(v => v.Id.HasValue)
                                  .Select(v => v.Id!.Value)
                                  .ToList();

                foreach (var variantDto in dto.ProductVariants)
                {
                    // TH1: THÊM MỚI
                    if (!variantDto.Id.HasValue)
                    {
                        var newVariant = _mapper.Map<CreateProductVariantDTO>(variantDto);
                        newVariant.ProductId = productId;
                        await CreateProductVariantAsync(newVariant);
                    } 
                    // TH2: CẬP NHẬT
                    else
                    {
                        await UpdateProductVariantAsync(variantDto.Id.Value, variantDto);
                    }
                }

                // TH3: XOÁ
                var variantsToDelete = existingProductVariants.Where(v => !inputIDs.Contains(v.Id)).ToList();
                foreach (var variantDto in variantsToDelete)
                {
                    await DeleteProductVariantAsync(variantDto.Id);
                }

                await transaction.CommitAsync();

                return await GetProductDetailByIdAsync(productId);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
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

        public async Task DeleteProductDetailAsync(Guid productId)
        {
            using var transaction = await _productRepository.BeginTransactionAsync();

            try
            {
                var existingVariants = await GetProductVariantsByProductIdAsync(productId);

                await DeleteProductAsync(productId);

                foreach (var variant in existingVariants)
                {
                    await DeleteProductVariantAsync(variant.Id);
                }

                await transaction.CommitAsync();
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
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

        public async Task<List<ProductVariantDTO>> GetProductVariantsByProductIdAsync(Guid productId)
        {
            var productVariants = await _productRepository.GetProductVariantsByProductIdAsync(productId);

            return productVariants;
        }

        // --- WRITE METHODS --- //
        public async Task<ProductVariantDTO> CreateProductVariantAsync(CreateProductVariantDTO dto)
        {
            var isExistSKU = await _productRepository.CheckExistSKUAsync(dto.SKU);

            if (isExistSKU) throw new ConflictException("SKU này đã tồn tại, vui lòng chọn tên khác!");

            var newProductVariant = _mapper.Map<ProductVariant>(dto);

            var createdProductVariant = await _productRepository.CreateProductVariantAsync(newProductVariant);
            return _mapper.Map<ProductVariantDTO>(createdProductVariant);
        }

        public async Task<ProductVariantDTO?> UpdateProductVariantAsync(Guid productVariantId, UpdateProductVariantDTO dto)
        {
            var existingProductVariant = await _productRepository.FindProductVariantByIdAsync(productVariantId);

            if (existingProductVariant == null) throw new KeyNotFoundException("Không tìm thấy biến thể sản phẩm");

            if (dto.sku != existingProductVariant.SKU)
            {
                var isExistSKU = await _productRepository.CheckExistSKUAsync(dto.sku);

                if (isExistSKU) throw new ConflictException("SKU này đã tồn tại, vui lòng chọn tên khác!");
            }

            _mapper.Map(dto, existingProductVariant);
            existingProductVariant.UpdatedDate = DateTime.UtcNow;

            await _productRepository.UpdateProductVariantAsync(existingProductVariant);
            return await _productRepository.GetProductVariantByIdAsync(productVariantId);
        }

        public async Task DeleteProductVariantAsync(Guid productVariantId)
        {
            var existingProductVariant = await _productRepository.FindProductVariantByIdAsync(productVariantId);

            if (existingProductVariant == null) throw new KeyNotFoundException("Không tìm thấy biến thể sản phẩm");

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
        public async Task<List<ProductImageDTO>> CreateProductImageAsync(CreateProductImageDTO dto)
        {
            if (dto.ColorId.HasValue)
            {
                var isExistProductVariant = await _productRepository.CheckExistProductVariant(dto.ProductId, dto.ColorId.Value);

                if (!isExistProductVariant) throw new Exception("Lỗi: Bạn không thể upload ảnh màu này vì chưa có biến thể sản phẩm (Variant) tương ứng!");
            }

            var listImages = new List<ProductImageDTO>();

            var currentMaxSortOrder = await _productRepository.GetMaxSortOrder(dto.ProductId, dto.ColorId!.Value);

            for (int i = 0; i < dto.Images.Count; i++)
            {
                var uploadResult = await _photoService.AddPhotoAsync(dto.Images[i]);

                if (uploadResult.Error != null) throw new Exception("Lỗi upload ảnh: " + uploadResult.Error.Message);

                var newImage = new ProductImage
                {
                    ProductId = dto.ProductId,
                    ColorId = dto.ColorId,
                    ImageUrl = uploadResult.SecureUrl.AbsoluteUri,
                    SortOrder = currentMaxSortOrder + i + 1,
                };

                var createdProductImage = await _productRepository.CreateProductImageAsync(newImage);

                listImages.Add(_mapper.Map<ProductImageDTO>(createdProductImage));
            }

            return listImages;
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
