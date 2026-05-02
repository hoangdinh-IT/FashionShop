using AutoMapper;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Services.Admin.Interfaces;
using FashionShop.Core.Contracts.Admin.Order.Requests;
using FashionShop.Core.Contracts.Admin.Order.Responses;
using FashionShop.Core.Enums;
using FashionShop.Core.Models;

namespace FashionShop.API.Services.Admin
{
    public class AdminOrderService : IAdminOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminOrderService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }



        // --- READ METHODS --- //

        public async Task<PagedResult<AdminOrderResponse>> GetOrdersAsync(AdminOrderListRequest request)
            => await _unitOfWork.AdminOrders.GetOrdersAsync(request);

        public async Task<AdminOrderResponse?> GetOrderByIdAsync(Guid orderId)
            => await _unitOfWork.AdminOrders.GetOrderByIdAsync(orderId);



        // --- WRITE METHODS --- //

        public async Task<AdminOrderResponse?> UpdateOrderAsync(Guid orderId, UpdateOrderRequest request)
        {
            var order = await _unitOfWork.AdminOrders.FindOrderByIdAsync(orderId);
            if (order == null) throw new KeyNotFoundException("Không tìm thấy đơn hàng!");

            if (order.OrderStatus == OrderStatus.Success || order.OrderStatus == OrderStatus.Cancelled)
                throw new InvalidOperationException($"Không thể thay đổi trạng thái khi đơn hàng đã {order.OrderStatus.ToString()}");

            if (request.OrderStatus.HasValue) 
                order.OrderStatus = request.OrderStatus.Value;

            switch (request.OrderStatus)
            {
                case OrderStatus.Shipping:
                    var shippingTrackingCode = GenerateTrackingCode(orderId);
                    order.ShippingTrackingCode = shippingTrackingCode;
                    break;

                case OrderStatus.Success:
                    if (order.PaymentMethod == PaymentMethod.COD)
                    {
                        order.PaymentStatus = PaymentStatus.Paid;
                        order.PaymentDate = DateTime.UtcNow;
                    }
                    break;

                case OrderStatus.Cancelled:
                    foreach (var detail in order.OrderDetails)
                    {
                        var variant = await _unitOfWork.AdminProducts.GetProductVariantByIdAsync(detail.ProductVariantId);
                        if (variant != null)
                        {
                            variant.StockQuantity += detail.Quantity;
                        }
                    }
                    break;
            }

            if (request.PaymentStatus.HasValue && order.PaymentStatus != request.PaymentStatus.Value)
            {
                order.PaymentStatus = request.PaymentStatus.Value;

                if (order.PaymentStatus == PaymentStatus.Paid)
                    order.PaymentDate = DateTime.UtcNow;
                else
                    order.PaymentDate = null;
            }

            await _unitOfWork.SaveChangesAsync();

            return await _unitOfWork.AdminOrders.GetOrderByIdAsync(orderId);
        }

        private string GenerateTrackingCode(Guid orderId)
        {
            // 1. Lấy thời gian hiện tại (Format: YYMMDD)
            string datePart = DateTime.Now.ToString("yyMMdd");

            // 2. Lấy một phần của Guid để đảm bảo tính duy nhất (tránh trùng nếu tạo nhiều đơn cùng 1 giây)
            string uniquePart = orderId.ToString().Substring(0, 4).ToUpper();

            // 3. Kết hợp: Tiền tố + Ngày + Unique
            return $"RKA{datePart}{uniquePart}";
            // Kết quả dạng: SHP260501B4D2
        }
    }
}
