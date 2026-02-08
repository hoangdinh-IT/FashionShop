using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using FashionShop.API.Services.Interfaces;
using Microsoft.Extensions.Options;
using FashionShop.API.Helpers;

namespace FashionShop.API.Services.Implements
{
    public class PhotoService : IPhotoService
    {
        private readonly Cloudinary _cloudinary;

        public PhotoService(IOptions<CloudinarySettings> config)
        {
            var acc = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(acc);
        }

        public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    // --- TỰ ĐỘNG CẮT ẢNH VUÔNG (Rất cần cho FashionShop) ---
                    Transformation = new Transformation()
                        .Height(500)
                        .Width(500)
                        .Crop("limit")
                        //.Gravity("face")
                    // Folder = "fashionshop-products" // Nếu muốn gom vào folder
                };
                uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }

            return uploadResult;
        }

        public async Task<DeletionResult> DeletePhotoAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            return await _cloudinary.DestroyAsync(deleteParams);
        }

        public string GetPublicIdFromUrl(string url)
        {
            var fileName = url.Split('/').Last();

            var publicId = fileName.Substring(0, fileName.LastIndexOf('.'));

            return publicId;
        }
    }
}
