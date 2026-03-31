using FashionShop.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace FashionShop.API.Data
{
    public class FashionDbContext : DbContext
    {
        public FashionDbContext(DbContextOptions<FashionDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Color> Colors{ get; set; }
        public DbSet<Size> Sizes{ get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<Voucher> Vouchers { get; set; }
        public DbSet<VoucherUsage> VoucherUsages{ get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<ReviewImage> ReviewImages { get; set; }
        public DbSet<Wishlist> Wishlists { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasQueryFilter(u => !u.IsDeleted);

            modelBuilder.Entity<Address>().HasQueryFilter(a => !a.IsDeleted);

            modelBuilder.Entity<Category>().HasQueryFilter(c => !c.IsDeleted);

            modelBuilder.Entity<Brand>().HasQueryFilter(b => !b.IsDeleted);

            modelBuilder.Entity<Color>().HasQueryFilter(c => !c.IsDeleted);
            
            modelBuilder.Entity<Size>().HasQueryFilter(s => !s.IsDeleted);
            
            modelBuilder.Entity<Product>().HasQueryFilter(p => !p.IsDeleted);
            
            modelBuilder.Entity<ProductVariant>().HasQueryFilter(pv => !pv.IsDeleted);
            
            modelBuilder.Entity<ProductImage>().HasQueryFilter(pi => !pi.IsDeleted);
            
            modelBuilder.Entity<Cart>().HasQueryFilter(c => !c.IsDeleted);
            
            modelBuilder.Entity<CartItem>().HasQueryFilter(ci => !ci.IsDeleted);
            
            modelBuilder.Entity<Order>().HasQueryFilter(o => !o.IsDeleted);
            
            modelBuilder.Entity<OrderDetail>().HasQueryFilter(od => !od.IsDeleted);
            
            modelBuilder.Entity<Voucher>().HasQueryFilter(v => !v.IsDeleted);
            
            modelBuilder.Entity<VoucherUsage>().HasQueryFilter(vu => !vu.IsDeleted);
            
            modelBuilder.Entity<Review>().HasQueryFilter(r => !r.IsDeleted);
            
            modelBuilder.Entity<ReviewImage>().HasQueryFilter(ri => !ri.IsDeleted);
            
            modelBuilder.Entity<Wishlist>().HasQueryFilter(w => !w.IsDeleted);



            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Email).IsUnique();
            });

            modelBuilder.Entity<Address>(entity =>
            {
                entity.HasOne(ud => ud.User)
                      .WithMany(u => u.Addresses)
                      .HasForeignKey(ud => ud.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasIndex(c => c.Slug)
                      .IsUnique()
                      .HasFilter("\"IsDeleted\" = false");

                entity.HasOne(c => c.ParentCategory)
                      .WithMany(c => c.SubCategories)
                      .HasForeignKey(c => c.ParentId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Brand>(entity =>
            {
                entity.HasIndex(b => b.Slug)
                      .IsUnique()
                      .HasFilter("\"IsDeleted\" = false");
            });

            modelBuilder.Entity<Color>(entity =>
            {
                entity.HasIndex(c => c.HexCode)
                      .IsUnique()
                      .HasFilter("\"IsDeleted\" = false");
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasIndex(p => p.Slug)
                      .IsUnique()
                      .HasFilter("\"IsDeleted\" = false");

                entity.HasOne(p => p.Category)
                      .WithMany(c => c.Products)
                      .HasForeignKey(p => p.CategoryId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(p => p.Brand)
                      .WithMany(b => b.Products)
                      .HasForeignKey(p => p.BrandId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ProductVariant>(entity =>
            {
                entity.HasIndex(pv => pv.SKU)
                      .IsUnique()
                      .HasFilter("\"IsDeleted\" = false");

                entity.HasIndex(pv => new { pv.ProductId, pv.ColorId, pv.SizeId })
                      .IsUnique()
                      .HasFilter("\"IsDeleted\" = false");

                entity.HasOne(pv => pv.Product)
                      .WithMany(p => p.ProductVariants)
                      .HasForeignKey(pv => pv.ProductId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(pv => pv.Color)
                      .WithMany(c => c.ProductVariants)
                      .HasForeignKey(pv => pv.ColorId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(pv => pv.Size)
                      .WithMany(s => s.ProductVariants)
                      .HasForeignKey(pv => pv.SizeId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ProductImage>(entity =>
            {
                entity.HasOne(pi => pi.Product)
                      .WithMany(p => p.ProductImages)
                      .HasForeignKey(pi => pi.ProductId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(pi => pi.Color)
                      .WithMany(c => c.ProductImages)
                      .HasForeignKey(pi => pi.ColorId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Cart>(entity =>
            {
                entity.HasOne(c => c.User)
                      .WithMany(u => u.Carts)
                      .HasForeignKey(c => c.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<CartItem>(entity =>
            {
                entity.HasOne(ci => ci.Cart)
                      .WithMany(c => c.CartItems)
                      .HasForeignKey(ci => ci.CartId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(ci => ci.ProductVariant)
                      .WithMany(pv => pv.CartItems)
                      .HasForeignKey(ci => ci.ProductVariantId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasOne(o => o.User)
                      .WithMany(u => u.Orders)
                      .HasForeignKey(o => o.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(o => o.Voucher)
                      .WithMany(v => v.Orders)
                      .HasForeignKey(o => o.VoucherId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<OrderDetail>(entity =>
            {
                entity.HasOne(od => od.Order)
                      .WithMany(o => o.OrderDetails)
                      .HasForeignKey(od => od.OrderId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(od => od.ProductVariant)
                      .WithMany(pv => pv.OrderDetails)
                      .HasForeignKey(od => od.ProductVariantId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Voucher>(entity =>
            {
                entity.HasIndex(v => v.Code)
                      .IsUnique()
                      .HasFilter("\"IsDeleted\" = false");
            });

            modelBuilder.Entity<VoucherUsage>(entity =>
            {
                entity.HasOne(vu => vu.User)
                      .WithMany(u => u.VoucherUsages)
                      .HasForeignKey(vu => vu.UserId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(vu => vu.Order)
                      .WithMany(o => o.VoucherUsages)
                      .HasForeignKey(vu => vu.OrderId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(vu => vu.Voucher)
                      .WithMany(v => v.VoucherUsages)
                      .HasForeignKey(vu => vu.VoucherId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasIndex(r => r.OrderDetailId).IsUnique();

                entity.HasOne(r => r.User)
                      .WithMany(u => u.Reviews)
                      .HasForeignKey(r => r.UserId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(r => r.Product)
                      .WithMany(p => p.Reviews)
                      .HasForeignKey(r => r.ProductId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(r => r.OrderDetail)
                      .WithMany(od => od.Reviews)
                      .HasForeignKey(r => r.OrderDetailId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ReviewImage>(entity =>
            {
                entity.HasOne(ri => ri.Review)
                      .WithMany(r => r.ReviewImages)
                      .HasForeignKey(ri => ri.ReviewId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Wishlist>(entity =>
            {
                entity.HasOne(w => w.User)
                      .WithMany(u => u.Wishlists)
                      .HasForeignKey(w => w.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(w => w.ProductVariant)
                      .WithMany(pv => pv.Wishlists)
                      .HasForeignKey(w => w.ProductVariantId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
