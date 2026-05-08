using System.Threading.Tasks;

namespace FashionShop.API.Services.Shared.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string htmlMessage);
    }
}