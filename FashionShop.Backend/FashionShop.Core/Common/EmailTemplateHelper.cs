using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Common
{
    public static class EmailTemplateHelper
    {
        public static string GetResetPasswordTemplate(string fullName, string otpCode)
        {
            string name = string.IsNullOrWhiteSpace(fullName) ? "Quý khách" : fullName;

            // Giao diện Email mang phong cách Sang trọng, Tối giản (Luxury Minimalist)
            // Tone màu chủ đạo: Đen, Trắng, và Vàng Gold (Champagne)
            return $@"
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            </head>
            <body style='margin: 0; padding: 0; font-family: ""Helvetica Neue"", Helvetica, Arial, sans-serif; background-color: #f9f9f9;'>
                <table width='100%' cellpadding='0' cellspacing='0' border='0' style='background-color: #f9f9f9; padding: 40px 0;'>
                    <tr>
                        <td align='center'>
                            <table width='600' cellpadding='0' cellspacing='0' border='0' style='background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);'>
                                <tr>
                                    <td align='center' style='padding: 40px 0; background-color: #000000;'>
                                        <h1 style='color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 4px;'>FASHION SHOP</h1>
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td style='padding: 40px 50px; color: #333333;'>
                                        <p style='font-size: 16px; margin-bottom: 20px;'>Kính chào <strong>{name}</strong>,</p>
                                        <p style='font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 30px;'>
                                            Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại FashionShop. Dưới đây là mã xác thực (OTP) của bạn:
                                        </p>
                                        
                                        <div style='text-align: center; margin: 40px 0;'>
                                            <span style='display: inline-block; padding: 15px 40px; font-size: 32px; font-weight: bold; color: #000000; background-color: #fcfaf2; border: 1px solid #d4af37; border-radius: 4px; letter-spacing: 8px;'>
                                                {otpCode}
                                            </span>
                                        </div>
                                        
                                        <p style='font-size: 14px; color: #888888; text-align: center; margin-bottom: 30px;'>
                                            Mã này có hiệu lực trong vòng <strong>5 phút</strong>.<br>Vui lòng không chia sẻ mã này với bất kỳ ai để đảm bảo an toàn.
                                        </p>
                                        
                                        <p style='font-size: 15px; color: #555555;'>
                                            Nếu bạn không thực hiện yêu cầu này, xin vui lòng bỏ qua email này. Tài khoản của bạn vẫn được bảo mật an toàn.
                                        </p>
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td align='center' style='padding: 25px 50px; background-color: #fafafa; border-top: 1px solid #eaeaea;'>
                                        <p style='margin: 0; font-size: 12px; color: #999999; line-height: 1.5;'>
                                            Trân trọng,<br>
                                            <strong>Đội ngũ Chăm sóc Khách hàng FashionShop</strong><br>
                                            <a href='#' style='color: #000000; text-decoration: none;'>www.fashionshop.com</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>";
        }
    }
}
