using AutoMapper;
using FashionShop.API.Repositories.Admin.Interfaces;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Services.Admin.Interfaces;
using FashionShop.API.Services.Shared.Interfaces;
using FashionShop.Core.Contracts.Admin.Color.Responses;
using FashionShop.Core.Contracts.Admin.Product.Requests;
using FashionShop.Core.Contracts.Admin.Product.Responses;
using FashionShop.Core.Contracts.Admin.ProductImage.Requests;
using FashionShop.Core.Contracts.Admin.ProductImage.Responses;
using FashionShop.Core.Contracts.Admin.ProductVariant.Requests;
using FashionShop.Core.Contracts.Admin.ProductVariant.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Exceptions;
using FashionShop.Core.Models;
using static System.Net.Mime.MediaTypeNames;

namespace FashionShop.API.Services.Admin
{
    public class AdminProductService : IAdminProductService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public AdminProductService(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _photoService = photoService;
        }

        #region 1. PRODUCTS



        // --- READ METHODS --- //

        public async Task<PagedResult<AdminProductResponse>> GetPagedProductsAsync(AdminProductListRequest request)
            => await _unitOfWork.AdminProducts.GetPagedProductsAsync(request);

        public async Task<AdminProductResponse?> GetProductByIdAsync(Guid productId)
        {
            var product = await _unitOfWork.AdminProducts.GetProductByIdAsync(productId);

            if (product == null) throw new KeyNotFoundException("Không tìm thấy sản phẩm");

            return product;
        }

        public async Task<AdminProductDetailResponse?> GetProductDetailByIdAsync(Guid productId)
        {
            var productDetail = await _unitOfWork.AdminProducts.GetProductDetailByIdAsync(productId);

            if (productDetail == null) throw new KeyNotFoundException("Không tìm thấy chi tiết sản phẩm");

            return productDetail;
        }

        public async Task<List<AdminColorResponse>> GetColorsByProductIdAsync(Guid productId)
        {
            var product = await _unitOfWork.AdminProducts.GetProductByIdAsync(productId);

            if (product == null) throw new KeyNotFoundException("Không tìm thấy sản phẩm");

            return await _unitOfWork.AdminProducts.GetColorsByProductIdAsync(productId);
        }



        // --- WRITE METHODS --- //

        public async Task<AdminProductResponse?> CreateProductAsync(CreateProductRequest request)
        {
            var isExistSlug = await _unitOfWork.AdminProducts.CheckExistSlugAsync(request.Slug);

            if (isExistSlug) throw new ConflictException("Slug này đã tồn tại, vui lòng chọn tên khác!");

            var newProduct = _mapper.Map<Product>(request);

            if (request.Thumbnail != null)
            {
                var uploadResult = await _photoService.AddPhotoAsync(request.Thumbnail);

                if (uploadResult.Error != null) throw new Exception("Lỗi upload ảnh: " + uploadResult.Error.Message);

                newProduct.ThumbnailUrl = uploadResult.SecureUrl.AbsoluteUri; // Lưu link ảnh vào DB
            }

            _unitOfWork.AdminProducts.CreateProduct(newProduct);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<AdminProductResponse>(newProduct);
        }

        public async Task<AdminProductDetailResponse?> CreateProductDetailAsync(CreateProductDetailRequest request)
        {
            //await _unitOfWork.BeginTransactionAsync();

            //try
            //{
            //    var createdProduct = await CreateProductAsync(request);

            //    if (request.ProductVariants != null && request.ProductVariants.Any())
            //    {
            //        foreach (var variantrequest in request.ProductVariants)
            //        {
            //            variantrequest.ProductId = createdProduct!.Id;

            //            await CreateProductVariantAsync(variantrequest);
            //        }
            //    }

            //    await _unitOfWork.CommitTransactionAsync();

            //    return await GetProductDetailByIdAsync(createdProduct!.Id);
            //} 
            //catch (Exception)
            //{
            //    await _unitOfWork.RollbackTransactionAsync();
            //    throw;
            //}

            string? uploadedImagePublicId = null;

            try
            {
                var newProduct = _mapper.Map<Product>(request);

                if (request.Thumbnail != null)
                {
                    var uploadResult = await _photoService.AddPhotoAsync(request.Thumbnail);

                    if (uploadResult.Error != null)
                        throw new Exception("Lỗi upload ảnh: " + uploadResult.Error.Message);

                    uploadedImagePublicId = uploadResult.PublicId; 

                    newProduct.ThumbnailUrl = uploadResult.SecureUrl.AbsoluteUri;
                }

                _unitOfWork.AdminProducts.CreateProduct(newProduct);
                await _unitOfWork.SaveChangesAsync();

                return await GetProductDetailByIdAsync(newProduct.Id);
            }
            catch (Exception)
            {
                if (!string.IsNullOrEmpty(uploadedImagePublicId))
                {
                    try
                    {
                        await _photoService.DeletePhotoAsync(uploadedImagePublicId);
                    }
                    catch { }
                }

                throw; 
            }
        }

        public async Task<AdminProductResponse?> UpdateProductAsync(Guid productId, UpdateProductRequest request)
        {
            var existingProduct = await _unitOfWork.AdminProducts.FindProductByIdAsync(productId);

            if (existingProduct == null) throw new KeyNotFoundException("Không tìm thấy sản phẩm");

            if (request.Slug != existingProduct.Slug)
            {
                var isExistSlug = await _unitOfWork.AdminProducts.CheckExistSlugAsync(request.Slug);

                if (isExistSlug) throw new ConflictException("Slug này đã tồn tại, vui lòng chọn tên khác!");
            }

            _mapper.Map(request, existingProduct);
            existingProduct.UpdatedDate = DateTime.UtcNow;

            if (request.Thumbnail != null)
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
                var uploadResult = await _photoService.AddPhotoAsync(request.Thumbnail);

                if (uploadResult.Error != null) throw new Exception(uploadResult.Error.Message);

                existingProduct.ThumbnailUrl = uploadResult.SecureUrl.AbsoluteUri;
            }

            await _unitOfWork.SaveChangesAsync();
            return await _unitOfWork.AdminProducts.GetProductByIdAsync(productId);
        }

        //public async Task<AdminProductDetailResponse?> UpdateProductDetailAsync(Guid productId, UpdateProductDetailRequest request)
        //{
        //    using var transaction = await _unitOfWork.AdminProducts.BeginTransactionAsync();

        //    try
        //    {
        //        var updatedProduct = await UpdateProductAsync(productId, request);

        //        var existingProductVariants = await _unitOfWork.AdminProducts.GetProductVariantsByProductIdAsync(productId);

        //        var inputIDs = request.ProductVariants
        //                          .Where(v => v.Id.HasValue)
        //                          .Select(v => v.Id!.Value)
        //                          .ToList();

        //        foreach (var variantrequest in request.ProductVariants)
        //        {
        //            // TH1: THÊM MỚI
        //            if (!variantrequest.Id.HasValue)
        //            {
        //                var newVariant = _mapper.Map<CreateProductVariantRequest>(variantrequest);
        //                newVariant.ProductId = productId;
        //                await CreateProductVariantAsync(newVariant);
        //            }
        //            // TH2: CẬP NHẬT
        //            else
        //            {
        //                await UpdateProductVariantAsync(variantrequest.Id.Value, variantrequest);
        //            }
        //        }

        //        // TH3: XOÁ
        //        var variantsToDelete = existingProductVariants.Where(v => !inputIDs.Contains(v.Id)).ToList();
        //        foreach (var variantrequest in variantsToDelete)
        //        {
        //            await DeleteProductVariantAsync(variantrequest.Id);
        //        }

        //        await transaction.CommitAsync();

        //        return await GetProductDetailByIdAsync(productId);
        //    }
        //    catch (Exception)
        //    {
        //        await transaction.RollbackAsync();
        //        throw;
        //    }
        //}

        public async Task<AdminProductDetailResponse?> UpdateProductDetailAsync(Guid productId, UpdateProductDetailRequest request)
        {
            // Biến tạm để xử lý rác hình ảnh (nếu Product có update ảnh)
            string? oldThumbnailPublicId = null;

            // Biến lưu ID ảnh mới để xóa (rollback) nếu DB CẬP NHẬT LỖI
            string? newThumbnailPublicId = null;

            // 1. Lấy Product kèm theo toàn bộ Variants hiện có từ DB lên bộ nhớ
            var existingProduct = await _unitOfWork.AdminProducts.FindProductDetailByIdAsync(productId);
            if (existingProduct == null) throw new KeyNotFoundException("Không tìm thấy sản phẩm!");

            try
            {
                // 2. CẬP NHẬT THÔNG TIN CƠ BẢN CỦA PRODUCT (Map từ Request sang Entity)
                _mapper.Map(request, existingProduct);
                existingProduct.UpdatedDate = DateTime.UtcNow;

                if (request.Thumbnail != null)
                {
                    var uploadResult = await _photoService.AddPhotoAsync(request.Thumbnail);

                    if (uploadResult.Error != null)
                        throw new Exception("Lỗi upload ảnh: " + uploadResult.Error.Message);

                    // Lưu ID ảnh mới để phòng hờ DB lỗi
                    newThumbnailPublicId = uploadResult.PublicId;

                    // Lấy ID ảnh cũ (nếu có) cất đi để chuẩn bị dọn rác sau
                    if (!string.IsNullOrEmpty(existingProduct.ThumbnailUrl))
                    {
                        oldThumbnailPublicId = _photoService.GetPublicIdFromUrl(existingProduct.ThumbnailUrl);
                    }

                    // Gán URL mới vào Entity
                    existingProduct.ThumbnailUrl = uploadResult.SecureUrl.AbsoluteUri;
                }

                // 3. XỬ LÝ DANH SÁCH BIẾN THỂ (VARIANTS)
                var inputVariantIds = request.ProductVariants
                                             .Where(v => v.Id.HasValue)
                                             .Select(v => v.Id!.Value)
                                             .ToList();

                // TH 1: XÓA (Có trong DB nhưng không có trong Request)
                var variantsToDelete = existingProduct.ProductVariants
                                                      .Where(v => !inputVariantIds.Contains(v.Id))
                                                      .ToList();
                foreach (var variant in variantsToDelete)
                {
                    _unitOfWork.AdminProducts.DeleteProductVariant(variant); 
                }

                foreach (var variantRequest in request.ProductVariants)
                {
                    // TH 2: THÊM MỚI (Không có Id)
                    if (!variantRequest.Id.HasValue)
                    {
                        var newVariant = _mapper.Map<ProductVariant>(variantRequest);
                        newVariant.ProductId = productId;
                        _unitOfWork.AdminProducts.CreateProductVariant(newVariant); 
                    }
                    // TH 3: CẬP NHẬT (Có Id)
                    else
                    {
                        var existingVariant = await _unitOfWork.AdminProducts.FindProductVariantByIdAsync(variantRequest.Id.Value);
                        //if (existingVariant != null)
                        //{
                        //    _mapper.Map(variantRequest, existingVariant);
                        //    existingVariant.UpdatedDate = DateTime.UtcNow;
                        //}

                        if (existingVariant == null) throw new KeyNotFoundException("Không tìm thấy biến thể sản phẩm!");

                        if (variantRequest.Sku != existingVariant.Sku)
                        {
                            var isExistSKU = await _unitOfWork.AdminProducts.CheckExistSKUAsync(variantRequest.Sku);

                            if (isExistSKU) throw new ConflictException("SKU này đã tồn tại, vui lòng chọn tên khác!");
                        }

                        _mapper.Map(variantRequest, existingVariant);
                        existingVariant.UpdatedDate = DateTime.UtcNow;
                    }
                }

                await _unitOfWork.SaveChangesAsync();

                return await GetProductDetailByIdAsync(productId);
            }
            catch (Exception)
            {
                // Rollback ảnh mới upload nếu lưu DB lỗi (Nếu có)
                // ...
                throw;
            }
        }

        public async Task DeleteProductAsync(Guid productId)
        {
            var existingProduct = await _unitOfWork.AdminProducts.FindProductByIdAsync(productId);

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

            _unitOfWork.AdminProducts.DeleteProduct(existingProduct);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteProductDetailAsync(Guid productId)
        {
            // 1. Lấy Product kèm List Variants (Phải dùng Include() trong Repository)
            var existingProduct = await _unitOfWork.AdminProducts.FindProductDetailByIdAsync(productId);

            if (existingProduct == null) throw new KeyNotFoundException("Không tìm thấy sản phẩm!");

            // 2. Thay đổi trạng thái thành "Đã xóa" trong RAM
            // Xóa Product (Soft delete)
            _unitOfWork.AdminProducts.DeleteProduct(existingProduct);

            // Xóa tất cả Variants (Soft delete)
            foreach (var variant in existingProduct.ProductVariants)
            {
                _unitOfWork.AdminProducts.DeleteProductVariant(variant);
            }

            // 3. LƯU DATABASE (Chỉ 1 câu lệnh xuống DB)
            // Tự động gom vào Transaction an toàn tuyệt đối
            await _unitOfWork.SaveChangesAsync();
        }
        #endregion


        #region 2. PRODUCT VARIANTS



        // --- READ METHODS --- //

        //public async Task<PagedResult<ProductVariantResponse>> GetPagedProductVariantsAsync(ProductVariantListRequest request)
        //    => await _unitOfWork.AdminProducts.GetPagedProductVariantsAsync(request);

        public async Task<AdminProductVariantResponse?> GetProductVariantByIdAsync(Guid productVariantId)
        {
            var productVariant = await _unitOfWork.AdminProducts.GetProductVariantByIdAsync(productVariantId);

            if (productVariant == null) throw new KeyNotFoundException("Không tìm thấy biến thể sản phẩm");

            return productVariant;
        }

        public async Task<List<AdminProductVariantResponse>> GetProductVariantsByProductIdAsync(Guid productId)
        {
            var productVariants = await _unitOfWork.AdminProducts.GetProductVariantsByProductIdAsync(productId);

            return productVariants;
        }



        // --- WRITE METHODS --- //

        public async Task<AdminProductVariantResponse> CreateProductVariantAsync(CreateProductVariantRequest request)
        {
            var isExistSKU = await _unitOfWork.AdminProducts.CheckExistSKUAsync(request.SKU);

            if (isExistSKU) throw new ConflictException("SKU này đã tồn tại, vui lòng chọn tên khác!");

            var newProductVariant = _mapper.Map<ProductVariant>(request);

            _unitOfWork.AdminProducts.CreateProductVariant(newProductVariant);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<AdminProductVariantResponse>(newProductVariant);
        }

        public async Task<AdminProductVariantResponse?> UpdateProductVariantAsync(Guid productVariantId, UpdateProductVariantRequest request)
        {
            var existingProductVariant = await _unitOfWork.AdminProducts.FindProductVariantByIdAsync(productVariantId);

            if (existingProductVariant == null) throw new KeyNotFoundException("Không tìm thấy biến thể sản phẩm");

            if (request.Sku != existingProductVariant.Sku)
            {
                var isExistSKU = await _unitOfWork.AdminProducts.CheckExistSKUAsync(request.Sku);

                if (isExistSKU) throw new ConflictException("SKU này đã tồn tại, vui lòng chọn tên khác!");
            }

            _mapper.Map(request, existingProductVariant);
            existingProductVariant.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync();
            return await _unitOfWork.AdminProducts.GetProductVariantByIdAsync(productVariantId);
        }

        public async Task DeleteProductVariantAsync(Guid productVariantId)
        {
            var existingProductVariant = await _unitOfWork.AdminProducts.FindProductVariantByIdAsync(productVariantId);

            if (existingProductVariant == null) throw new KeyNotFoundException("Không tìm thấy biến thể sản phẩm");

            _unitOfWork.AdminProducts.DeleteProductVariant(existingProductVariant);
            await _unitOfWork.SaveChangesAsync();
        }
        #endregion


        #region 3. PRODUCT IMAGES



        // --- READ METHODS --- //

        public async Task<IEnumerable<AdminProductImageResponse>> GetProductImagesAsync(Guid productId, int? colorId)
        {
            var existingProduct = await _unitOfWork.AdminProducts.FindProductByIdAsync(productId);

            if (existingProduct == null) throw new KeyNotFoundException("Không tìm thấy sản phẩm!");

            return await _unitOfWork.AdminProducts.GetProductImagesAsync(productId, colorId);
        }

        public async Task<AdminProductImageResponse?> GetProductImageByIdAsync(Guid productImageId)
        {
            var existingProductImage = await _unitOfWork.AdminProducts.FindProductImageByIdAsync(productImageId);

            if (existingProductImage == null) throw new KeyNotFoundException("Không tìm thấy hình ảnh sản phẩm!");

            return await _unitOfWork.AdminProducts.GetProductImageByIdAsync(productImageId);
        }



        // --- WRITE METHODS --- //

        public async Task<List<AdminProductImageResponse>> CreateProductImageAsync(Guid productId, CreateProductImagesRequest request)
        {
            if (request.ColorId.HasValue)
            {
                var isExistProductVariant = await _unitOfWork.AdminProducts.CheckExistProductVariant(productId, request.ColorId.Value);

                if (!isExistProductVariant) throw new Exception("Lỗi: Bạn không thể upload ảnh màu này vì chưa có biến thể sản phẩm (Variant) tương ứng!");
            }

            var uploadTasks = request.Images.Select(async (file, index) =>
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

            var listImages = new List<AdminProductImageResponse>();

            var sortedResults = uploadResults.OrderBy(x => x.Index).ToList();

            var currentMaxSortOrder = await _unitOfWork.AdminProducts.GetMaxSortOrder(productId, request.ColorId);

            foreach (var result in sortedResults)
            {
                var newImage = new ProductImage
                {
                    ProductId = productId,
                    ColorId = request.ColorId,
                    ImageUrl = result.ImageUrl,
                    SortOrder = currentMaxSortOrder + result.Index + 1, // SortOrder đánh theo vị trí Index
                };

                _unitOfWork.AdminProducts.CreateProductImage(newImage);
                await _unitOfWork.SaveChangesAsync();
                listImages.Add(_mapper.Map<AdminProductImageResponse>(newImage));
            }

            return listImages;
        }

        public async Task<IEnumerable<AdminProductImageResponse>> UpdateSortOrderAsync(Guid productId, UpdateSortOrderRequest request)
        {
            var existingProduct = await _unitOfWork.AdminProducts.FindProductByIdAsync(productId);

            if (existingProduct == null) throw new KeyNotFoundException("Không tìm thấy sản phẩm!");

            var existingImages = await _unitOfWork.AdminProducts.GetImagesByProductIdAndColorIdAsync(productId, request.ColorId);

            for (var i = 0; i < request.ImageIds.Count; i++)
            {
                var targetImage = existingImages.FirstOrDefault(x => x.Id == request.ImageIds[i]);

                if (targetImage != null)
                {
                    targetImage.SortOrder = i + 1;
                }
            }

            await _unitOfWork.SaveChangesAsync();

            return await _unitOfWork.AdminProducts.GetProductImagesAsync(productId, request.ColorId);
        }

        public async Task DeleteProductImageAsync(Guid productId, DeleteProductImagesRequest? request)
        {
            var affectedColorIds = new HashSet<int?>();

            if (request?.ImageIds != null && request.ImageIds.Any())
            {
                foreach (var imageId in request.ImageIds)
                {
                    var existingProductImage = await _unitOfWork.AdminProducts.FindProductImageByIdAsync(imageId);

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

                    _unitOfWork.AdminProducts.DeleteProductImage(existingProductImage);
                }

                foreach (var colorId in affectedColorIds)
                {
                    var remainingImages = await _unitOfWork.AdminProducts.GetProductImagesForUpdateAsync(productId, colorId);

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
                var productImages = await _unitOfWork.AdminProducts.FindProductImagesAsync(productId);

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

                    _unitOfWork.AdminProducts.DeleteProductImage(image);
                }
            }

            await _unitOfWork.SaveChangesAsync();
        }
        #endregion
    }
}
