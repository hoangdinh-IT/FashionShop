using AutoMapper;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.API.Services.Interfaces;
using FashionShop.Core.DTOs.ProductVariant;
using FashionShop.Core.Entities;
using FashionShop.Core.Exceptions;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.ProductVariants;

namespace FashionShop.API.Services.Implements
{
    public class ProductVariantService : IProductVariantService
    {
        private readonly IProductVariantRepository _productVariantRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public ProductVariantService(IProductVariantRepository productVariantRepository, IMapper mapper, IPhotoService photoService)
        {
            _productVariantRepository = productVariantRepository;
            _mapper = mapper;
            _photoService = photoService;
        }

        public async Task<ProductVariantDTO> CreateProductVariantAsync(CreateProductVariantDTO dto)
        {
            var isExistSKU = await _productVariantRepository.CheckExistSKUAsync(dto.SKU);

            if (isExistSKU) throw new ConflictException("SKU này đã tồn tại, vui lòng chọn tên khác!");

            var newProductVariant = _mapper.Map<ProductVariant>(dto);
            newProductVariant.Id = Guid.NewGuid();

            if (dto.VariantImage != null)
            {
                var uploadResult = await _photoService.AddPhotoAsync(dto.VariantImage);

                if (uploadResult.Error != null) throw new Exception("Lỗi upload ảnh: " + uploadResult.Error.Message);

                newProductVariant.VariantImageUrl = uploadResult.SecureUrl.AbsoluteUri; // Lưu link ảnh vào DB
            }

            var createdProductVariant = await _productVariantRepository.CreateProductVariantAsync(newProductVariant);
            return _mapper.Map<ProductVariantDTO>(createdProductVariant);
        }

        public async Task<PagedResult<ProductVariantDTO>> GetPagedProductVariantsAsync(ProductVariantListRequest request)
        {
            return await _productVariantRepository.GetPagedProductVariantsAsync(request);
        }

        public async Task<ProductVariantDTO?> GetProductVariantByIdAsync(Guid productVariantId)
        {
            var productVariant = await _productVariantRepository.GetProductVariantByIdAsync(productVariantId);

            if (productVariant == null) throw new KeyNotFoundException("Không tìm thấy biến thể sản phẩm");

            return productVariant;
        }

        public async Task<ProductVariantDTO?> UpdateProductVariantAsync(Guid productVariantId, UpdateProductVariantDTO dto)
        {
            var existingProductVariant = await _productVariantRepository.FindProductVariantByIdAsync(productVariantId);

            if (existingProductVariant == null) throw new KeyNotFoundException("Không tìm thấy biến thể sản phẩm");

            if (dto.SKU != existingProductVariant.SKU)
            {
                var isExistSKU = await _productVariantRepository.CheckExistSKUAsync(dto.SKU);

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

            await _productVariantRepository.UpdateProductVariantAsync(existingProductVariant);
            return await _productVariantRepository.GetProductVariantByIdAsync(productVariantId);
        }

        public async Task DeleteProductVariantAsync(Guid productVariantId)
        {
            var existingProductVariant = await _productVariantRepository.FindProductVariantByIdAsync(productVariantId);

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

            await _productVariantRepository.DeleteProductVariantAsync(existingProductVariant);
        }
    }
}
