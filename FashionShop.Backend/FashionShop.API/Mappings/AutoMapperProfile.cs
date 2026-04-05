using AutoMapper;
using FashionShop.Core.Contracts.Admin.Brand.Requests;
using FashionShop.Core.Contracts.Admin.Brand.Responses;
using FashionShop.Core.Contracts.Admin.Category.Requests;
using FashionShop.Core.Contracts.Admin.Category.Responses;
using FashionShop.Core.Contracts.Admin.Color.Requests;
using FashionShop.Core.Contracts.Admin.Color.Responses;
using FashionShop.Core.Contracts.Admin.Product.Requests;
using FashionShop.Core.Contracts.Admin.Product.Responses;
using FashionShop.Core.Contracts.Admin.ProductImage.Requests;
using FashionShop.Core.Contracts.Admin.ProductImage.Responses;
using FashionShop.Core.Contracts.Admin.ProductVariant.Requests;
using FashionShop.Core.Contracts.Admin.ProductVariant.Responses;
using FashionShop.Core.Contracts.Admin.Size.Requests;
using FashionShop.Core.Contracts.Admin.Size.Responses;
using FashionShop.Core.Contracts.Admin.Voucher.Requests;
using FashionShop.Core.Contracts.Admin.Voucher.Responses;
using FashionShop.Core.Contracts.Shared.Auth;
using FashionShop.Core.Contracts.Shop.Address.Requests;
using FashionShop.Core.Contracts.Shop.Address.Responses;
using FashionShop.Core.Contracts.Shop.User.Requests;
using FashionShop.Core.Contracts.Shop.User.Responses;
using FashionShop.Core.Entities;

namespace FashionShop.API.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // User
            CreateMap<AppRegisterRequest, User>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Password, opt => opt.Ignore());

            CreateMap<UpdateUserRequest, User>();

            CreateMap<User, UserResponse>()
                .ReverseMap();

            // Address
            CreateMap<CreateAddressRequest, Address>();

            CreateMap<UpdateAddressRequest, Address>();

            CreateMap<Address, AddressResponse>();

            // Category
            CreateMap<CreateCategoryRequest, Category>();

            CreateMap<UpdateCategoryRequest, Category>();

            CreateMap<Category, AdminCategoryResponse>();

            // Brand
            CreateMap<CreateBrandRequest, Brand>();

            CreateMap<UpdateBrandRequest, Brand>();

            CreateMap<Brand, AdminBrandResponse>();

            // Color
            CreateMap<CreateColorRequest, Color>();

            CreateMap<UpdateColorRequest, Color>();

            CreateMap<Color, AdminColorResponse>();

            // Size
            CreateMap<CreateSizeRequest, Size>();

            CreateMap<UpdateSizeRequest, Size>();

            CreateMap<Size, AdminSizeResponse>();

            // Product
            CreateMap<CreateProductRequest, Product>();

            CreateMap<CreateProductDetailRequest, Product>();

            CreateMap<UpdateProductRequest, Product>();

            CreateMap<Product, AdminProductResponse>();

            // ProductVariant
            CreateMap<CreateProductVariantRequest, ProductVariant>();
            
            CreateMap<UpdateProductVariantRequest, ProductVariant>();

            CreateMap<ProductVariant, AdminProductVariantResponse>();

            CreateMap<UpdateProductVariantRequest, CreateProductVariantRequest>();

            // ProductImage
            CreateMap<CreateProductImagesRequest, ProductImage>();

            CreateMap<UpdateProductImageRequest, ProductImage>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<ProductImage, AdminProductImageResponse>();

            // Voucher
            CreateMap<CreateVoucherRequest, Voucher>();

            CreateMap<UpdateVoucherRequest, Voucher>();

            CreateMap<Voucher, AdminVoucherResponse>();
        }
    }
}
