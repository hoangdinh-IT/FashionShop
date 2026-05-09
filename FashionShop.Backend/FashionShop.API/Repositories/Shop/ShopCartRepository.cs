using FashionShop.API.Data;
using FashionShop.API.Repositories.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Cart.Responses;
using FashionShop.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FashionShop.API.Repositories.Shop
{
    public class ShopCartRepository : IShopCartRepository
    {
        private readonly FashionDbContext _context;

        public ShopCartRepository(FashionDbContext context)
        {
            _context = context;
        }

        private readonly static Expression<Func<CartItem, ShopCartItemResponse>> _cartItemSelector =
            ci => new ShopCartItemResponse
            {
                Id = ci.Id,
                CartId = ci.CartId,
                ProductVariantId = ci.ProductVariantId,
                Quantity = ci.Quantity,
                IsSelected = ci.IsSelected,

                ProductId = ci.ProductVariant.ProductId,
                ProductName = ci.ProductVariant.Product.Name,
                ProductSlug = ci.ProductVariant.Product.Slug,
                BrandName = ci.ProductVariant.Product.Brand.Name,
                ImageUrl = ci.ProductVariant.Product.ProductImages
                    .Where(x => x.ColorId == ci.ProductVariant.ColorId)
                    .OrderBy(x => x.SortOrder)
                    .Select(x => x.ImageUrl)
                    .FirstOrDefault()
                    ?? ci.ProductVariant.Product.ThumbnailUrl
                    ?? string.Empty,

                ColorId = ci.ProductVariant.ColorId,
                ColorName = ci.ProductVariant.Color.Name,
                SizeId = ci.ProductVariant.SizeId,
                SizeName = ci.ProductVariant.Size.Name,

                UnitPrice = ci.ProductVariant.Price,
                CreatedDate = ci.CreatedDate,
                UpdatedDate = ci.UpdatedDate,
            };



        // --- READ METHODS --- //

        public async Task<Cart?> GetCartAsync(Guid userId)
        {
            return await _context.Carts
                .Include(cart => cart.CartItems)
                .FirstOrDefaultAsync(cart => cart.UserId == userId);
        }

        public async Task<CartItem?> GetCartItemAsync(Guid userId, int cartItemId)
        {
            return await _context.CartItems
                .Include(ci => ci.ProductVariant)
                .ThenInclude(pv => pv.Product)
                .FirstOrDefaultAsync(ci => ci.Cart.UserId == userId && ci.Id == cartItemId);
        }

        public async Task<IEnumerable<ShopCartItemResponse>> GetCartItemsAsync(Guid userId)
        {
            return await _context.CartItems
                .AsNoTracking()
                .Where(ci => ci.Cart.UserId == userId)
                .OrderByDescending(ci => ci.CreatedDate)
                .Select(_cartItemSelector)
                .ToListAsync();
        }

        public async Task<CartItem?> GetCartItemWithVariantAsync(Guid userId, int cartItemId, Guid productVariantId)
        {
            return await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.Cart.UserId == userId 
                                        && ci.ProductVariantId == productVariantId
                                        && ci.Id != cartItemId);
        }



        // --- VALIDATE METHODS --- //



        // --- WRITE METHODS --- //

        public void CreateCart(Cart cart)
        {
            _context.Carts.Add(cart);
        }

        public void DeleteCartItem(CartItem cartItem)
        {
            cartItem.IsDeleted = true;
        }
    }
}
