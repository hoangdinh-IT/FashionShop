using AutoMapper;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.API.Services.Interfaces;
using FashionShop.Core.Contracts.Color.Responses;
using FashionShop.Core.Contracts.Product.Requests;
using FashionShop.Core.Contracts.Product.Responses;
using FashionShop.Core.Contracts.ProductImage.Requests;
using FashionShop.Core.Contracts.ProductImage.Responses;
using FashionShop.Core.Contracts.ProductVariant.Requests;
using FashionShop.Core.Contracts.ProductVariant.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Exceptions;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.Product;
using FashionShop.Core.Models.ProductVariant;
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
        public async Task<PagedResult<ProductResponse>> GetPagedProductsAsync(ProductListRequest request)
            => await _productRepository.GetPagedProductsAsync(request);

        public async Task<ProductResponse?> GetProductByIdAsync(Guid productId)
        {
            var product = await _productRepository.GetProductByIdAsync(productId);

            if (product == null) throw new KeyNotFoundException("Không tìm thấy sản phẩm");

            return product;
        }

        public async Task<ProductDetailResponse?> GetProductDetailByIdAsync(Guid productId)
        {
            var productDetail = await _productRepository.GetProductDetailByIdAsync(productId);

            if (productDetail == null) throw new KeyNotFoundException("Không tìm thấy chi tiết sản phẩm");

            return productDetail;
        }

        public async Task<List<ColorResponse>> GetColorsByProductIdAsync(Guid productId)
        {
            var product = await _productRepository.GetProductByIdAsync(productId);

            if (product == null) throw new KeyNotFoundException("Không tìm thấy sản phẩm");

            return await _productRepository.GetColorsByProductIdAsync(productId);
        }

        // --- WRITE METHODS --- //
        public async Task<ProductResponse?> CreateProductAsync(CreateProductRequest dto)
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
            return _mapper.Map<ProductResponse>(createdProduct);
        }

        public async Task<ProductDetailResponse?> CreateProductDetailAsync(CreateProductDetailRequest dto)
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

        public async Task<ProductResponse?> UpdateProductAsync(Guid productId, UpdateProductRequest dto)
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

        public async Task<ProductDetailResponse?> UpdateProductDetailAsync(Guid productId, UpdateProductDetailRequest dto)
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
                        var newVariant = _mapper.Map<CreateProductVariantRequest>(variantDto);
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
        public async Task<PagedResult<ProductVariantResponse>> GetPagedProductVariantsAsync(ProductVariantListRequest request)
            => await _productRepository.GetPagedProductVariantsAsync(request);

        public async Task<ProductVariantResponse?> GetProductVariantByIdAsync(Guid productVariantId)
        {
            var productVariant = await _productRepository.GetProductVariantByIdAsync(productVariantId);

            if (productVariant == null) throw new KeyNotFoundException("Không tìm thấy biến thể sản phẩm");

            return productVariant;
        }

        public async Task<List<ProductVariantResponse>> GetProductVariantsByProductIdAsync(Guid productId)
        {
            var productVariants = await _productRepository.GetProductVariantsByProductIdAsync(productId);

            return productVariants;
        }

        // --- WRITE METHODS --- //
        public async Task<ProductVariantResponse> CreateProductVariantAsync(CreateProductVariantRequest dto)
        {
            var isExistSKU = await _productRepository.CheckExistSKUAsync(dto.SKU);

            if (isExistSKU) throw new ConflictException("SKU này đã tồn tại, vui lòng chọn tên khác!");

            var newProductVariant = _mapper.Map<ProductVariant>(dto);

            var createdProductVariant = await _productRepository.CreateProductVariantAsync(newProductVariant);
            return _mapper.Map<ProductVariantResponse>(createdProductVariant);
        }

        public async Task<ProductVariantResponse?> UpdateProductVariantAsync(Guid productVariantId, UpdateProductVariantRequest dto)
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
        public async Task<IEnumerable<ProductImageResponse>> GetProductImagesAsync(Guid productId, int? colorId)
        {
            var existingProduct = await _productRepository.FindProductByIdAsync(productId);

            if (existingProduct == null) throw new KeyNotFoundException("Không tìm thấy sản phẩm!");

            return await _productRepository.GetProductImagesAsync(productId, colorId);
        }

        public async Task<ProductImageResponse?> GetProductImageByIdAsync(Guid productImageId)
        {
            var existingProductImage = await _productRepository.FindProductImageByIdAsync(productImageId);

            if (existingProductImage == null) throw new KeyNotFoundException("Không tìm thấy hình ảnh sản phẩm!");

            return await _productRepository.GetProductImageByIdAsync(productImageId);
        }

        // --- WRITE METHODS --- //
        public async Task<List<ProductImageResponse>> CreateProductImageAsync(Guid productId, CreateProductImagesRequest dto)
        {
            if (dto.ColorId.HasValue)
            {
                var isExistProductVariant = await _productRepository.CheckExistProductVariant(productId, dto.ColorId.Value);

                if (!isExistProductVariant) throw new Exception("Lỗi: Bạn không thể upload ảnh màu này vì chưa có biến thể sản phẩm (Variant) tương ứng!");
            }

            var uploadTasks = dto.Images.Select(async (file, index) =>
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

            var listImages = new List<ProductImageResponse>();

            var sortedResults = uploadResults.OrderBy(x => x.Index).ToList();

            var currentMaxSortOrder = await _productRepository.GetMaxSortOrder(productId, dto.ColorId);

            foreach (var result in sortedResults)
            {
                var newImage = new ProductImage
                {
                    ProductId = productId,
                    ColorId = dto.ColorId,
                    ImageUrl = result.ImageUrl,
                    SortOrder = currentMaxSortOrder + result.Index + 1, // SortOrder đánh theo vị trí Index
                };

                var createdProductImage = await _productRepository.CreateProductImageAsync(newImage);
                listImages.Add(_mapper.Map<ProductImageResponse>(createdProductImage));
            }

            return listImages;
        }

        //public async Task<ProductImageResponse?> UpdateProductImageAsync(Guid productImageId, UpdateProductImageRequest dto)
        //{
        //    var existingProductImage = await _productRepository.FindProductImageByIdAsync(productImageId);

        //    if (existingProductImage == null) throw new KeyNotFoundException("Không tìm thấy hình ảnh sản phẩm!");

        //    _mapper.Map(dto, existingProductImage);
        //    existingProductImage.UpdatedDate = DateTime.UtcNow;

        //    await _productRepository.UpdateProductImageAsync(existingProductImage);
        //    return await _productRepository.GetProductImageByIdAsync(productImageId);
        //}

        public async Task<IEnumerable<ProductImageResponse>> UpdateSortOrderAsync(Guid productId, UpdateSortOrderRequest request)
        {
            var existingProduct = await _productRepository.FindProductByIdAsync(productId);

            if (existingProduct == null) throw new KeyNotFoundException("Không tìm thấy sản phẩm!");

            var existingImages = await _productRepository.GetImagesByProductIdAndColorIdAsync(productId, request.ColorId);

            for (var i = 0; i < request.ImageIds.Count; i++)
            {
                var targetImage = existingImages.FirstOrDefault(x => x.Id == request.ImageIds[i]);

                if (targetImage != null)
                {
                    targetImage.SortOrder = i + 1;
                }
            }

            await _productRepository.SaveChangesAsync();

            return await _productRepository.GetProductImagesAsync(productId, request.ColorId);
        }

        public async Task DeleteProductImageAsync(Guid productId, DeleteProductImagesRequest? request)
        {
            var affectedColorIds = new HashSet<int?>();

            if (request?.ImageIds != null && request.ImageIds.Any())
            {
                foreach (var imageId in request.ImageIds)
                {
                    var existingProductImage = await _productRepository.FindProductImageByIdAsync(imageId);

                    if (existingProductImage == null) throw new KeyNotFoundException("Không tìm thấy hình ảnh sản phẩm!");

                    affectedColorIds.Add(existingProductImage.ColorId);

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

                foreach (var colorId in affectedColorIds)
                {
                    var remainingImages = await _productRepository.GetProductImagesForUpdateAsync(productId, colorId);

                    int newSortOrder = 1;
                    foreach (var image in remainingImages)
                    {
                        image.SortOrder = newSortOrder;
                        newSortOrder++;
                    }
                }
            } 
            else
            {
                var productImages = await _productRepository.FindProductImagesAsync(productId);

                foreach (var image in productImages)
                {
                    if (!string.IsNullOrEmpty(image.ImageUrl))
                    {
                        try
                        {
                            var publicId = _photoService.GetPublicIdFromUrl(image.ImageUrl);
                            await _photoService.DeletePhotoAsync(publicId);
                        }
                        catch (Exception ex)
                        {
                            throw new Exception("Lỗi xóa ảnh cũ: " + ex.Message);
                        }
                    }

                    await _productRepository.DeleteProductImageAsync(image);
                }
            }

            await _productRepository.SaveChangesAsync();
        }
        #endregion
    }
}
