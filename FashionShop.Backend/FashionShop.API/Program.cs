
using FashionShop.API.Data;
using FashionShop.API.Helpers;
using FashionShop.API.Middwares;
using FashionShop.API.Repositories.Admin;
using FashionShop.API.Repositories.Admin.Interfaces;
using FashionShop.API.Repositories.Shared;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Repositories.Shop;
using FashionShop.API.Repositories.Shop.Interfaces;
using FashionShop.API.Services.Admin;
using FashionShop.API.Services.Admin.Interfaces;
using FashionShop.API.Services.Shared;
using FashionShop.API.Services.Shared.Interfaces;
using FashionShop.API.Services.Shop;
using FashionShop.API.Services.Shop.Interfaces;
using FashionShop.Core.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;
using System.Text.Json.Serialization;


namespace FashionShop.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:5173") 
                              .AllowAnyHeader()
                              .AllowAnyMethod();
                    });
            });

            //builder.Services.AddDbContext<FashionDbContext>(options =>
            //    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddDbContext<FashionDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddAuthentication(options =>
                            {
                                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                            })
                            .AddJwtBearer(options =>
                            {
                                options.TokenValidationParameters = new TokenValidationParameters
                                {
                                    ValidateIssuer = true,
                                    ValidateAudience = true,
                                    ValidateLifetime = true,
                                    ValidateIssuerSigningKey = true,
                                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                                    ValidAudience = builder.Configuration["Jwt:Audience"],
                                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
                                };
                            });

            // Tự động quét toàn bộ project để tìm các file Profile kế thừa từ AutoMapper
            builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            // Đăng ký Repository
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Đăng ký Service
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddScoped<IPhotoService, PhotoService>();

            builder.Services.AddScoped<IAdminCategoryService, AdminCategoryService>();
            builder.Services.AddScoped<IAdminBrandService, AdminBrandService>();
            builder.Services.AddScoped<IAdminColorService, AdminColorService>();
            builder.Services.AddScoped<IAdminSizeService, AdminSizeService>();
            builder.Services.AddScoped<IAdminProductService, AdminProductService>();
            builder.Services.AddScoped<IAdminVoucherService, AdminVoucherService>();

            builder.Services.AddScoped<IShopUserService, ShopUserService>();
            builder.Services.AddScoped<IShopAddressService, ShopAddressService>();
            builder.Services.AddScoped<IShopProductService, ShopProductService>();
            builder.Services.AddScoped<IShopBrandService, ShopBrandService>();
            builder.Services.AddScoped<IShopCategoryService, ShopCategoryService>();
            builder.Services.AddScoped<IShopCartService, ShopCartService>();

            // 1. Lấy dữ liệu từ appsettings bind vào class CloudinarySettings
            builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));
            builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

            // 2. Đăng ký PhotoService

            // Add services to the container.

            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    // Dòng này giúp bỏ qua lỗi Circular Reference
                    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;

                    // Dòng này giúp API hiểu được string và convert sang Enum
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());

                    // (Tuỳ chọn) Giữ nguyên format tên field như trong class C# (PascalCase) thay vì camelCase
                    // options.JsonSerializerOptions.PropertyNamingPolicy = null; 
                });
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            app.UseCors("AllowReactApp");

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseMiddleware<ExceptionMiddleware>();

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
