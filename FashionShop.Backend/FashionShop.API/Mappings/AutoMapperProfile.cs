using AutoMapper;
using FashionShop.Core.Contracts.Address.Requests;
using FashionShop.Core.Contracts.Address.Responses;
using FashionShop.Core.Contracts.Auth;
using FashionShop.Core.Contracts.Brand.Requests;
using FashionShop.Core.Contracts.Brand.Responses;
using FashionShop.Core.Contracts.Category.Requests;
using FashionShop.Core.Contracts.Category.Responses;
using FashionShop.Core.Contracts.Color.Requests;
using FashionShop.Core.Contracts.Color.Responses;
using FashionShop.Core.Contracts.Product.Requests;
using FashionShop.Core.Contracts.Product.Responses;
using FashionShop.Core.Contracts.ProductImage.Requests;
using FashionShop.Core.Contracts.ProductImage.Responses;
using FashionShop.Core.Contracts.ProductVariant.Requests;
using FashionShop.Core.Contracts.ProductVariant.Responses;
using FashionShop.Core.Contracts.Size.Requests;
using FashionShop.Core.Contracts.Size.Responses;
using FashionShop.Core.Contracts.User.Requests;
using FashionShop.Core.Contracts.User.Responses;
using FashionShop.Core.Contracts.Voucher.Requests;
using FashionShop.Core.Contracts.Voucher.Responses;
using FashionShop.Core.Entities;

namespace FashionShop.API.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // User
            CreateMap<RegisterRequest, User>()
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

            CreateMap<Category, CategoryResponse>();

            // Brand
            CreateMap<CreateBrandRequest, Brand>();

            CreateMap<UpdateBrandRequest, Brand>();

            CreateMap<Brand, BrandResponse>();

            // Color
            CreateMap<CreateColorRequest, Color>();

            CreateMap<UpdateColorRequest, Color>();

            CreateMap<Color, ColorResponse>();

            // Size
            CreateMap<CreateSizeRequest, Size>();

            CreateMap<UpdateSizeRequest, Size>();

            CreateMap<Size, SizeResponse>();

            // Product
            CreateMap<CreateProductRequest, Product>();

            CreateMap<UpdateProductRequest, Product>();

            CreateMap<Product, ProductResponse>();

            // ProductVariant
            CreateMap<CreateProductVariantRequest, ProductVariant>();
            
            CreateMap<UpdateProductVariantRequest, ProductVariant>();

            CreateMap<ProductVariant, ProductVariantResponse>();

            CreateMap<UpdateProductVariantRequest, CreateProductVariantRequest>();

            // ProductImage
            CreateMap<CreateProductImagesRequest, ProductImage>();

            CreateMap<UpdateProductImageRequest, ProductImage>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<ProductImage, ProductImageResponse>();

            // Voucher
            CreateMap<CreateVoucherRequest, Voucher>();

            CreateMap<UpdateVoucherRequest, Voucher>();

            CreateMap<Voucher, VoucherResponse>();
        }
    }
}
