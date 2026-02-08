using AutoMapper;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.API.Services.Interfaces;
using FashionShop.Core.DTOs.ProductImage;
using FashionShop.Core.Entities;

namespace FashionShop.API.Services.Implements
{
    public class ProductImageService : IProductImageService
    {
        private readonly IProductImageRepository _productImageRepository;
        private readonly IProductRepository _productRepository;
        private readonly IColorRepository _colorRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public ProductImageService(IProductImageRepository productImageRepository, IProductRepository productRepository, IColorRepository colorRepository, IMapper mapper, IPhotoService photoService)
        {
            _productImageRepository = productImageRepository;
            _productRepository = productRepository;
            _colorRepository = colorRepository;
            _mapper = mapper;
            _photoService = photoService;
        }

        public async Task<ProductImageDTO> CreateProductImageAsync(CreateProductImageDTO dto)
        {
            var newProductImage = _mapper.Map<ProductImage>(dto);
            newProductImage.Id = Guid.NewGuid();

            if (dto.ColorId.HasValue)
            {
                var isExistProductVariant = await _productImageRepository.CheckExistProductVariant(dto.ProductId, dto.ColorId.Value);

                if (!isExistProductVariant) throw new Exception("Lỗi: Bạn không thể upload ảnh màu này vì chưa có biến thể sản phẩm (Variant) tương ứng!");
            }

            if (dto.Image != null)
            {
                var uploadResult = await _photoService.AddPhotoAsync(dto.Image);

                if (uploadResult.Error != null) throw new Exception("Lỗi upload ảnh: " + uploadResult.Error.Message);

                newProductImage.ImageUrl = uploadResult.SecureUrl.AbsoluteUri; // Lưu link ảnh vào DB
            }

            var createdProductImage = await _productImageRepository.CreateProductImageAsync(newProductImage);
            return _mapper.Map<ProductImageDTO>(createdProductImage);
        }

        public async Task<IEnumerable<ProductImageDTO>> GetProductImagesAsync(Guid productId, int? colorId)
        {
            var existingProduct = await _productRepository.FindProductByIdAsync(productId);

            if (existingProduct == null) throw new KeyNotFoundException("Không tìm thấy sản phẩm!");
            
            return await _productImageRepository.GetProductImagesAsync(productId, colorId);
        }

        public async Task<ProductImageDTO?> GetProductImageByIdAsync(Guid productImageId)
        {
            var existingProductImage = await _productImageRepository.FindProductImageByIdAsync(productImageId);

            if (existingProductImage == null) throw new KeyNotFoundException("Không tìm thấy hình ảnh sản phẩm!");

            return await _productImageRepository.GetProductImageByIdAsync(productImageId);
        }

        public async Task<ProductImageDTO?> UpdateProductImageAsync(Guid productImageId, UpdateProductImageDTO dto)
        {
            var existingProductImage = await _productImageRepository.FindProductImageByIdAsync(productImageId);

            if (existingProductImage == null) throw new KeyNotFoundException("Không tìm thấy hình ảnh sản phẩm!");

            _mapper.Map(dto, existingProductImage);
            existingProductImage.UpdatedDate = DateTime.UtcNow;

            await _productImageRepository.UpdateProductImageAsync(existingProductImage);
            return await _productImageRepository.GetProductImageByIdAsync(productImageId);
        }

        public async Task DeleteProductImageAsync(Guid productImageId)
        {
            var existingProductImage = await _productImageRepository.FindProductImageByIdAsync(productImageId);

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

            await _productImageRepository.DeleteProductImageAsync(existingProductImage);
        }
    }
}
