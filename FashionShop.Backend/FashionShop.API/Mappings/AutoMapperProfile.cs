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
using FashionShop.Core.Contracts.Admin.Coupon.Requests;
using FashionShop.Core.Contracts.Admin.Coupon.Responses;
using FashionShop.Core.Contracts.Shared.Auth.Requests;
using FashionShop.Core.Contracts.Shop.Address.Requests;
using FashionShop.Core.Contracts.Shop.Address.Responses;
using FashionShop.Core.Contracts.Shop.Cart.Responses;
using FashionShop.Core.Contracts.Shop.Order.Requests;
using FashionShop.Core.Contracts.Shop.Order.Responses;
using FashionShop.Core.Contracts.Shop.Review.Requests;
using FashionShop.Core.Contracts.Shop.Review.Responses;
using FashionShop.Core.Contracts.Shop.ReviewLike.Requests;
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

            CreateMap<ShopUpdateUserRequest, User>();

            CreateMap<User, ShopUserResponse>()
                .ReverseMap();

            CreateMap<ChangePasswordRequest, User>();

            // Address
            CreateMap<ShopCreateAddressRequest, Address>();

            CreateMap<ShopUpdateAddressRequest, Address>();

            CreateMap<Address, ShopAddressResponse>();

            // Category
            CreateMap<AdminCreateCategoryRequest, Category>();

            CreateMap<AdminUpdateCategoryRequest, Category>();

            CreateMap<Category, AdminCategoryResponse>();

            // Brand
            CreateMap<AdminCreateBrandRequest, Brand>();

            CreateMap<AdminUpdateBrandRequest, Brand>();

            CreateMap<Brand, AdminBrandResponse>();

            // Color
            CreateMap<AdminCreateColorRequest, Color>();

            CreateMap<AdminUpdateColorRequest, Color>();

            CreateMap<Color, AdminColorResponse>();

            // Size
            CreateMap<AdminCreateSizeRequest, Size>();

            CreateMap<AdminUpdateSizeRequest, Size>();

            CreateMap<Size, AdminSizeResponse>();

            // Product
            CreateMap<AdminCreateProductRequest, Product>();

            CreateMap<AdminCreateProductDetailRequest, Product>();

            CreateMap<AdminUpdateProductRequest, Product>();

            CreateMap<Product, AdminProductResponse>();

            // ProductVariant
            CreateMap<AdminCreateProductVariantRequest, ProductVariant>();
            
            CreateMap<AdminUpdateProductVariantRequest, ProductVariant>();

            CreateMap<ProductVariant, AdminProductVariantResponse>();

            CreateMap<AdminUpdateProductVariantRequest, AdminCreateProductVariantRequest>();

            // ProductImage
            CreateMap<AdminCreateProductImagesRequest, ProductImage>();

            CreateMap<AdminUpdateProductImageRequest, ProductImage>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<ProductImage, AdminProductImageResponse>();

            // Coupon
            CreateMap<AdminCreateCouponRequest, Coupon>();

            CreateMap<AdminUpdateCouponRequest, Coupon>();

            CreateMap<Coupon, AdminCouponResponse>();

            // Cart
            CreateMap<Cart, ShopCartResponse>();

            CreateMap<CartItem, ShopCartItemResponse>();

            // Order
            CreateMap<ShopCreateOrderRequest, Order>()
                .ForMember(dest => dest.OrderItems, opt => opt.Ignore());

            CreateMap<OrderItem, ShopOrderItemSummaryResponse>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.ProductVariant.Product.Name));

            CreateMap<Order, ShopOrderSummaryResponse>();

            // Review
            CreateMap<ShopCreateReviewRequest, Review>()
                .ForMember(dest => dest.ReviewImages, opt => opt.Ignore());

            CreateMap<Review, ShopReviewResponse>();

            CreateMap<ReviewImage, ShopReviewImageResponse>();

            // ReviewLike
            CreateMap<ShopUpdateReviewLikeRequest, ReviewLike>();
        }
    }
}
