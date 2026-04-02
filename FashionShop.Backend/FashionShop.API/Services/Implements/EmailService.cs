using FashionShop.API.Services.Interfaces;
using FashionShop.Core.Settings;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace FashionShop.API.Services.Implements
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;

        public EmailService(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
        {
            var email = new MimeMessage();

            // Người gửi
            email.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
            // Người nhận
            email.To.Add(new MailboxAddress("Khách hàng", toEmail));

            // Tiêu đề
            email.Subject = subject;

            // Nội dung (Hỗ trợ HTML để làm email đẹp hơn)
            var builder = new BodyBuilder { HtmlBody = htmlMessage };
            email.Body = builder.ToMessageBody();

            // Kết nối SMTP và gửi
            using var smtp = new SmtpClient();
            try
            {
                await smtp.ConnectAsync(_emailSettings.Host, _emailSettings.Port, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(_emailSettings.SenderEmail, _emailSettings.Password);
                await smtp.SendAsync(email);
            }
            catch (Exception ex)
            {
                // Ghi log lỗi tại đây nếu gửi thất bại
                Console.WriteLine($"Lỗi gửi email: {ex.Message}");
                throw new Exception("Lỗi hệ thống: Không thể gửi email vào lúc này.");
            }
            finally
            {
                await smtp.DisconnectAsync(true);
            }
        }
    }
}
