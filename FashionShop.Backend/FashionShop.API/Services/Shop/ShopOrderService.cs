using AutoMapper;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Services.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Order.Requests;
using FashionShop.Core.Contracts.Shop.Order.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Enums;

namespace FashionShop.API.Services.Shop
{
    public class ShopOrderService : IShopOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ShopOrderService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        // --- READ METHODS --- //

        public async Task<IEnumerable<ShopOrderResponse?>> GetOrdersAsync(Guid userId)
            => await _unitOfWork.ShopOrders.GetOrdersAsync(userId);

        public async Task<ShopOrderResponse?> GetOrderByIdAsync(Guid userId, Guid orderId)
        {
            var order = await _unitOfWork.ShopOrders.FindOrderByIdAsync(userId, orderId);

            if (order == null) throw new KeyNotFoundException("Không tìm thấy đơn hàng!");

            return await _unitOfWork.ShopOrders.GetOrderByIdAsync(userId, orderId);
        }



        // --- WRITE METHODS --- //

        public async Task<ShopOrderResponse?> CreateOrderAsync(Guid userId, ShopCreateOrderRequest request)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                decimal subTotal = 0;
                var orderDetails = new List<OrderItem>();

                foreach (var item in request.OrderItems)
                {
                    var variant = await _unitOfWork.ShopProducts.FindProductVariantByIdAsync(item.ProductVariantId);
                    if (variant == null) throw new KeyNotFoundException("Không tìm thấy biến thể sản phẩm!");

                    if (item.Quantity > variant.StockQuantity) 
                        throw new ArgumentException($"Số lượng yêu cầu ({item.Quantity}) vượt quá số lượng còn lại trong kho ({variant.StockQuantity})!");

                    decimal totalLine = variant.Price * item.Quantity;
                    subTotal += totalLine;

                    orderDetails.Add(new OrderItem
                    {
                        ProductVariantId = item.ProductVariantId,
                        UnitPrice = variant.Price,
                        Quantity = item.Quantity,
                        TotalLine = totalLine,
                    });

                    variant.StockQuantity -= item.Quantity;
                }

                decimal discountAmount = 0;
                if (request.VoucherId.HasValue)
                {
                    var voucher = await _unitOfWork.AdminVouchers.GetVoucherByIdAsync(request.VoucherId.Value);
                    if (voucher != null &&
                        voucher.StartDate <= DateTime.UtcNow &&
                        voucher.EndDate >= DateTime.UtcNow &&
                        subTotal >= voucher.MinOrderValue &&
                        voucher.UsedCount < voucher.Quantity &&
                        voucher.IsActive)
                    {
                        if (voucher.DiscountType == DiscountType.Percentage)
                        {
                            discountAmount = subTotal * voucher.DiscountAmount / 100;

                            if (voucher.MaxDiscountAmount.HasValue)
                            {
                                discountAmount = Math.Min(discountAmount, voucher.MaxDiscountAmount.Value);
                            }
                        }
                        else
                        {
                            discountAmount = voucher.DiscountAmount;
                        }

                        voucher.UsedCount += 1;
                    }
                    
                    discountAmount = Math.Min(discountAmount, subTotal);
                }

                var newOrder = _mapper.Map<Order>(request);
                newOrder.Id = Guid.NewGuid();
                newOrder.UserId = userId;
                newOrder.OrderDate = DateTime.UtcNow;
                newOrder.SubTotal = subTotal;
                newOrder.ShippingFee = 30000;
                newOrder.DiscountAmount = discountAmount;
                newOrder.TotalAmount = subTotal + 30000 - discountAmount;
                newOrder.OrderItems = orderDetails;

                _unitOfWork.ShopOrders.Create(newOrder);

                await _unitOfWork.CommitTransactionAsync();

                return await _unitOfWork.ShopOrders.GetOrderByIdAsync(userId, newOrder.Id);
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw new Exception("Đặt hàng thất bại: " + ex.Message);
            }
        }

        public async Task<ShopOrderResponse?> UpdateCancelledAsync(Guid userId, Guid orderId)
        {
            var order = await _unitOfWork.ShopOrders.FindOrderByIdAsync(userId, orderId);
            if (order == null) throw new KeyNotFoundException("Không tìm thấy đơn hàng!");

            order.OrderStatus = OrderStatus.Cancelled;

            await _unitOfWork.SaveChangesAsync();

            return await _unitOfWork.ShopOrders.GetOrderByIdAsync(userId, orderId);
        }
    }
}
