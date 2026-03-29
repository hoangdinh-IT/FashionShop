using AutoMapper;
using FashionShop.Core.Contracts.Address;
using FashionShop.Core.Contracts.Auth;
using FashionShop.Core.Contracts.Brand;
using FashionShop.Core.Contracts.Category;
using FashionShop.Core.Contracts.Color;
using FashionShop.Core.Contracts.Product.Requests;
using FashionShop.Core.Contracts.Product.Responses;
using FashionShop.Core.Contracts.ProductImage.Requests;
using FashionShop.Core.Contracts.ProductImage.Responses;
using FashionShop.Core.Contracts.ProductVariant.Requests;
using FashionShop.Core.Contracts.ProductVariant.Responses;
using FashionShop.Core.Contracts.Size;
using FashionShop.Core.Contracts.User;
using FashionShop.Core.Entities;

namespace FashionShop.API.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // User
            CreateMap<RegisterDTO, User>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Password, opt => opt.Ignore());

            CreateMap<UpdateUserDTO, User>();

            CreateMap<User, UserDTO>()
                .ReverseMap();

            // Address
            CreateMap<CreateAddressDTO, Address>();

            CreateMap<UpdateAddressDTO, Address>();

            CreateMap<Address, AddressDTO>();

            // Category
            CreateMap<CreateCategoryDTO, Category>();

            CreateMap<UpdateCategoryDTO, Category>();

            CreateMap<Category, CategoryDTO>();

            // Brand
            CreateMap<CreateBrandDTO, Brand>();

            CreateMap<UpdateBrandDTO, Brand>();

            CreateMap<Brand, BrandDTO>();

            // Color
            CreateMap<CreateColorDTO, Color>();

            CreateMap<UpdateColorDTO, Color>();

            CreateMap<Color, ColorDTO>();

            // Size
            CreateMap<CreateSizeDTO, Size>();

            CreateMap<UpdateSizeDTO, Size>();

            CreateMap<Size, SizeDTO>();

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
            CreateMap<CreateProductImageRequest, ProductImage>();

            CreateMap<UpdateProductImageRequest, ProductImage>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<ProductImage, ProductImageResponse>();
        }
    }
}
