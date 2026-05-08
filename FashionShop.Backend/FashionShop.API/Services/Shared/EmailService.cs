//using FashionShop.API.Services.Shared.Interfaces;
//using FashionShop.Core.Settings;
//using MailKit.Net.Smtp;
//using MailKit.Security;
//using Microsoft.Extensions.Options;
//using MimeKit;

//namespace FashionShop.API.Services.Shared
//{
//    public class EmailService : IEmailService
//    {
//        private readonly EmailSettings _emailSettings;

//        public EmailService(IOptions<EmailSettings> emailSettings)
//        {
//            _emailSettings = emailSettings.Value;
//        }

//        public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
//        {
//            var email = new MimeMessage();

//            // Người gửi
//            email.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
//            // Người nhận
//            email.To.Add(new MailboxAddress("Khách hàng", toEmail));

//            // Tiêu đề
//            email.Subject = subject;

//            // Nội dung (Hỗ trợ HTML để làm email đẹp hơn)
//            var builder = new BodyBuilder { HtmlBody = htmlMessage };
//            email.Body = builder.ToMessageBody();

//            // Kết nối SMTP và gửi
//            using var smtp = new SmtpClient();
//            try
//            {
//                await smtp.ConnectAsync(_emailSettings.Host, _emailSettings.Port, SecureSocketOptions.StartTls);
//                await smtp.AuthenticateAsync(_emailSettings.SenderEmail, _emailSettings.Password);
//                await smtp.SendAsync(email);
//            }
//            catch (Exception ex)
//            {
//                // Ghi log lỗi tại đây nếu gửi thất bại
//                Console.WriteLine($"Lỗi gửi email: {ex.Message}");
//                throw new Exception("Lỗi hệ thống: Không thể gửi email vào lúc này.");
//            }
//            finally
//            {
//                await smtp.DisconnectAsync(true);
//            }
//        }
//    }
//}




using brevo_csharp.Api;
using brevo_csharp.Client;
using brevo_csharp.Model;
using FashionShop.API.Services.Shared.Interfaces;
using FashionShop.Core.Settings;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;   // Giữ dòng này

namespace FashionShop.API.Services.Shared
{
    public class EmailService : IEmailService
    {
        private readonly BrevoSettings _settings;
        private readonly TransactionalEmailsApi _api;

        public EmailService(IOptions<BrevoSettings> settings)
        {
            _settings = settings.Value;
            _api = new TransactionalEmailsApi();
            _api.Configuration.ApiKey.Add("api-key", _settings.ApiKey);
        }

        public async System.Threading.Tasks.Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
        {
            try
            {
                var email = new SendSmtpEmail
                {
                    Subject = subject,
                    HtmlContent = htmlMessage,
                    Sender = new SendSmtpEmailSender
                    {
                        Name = _settings.SenderName,
                        Email = _settings.SenderEmail
                    },
                    To = new List<SendSmtpEmailTo>
                    {
                        new SendSmtpEmailTo { Email = toEmail }
                    }
                };

                var result = await _api.SendTransacEmailAsync(email);

                Console.WriteLine($"✅ [Brevo] Gửi email thành công đến {toEmail} | ID: {result.MessageId}");
            }
            catch (ApiException ex)
            {
                Console.WriteLine($"❌ Brevo API Error: {ex.Message} - Code: {ex.ErrorCode}");
                throw new Exception("Không thể gửi email. Vui lòng thử lại sau.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Lỗi gửi email: {ex.Message}");
                throw new Exception("Không thể gửi email vào lúc này.");
            }
        }
    }
}
