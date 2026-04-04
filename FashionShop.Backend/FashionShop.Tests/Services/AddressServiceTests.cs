using AutoMapper;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.API.Services.Shop;
using FashionShop.Core.Contracts.Shop.Address.Responses;
using FashionShop.Core.Entities;
using Moq;

namespace FashionShop.Tests.Services
{
    public class AddressServiceTests
    {
        private readonly Mock<IAddressRepository> _mockAddressRepo;
        private readonly Mock<IUserRepository> _mockUserRepo;
        private readonly Mock<IMapper> _mockMapper;

        private readonly ShopAddressService _addressService;

        public AddressServiceTests()
        {
            _mockAddressRepo = new Mock<IAddressRepository>();
            _mockUserRepo = new Mock<IUserRepository>();
            _mockMapper = new Mock<IMapper>();

            _addressService = new ShopAddressService(
                _mockAddressRepo.Object,
                _mockUserRepo.Object,
                _mockMapper.Object
            );
        }

        // --- TEST CASE 1: Người dùng không tồn tại thì phải báo lỗi ---
        [Fact]
        public async Task GetAddresses_ShouldReturnEmptyList_WhenUserDoesNotExist()
        {
            // ARRANGE
            var userId = Guid.NewGuid();

            // Giả lập repo trả về list rỗng (vì user ko có hoặc ko có địa chỉ)
            _mockAddressRepo.Setup(x => x.GetAddressesByUserIdAsync(userId))
                            .ReturnsAsync(new List<Address>());

            _mockMapper.Setup(m => m.Map<IEnumerable<AddressResponse>>(It.IsAny<List<Address>>()))
                       .Returns(new List<AddressResponse>());

            // ACT
            var result = await _addressService.GetAddressesByUserIdAsync(userId);

            // ASSERT
            Assert.NotNull(result);       // Kết quả không null
            Assert.Empty(result);         // Kết quả là list rỗng
        }

        // --- TEST CASE 2: Người dùng tồn tại thì trả về danh sách ---
        [Fact]
        public async Task GetAddresses_ShouldReturnList_WhenUserExists()
        {
            // ARRANGE (Chuẩn bị)
            var userId = Guid.NewGuid();

            // Giả lập 1: User có tồn tại
            _mockUserRepo.Setup(x => x.GetUserByIdAsync(userId))
                         .ReturnsAsync(new User { Id = userId, FullName = "Test User" });

            // Giả lập 2: Repository trả về 1 list chứa 2 địa chỉ
            var fakeAddresses = new List<Address>
            {
                new Address { Id = Guid.NewGuid(), Street = "Street 1" },
                new Address { Id = Guid.NewGuid(), Street = "Street 2" }
            };
            _mockAddressRepo.Setup(x => x.GetAddressesByUserIdAsync(userId))
                            .ReturnsAsync(fakeAddresses);

            // Giả lập 3: Mapper mapping từ Entity sang DTO
            var fakeDtos = new List<AddressResponse>
            {
                new AddressResponse { Street = "Street 1" },
                new AddressResponse { Street = "Street 2" }
            };
            _mockMapper.Setup(m => m.Map<IEnumerable<AddressResponse>>(fakeAddresses))
                       .Returns(fakeDtos);

            // ACT (Hành động)
            var result = await _addressService.GetAddressesByUserIdAsync(userId);

            // ASSERT (Khẳng định)
            Assert.NotNull(result); // Kết quả ko được null
            Assert.Equal(2, result.Count()); // Kết quả phải có đúng 2 phần tử
        }
    }
}
