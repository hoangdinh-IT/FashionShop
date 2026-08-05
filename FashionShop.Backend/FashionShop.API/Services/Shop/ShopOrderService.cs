using AutoMapper;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Services.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Order.Requests;
using FashionShop.Core.Contracts.Shop.Order.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Enums;
using FashionShop.Core.Extensions;

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

        public async Task<IEnumerable<ShopOrderSummaryResponse?>> GetOrdersAsync(Guid userId)
            => await _unitOfWork.ShopOrders.GetOrdersAsync(userId);

        public async Task<ShopOrderDetailResponse?> GetOrderByIdAsync(Guid userId, Guid orderId)
        {
            var order = await _unitOfWork.ShopOrders.FindOrderByIdAsync(userId, orderId);

            if (order == null) throw new KeyNotFoundException("Không tìm thấy đơn hàng!");

            return await _unitOfWork.ShopOrders.GetOrderByIdAsync(userId, orderId);
        }



        // --- WRITE METHODS --- //

        public async Task<ShopOrderDetailResponse?> CreateOrderAsync(Guid userId, ShopCreateOrderRequest request)
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

                    decimal unitPrice = variant.Product.FinalPrice;
                    decimal totalLine = unitPrice * item.Quantity;
                    subTotal += totalLine;

                    orderDetails.Add(new OrderItem
                    {
                        ProductVariantId = item.ProductVariantId,
                        UnitPrice = unitPrice,
                        Quantity = item.Quantity,
                        TotalLine = totalLine,
                    });

                    variant.StockQuantity -= item.Quantity;
                }

                var orderId = Guid.NewGuid();
                int shippingFee = subTotal >= 500000 ? 0 : 30000;
                decimal discountAmount = 0;
                CouponUsage? couponUsage = null;

                if (request.CouponId.HasValue)
                {
                    var coupon = await _unitOfWork.AdminCoupons.FindCouponByIdAsync(request.CouponId.Value);
                    if (coupon != null &&
                        coupon.StartDate <= DateTime.UtcNow &&
                        coupon.EndDate >= DateTime.UtcNow &&
                        subTotal >= coupon.MinOrderValue &&
                        coupon.UsedCount < coupon.Quantity &&
                        coupon.IsActive)
                    {
                        if (coupon.DiscountType == DiscountType.Percentage)
                        {
                            discountAmount = subTotal * coupon.DiscountAmount / 100;

                            if (coupon.MaxDiscountAmount.HasValue)
                            {
                                discountAmount = Math.Min(discountAmount, coupon.MaxDiscountAmount.Value);
                            }
                        }
                        else
                        {
                            discountAmount = coupon.DiscountAmount;
                        }

                        coupon.UsedCount += 1;

                        couponUsage = new CouponUsage
                        {
                            UserId = userId,
                            CouponId = coupon.Id,
                            OrderId = orderId,
                            UsedDate = DateTime.UtcNow,
                        };
                    }
                    
                    discountAmount = Math.Min(discountAmount, subTotal);
                }

                var newOrder = _mapper.Map<Order>(request);
                newOrder.Id = orderId;
                newOrder.UserId = userId;
                newOrder.OrderDate = DateTime.UtcNow;
                newOrder.SubTotal = subTotal;
                newOrder.ShippingFee = shippingFee;
                newOrder.DiscountAmount = discountAmount;
                newOrder.TotalAmount = subTotal + shippingFee - discountAmount;
                newOrder.OrderItems = orderDetails;

                _unitOfWork.ShopOrders.Create(newOrder);

                if (couponUsage != null)
                {
                    _unitOfWork.ShopCoupons.CreateCouponUsage(couponUsage);
                }

                await _unitOfWork.SaveChangesAsync();

                await _unitOfWork.CommitTransactionAsync();

                return await _unitOfWork.ShopOrders.GetOrderByIdAsync(userId, newOrder.Id);
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw new Exception("Đặt hàng thất bại: " + ex.Message);
            }
        }

        public async Task<ShopOrderDetailResponse?> UpdateCancelledAsync(Guid userId, Guid orderId)
        {
            var order = await _unitOfWork.ShopOrders.FindOrderByIdAsync(userId, orderId);
            if (order == null) throw new KeyNotFoundException("Không tìm thấy đơn hàng!");

            order.OrderStatus = OrderStatus.Cancelled;

            await _unitOfWork.SaveChangesAsync();

            return await _unitOfWork.ShopOrders.GetOrderByIdAsync(userId, orderId);
        }
    }
}
