using AutoMapper;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Repositories.Shop.Interfaces;
using FashionShop.API.Services.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Cart.Requests;
using FashionShop.Core.Contracts.Shop.Cart.Responses;
using FashionShop.Core.Entities;

namespace FashionShop.API.Services.Shop
{
    public class ShopCartService : IShopCartService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ShopCartService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }



        // --- READ METHODS --- //

        public async Task<IEnumerable<ShopCartItemResponse>> GetCartItemsAsync(Guid userId)
            => await _unitOfWork.ShopCarts.GetCartItemsAsync(userId);



        // --- WRITE METHODS --- //

        public async Task<ShopCartResponse> CreateCartItemAsync(Guid userId, ShopCreateCartItemRequest request)
        {
            var cart = await _unitOfWork.ShopCarts.GetCartAsync(userId);

            // 1. Chưa có giỏ hàng => Tạo mới giỏ hàng đồng thời tạo sản phẩm trong giỏ hàng
            if (cart == null)
            {
                cart = new Cart
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    CartItems = new List<CartItem>
                    {
                        new CartItem
                        {
                            ProductVariantId = request.ProductVariantId,
                            Quantity = request.Quantity,
                            IsSelected = true,
                            CreatedDate = DateTime.UtcNow,
                        }
                    }
                };

                _unitOfWork.ShopCarts.CreateCart(cart);
            }
            // 2. Đã có giỏ hàng
            else
            {
                // Lấy sản phẩm đã có trong giỏ hàng
                var existingCartItem = cart.CartItems
                    .FirstOrDefault(ci => ci.ProductVariantId == request.ProductVariantId);

                // 2.1. Sản phẩm đã tồn tại trong giỏ hàng => Thêm số lượng
                if (existingCartItem != null)
                {
                    existingCartItem.Quantity += request.Quantity;
                    existingCartItem.UpdatedDate = DateTime.UtcNow;
                    existingCartItem.IsSelected = true;
                }
                // 2.2. Sản phẩm chưa có trong giỏ hàng => Tạo mới sản phẩm trong giỏ hàng
                else
                {
                    var newCartItem = new CartItem
                    {
                        ProductVariantId = request.ProductVariantId,
                        Quantity = request.Quantity,
                        IsSelected = true,
                        CreatedDate = DateTime.UtcNow,
                    };
                    cart.CartItems.Add(newCartItem);
                }
            }

            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<ShopCartResponse>(cart);
        }

        public async Task<ShopCartResponse> UpdateCartItemAsync(Guid userId, int cartItemId, ShopUpdateCartItemRequest request)
        {
            // 1. Lấy CartItem hiện tại
            var cartItem = await _unitOfWork.ShopCarts.GetCartItemAsync(userId, cartItemId);
            if (cartItem == null) throw new KeyNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng!");

            // 2. Lấy thông tin biến thể mới (để kiểm tra stock và cùng sản phẩm)
            var newVariant = await _unitOfWork.AdminProducts.FindProductVariantByIdAsync(request.ProductVariantId);
            if (newVariant == null) throw new KeyNotFoundException("Không tìm thấy biến thể sản phẩm mới!");

            if (cartItem.ProductVariant.ProductId != newVariant.ProductId)
                throw new InvalidOperationException("Chỉ được phép đổi màu sắc hoặc kích cỡ của cùng một sản phẩm!");

            // 3. Kiểm tra tồn kho của biến thể mới
            if (request.Quantity > newVariant.StockQuantity)
                throw new InvalidOperationException($"Số lượng yêu cầu ({request.Quantity}) vượt quá số lượng còn lại trong kho ({newVariant.StockQuantity})!");

            // 4. Kiểm tra xem biến thể mới này đã tồn tại ở một dòng khác trong giỏ hàng chưa
            var existingItemWithVariant = await _unitOfWork.ShopCarts.GetCartItemWithVariantAsync(userId, cartItemId, request.ProductVariantId);

            if (existingItemWithVariant != null)
            {
                // TRƯỜNG HỢP GỘP DÒNG: 
                // Ví dụ: Giỏ đang có [Áo đỏ size M] và [Áo đỏ size L]. 
                // User sửa [Áo đỏ size L] thành [Áo đỏ size M].

                existingItemWithVariant.Quantity += request.Quantity; // Cộng dồn số lượng mới vào dòng cũ

                // Kiểm tra lại stock lần nữa sau khi cộng dồn
                if (existingItemWithVariant.Quantity > newVariant.StockQuantity)
                    existingItemWithVariant.Quantity = newVariant.StockQuantity;

                existingItemWithVariant.UpdatedDate = DateTime.UtcNow;
                existingItemWithVariant.IsSelected = request.IsSelected; // Dùng giá trị từ FE

                // Xóa dòng cũ (dòng vừa được yêu cầu sửa)
                _unitOfWork.ShopCarts.DeleteCartItem(cartItem);
            }
            else
            {
                // TRƯỜNG HỢP CẬP NHẬT TRỰC TIẾP TRÊN DÒNG HIỆN TẠI
                cartItem.ProductVariantId = request.ProductVariantId;
                cartItem.Quantity = request.Quantity;
                cartItem.IsSelected = request.IsSelected; // Quan trọng: Cập nhật theo yêu cầu của FE
                cartItem.UpdatedDate = DateTime.UtcNow;
            }

            await _unitOfWork.SaveChangesAsync();

            var cart = await _unitOfWork.ShopCarts.GetCartAsync(userId);
            return _mapper.Map<ShopCartResponse>(cart);
        }

        public async Task DeleteCartItemAsync(Guid userId, int cartItemId)
        {
            var cartItem = await _unitOfWork.ShopCarts.GetCartItemAsync(userId, cartItemId);

            if (cartItem == null) throw new KeyNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng!");

            _unitOfWork.ShopCarts.DeleteCartItem(cartItem);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
