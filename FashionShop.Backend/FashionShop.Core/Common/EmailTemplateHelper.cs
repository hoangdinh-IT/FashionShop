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

        public static string GetGoogleLoginNotificationTemplate(string fullName, string email)
        {
            string name = string.IsNullOrWhiteSpace(fullName) ? "Quý khách" : fullName;
            string currentTime = DateTime.UtcNow.AddHours(7).ToString("HH:mm:ss dd/MM/yyyy"); // Giờ Việt Nam (ICT)

            return $@"
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            </head>
            <body style='margin: 0; padding: 0; font-family: ""Helvetica Neue"", Helvetica, Arial, sans-serif; background-color: #ffffff; color: #1a1a1a;'>
                <table width='100%' cellpadding='0' cellspacing='0' border='0' style='background-color: #ffffff; padding: 40px 0;'>
                    <tr>
                        <td align='center'>
                            <table width='600' cellpadding='0' cellspacing='0' border='0' style='background-color: #ffffff; border: 1px solid #f0f0f0; overflow: hidden;'>
                        
                                <tr>
                                    <td align='center' style='padding: 50px 0; background-color: #000000;'>
                                        <h1 style='color: #ffffff; margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 6px; font-family: ""Times New Roman"", Times, serif;'>FASHION SHOP</h1>
                                    </td>
                                </tr>
                        
                                <tr>
                                    <td style='padding: 50px 50px 40px 50px;'>
                                        <p style='font-size: 15px; font-weight: 500; letter-spacing: 0.5px; margin-bottom: 25px;'>Kính chào <strong>{name}</strong>,</p>
                                
                                        <p style='font-size: 14px; line-height: 1.7; color: #444444; margin-bottom: 20px;'>
                                            Lời đầu tiên, <strong>FashionShop</strong> xin gửi lời chào trân trọng nhất và lời cảm ơn chân thành vì Quý khách đã lựa chọn đồng hành cùng chúng tôi.
                                        </p>
                                
                                        <p style='font-size: 14px; line-height: 1.7; color: #444444; margin-bottom: 30px;'>
                                            Hệ thống ghi nhận tài khoản Google của Quý khách đã được liên kết và thiết lập thành công tư cách <strong>Thành viên mới</strong> của FashionShop. Từ thời điểm này, không gian mua sắm đặc quyền và các chương trình ưu đãi dành riêng cho Quý khách đã chính thức được kích hoạt.
                                        </p>
                                
                                        <table width='100%' cellpadding='0' cellspacing='0' border='0' style='background-color: #fafafa; border-left: 2px solid #000000; margin-bottom: 30px;'>
                                            <tr>
                                                <td style='padding: 20px 25px;'>
                                                    <p style='margin: 0 0 12px 0; font-size: 13px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; color: #000000;'>Thông tin tài khoản thành viên:</p>
                                                    <p style='margin: 0 0 8px 0; font-size: 13px; color: #555555;'>• <strong>Tài khoản đăng ký:</strong> {email}</p>
                                                    <p style='margin: 0 0 8px 0; font-size: 13px; color: #555555;'>• <strong>Hình thức xác thực:</strong> Google Authentication</p>
                                                    <p style='margin: 0; font-size: 13px; color: #555555;'>• <strong>Thời gian hoàn tất:</strong> {currentTime} (ICT)</p>
                                                </td>
                                            </tr>
                                        </table>
                                
                                        <p style='font-size: 14px; line-height: 1.7; color: #444444; margin-bottom: 15px;'>
                                            Nhân cột mốc đặc biệt này, chúng tôi đã gửi tặng một mã ưu đãi chào mừng trực tiếp vào mục <em>Voucher của tôi</em> trong giao diện cá nhân của Quý khách.
                                        </p>
                                
                                        <p style='font-size: 13px; line-height: 1.6; color: #888888; border-top: 1px dotted #e5e5e5; padding-top: 25px; margin-top: 35px;'>
                                            <span style='color: #000000; font-weight: 500;'>Lưu ý bảo mật:</span> Email này được gửi tự động để xác nhận tiến trình đăng ký tài khoản mới. Nếu hành động này không do Quý khách thực hiện, vui lòng liên hệ khẩn cấp với Bộ phận kiểm soát an ninh của chúng tôi qua hotline để được hỗ trợ bảo vệ dữ liệu kịp thời.
                                        </p>
                                    </td>
                                </tr>
                        
                                <tr>
                                    <td align='center' style='padding: 35px 50px; background-color: #fcfcfc; border-top: 1px solid #f5f5f5;'>
                                        <p style='margin: 0; font-size: 12px; color: #777777; line-height: 1.8; letter-spacing: 0.5px;'>
                                            Trân trọng cảm ơn và kính chúc Quý khách có những trải nghiệm mua sắm tuyệt vời nhất.<br><br>
                                            <strong style='color: #000000; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;'>Ban Quản Trị Hệ Thống FashionShop</strong><br>
                                            <a href='https://www.fashionshop.com' style='color: #000000; text-decoration: none; font-weight: 500;'>www.fashionshop.com</a>
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
