using CloudinaryDotNet.Actions;

namespace FashionShop.API.Services.Interfaces
{
    public interface IPhotoService
    {
        Task<ImageUploadResult> AddPhotoAsync(IFormFile file);
        Task<DeletionResult> DeletePhotoAsync(string publicId);
        string GetPublicIdFromUrl(string url);
    }
}
