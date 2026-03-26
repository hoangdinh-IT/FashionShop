using AutoMapper;
using FashionShop.Core.DTOs.Address;
using FashionShop.Core.DTOs.Auth;
using FashionShop.Core.DTOs.Brand;
using FashionShop.Core.DTOs.Category;
using FashionShop.Core.DTOs.Category.Category;
using FashionShop.Core.DTOs.Color;
using FashionShop.Core.DTOs.Product;
using FashionShop.Core.DTOs.ProductImage;
using FashionShop.Core.DTOs.ProductVariant;
using FashionShop.Core.DTOs.Size;
using FashionShop.Core.DTOs.User;
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
            CreateMap<CreateProductDTO, Product>();

            CreateMap<UpdateProductDTO, Product>();

            CreateMap<Product, ProductDTO>();

            // ProductVariant
            CreateMap<CreateProductVariantDTO, ProductVariant>();
            
            CreateMap<UpdateProductVariantDTO, ProductVariant>();

            CreateMap<ProductVariant, ProductVariantDTO>();

            CreateMap<UpdateProductVariantDTO, CreateProductVariantDTO>();

            // ProductImage
            CreateMap<CreateProductImageDTO, ProductImage>();

            CreateMap<UpdateProductImageDTO, ProductImage>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<ProductImage, ProductImageDTO>();
        }
    }
}
