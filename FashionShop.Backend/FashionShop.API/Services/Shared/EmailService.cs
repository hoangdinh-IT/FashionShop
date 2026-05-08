using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using brevo_csharp.Api;
using brevo_csharp.Client;
using brevo_csharp.Model;
using FashionShop.API.Services.Shared.Interfaces;
using FashionShop.Core.Settings;
using Microsoft.Extensions.Options;

using NetTask = System.Threading.Tasks.Task;
using BrevoConfig = brevo_csharp.Client.Configuration;

namespace FashionShop.API.Services.Shared
{
    public class EmailService : IEmailService
    {
        private readonly BrevoSettings _settings;

        public EmailService(IOptions<BrevoSettings> settings)
        {
            _settings = settings.Value;
        }

        public async NetTask SendEmailAsync(string toEmail, string subject, string htmlMessage)
        {
            if (string.IsNullOrEmpty(_settings.ApiKey))
            {
                throw new Exception("Lỗi: Không tìm thấy API Key trong cấu hình hệ thống (BrevoSettings).");
            }

            if (string.IsNullOrWhiteSpace(toEmail))
            {
                throw new Exception("Không thể gửi mail vì địa chỉ email nhận bị trống.");
            }

            try
            {
                // 1. Kiểm tra đầu vào ngay lập tức để tránh lỗi Required của Brevo
                if (string.IsNullOrWhiteSpace(toEmail))
                {
                    throw new Exception("Email người nhận không được để trống.");
                }

                // 2. Khởi tạo cấu hình
                var config = new BrevoConfig();
                config.ApiKey["api-key"] = _settings.ApiKey.Trim();

                var apiInstance = new TransactionalEmailsApi(config);

                // 3. Tạo đối tượng Email
                var sendSmtpEmail = new SendSmtpEmail
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
                        new SendSmtpEmailTo(toEmail.Trim())
                    }
                };

                // 4. Gửi Email
                await apiInstance.SendTransacEmailAsync(sendSmtpEmail);
            }
            catch (ApiException ex)
            {
                throw new Exception(
                    $"Brevo API Error | StatusCode: {ex.ErrorCode} | Message: {ex.Message}"
                );
            }
            catch (Exception ex)
            {
                // Quăng các lỗi hệ thống khác
                var innerMessage = ex.InnerException != null ? $" | Chi tiết: {ex.InnerException.Message}" : "";
                throw new Exception($"Lỗi hệ thống khi gửi mail: {ex.Message}{innerMessage}");
            }
        }
    }
}