using FashionShop.API.Data;
using FashionShop.API.Repositories.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Category.Responses;
using FashionShop.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FashionShop.API.Repositories.Shop
{
    public class ShopCategoryRepository : IShopCategoryRepository
    {
        private readonly FashionDbContext _context;

        public ShopCategoryRepository(FashionDbContext context)
        {
            _context = context;
        }

        private static readonly Expression<Func<Category, ShopCategoryResponse>> _categorySelector =
            x => new ShopCategoryResponse
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Slug = x.Slug,
                ParentId = x.ParentId,
                ImageUrl = x.ImageUrl,
            };
    }
}
