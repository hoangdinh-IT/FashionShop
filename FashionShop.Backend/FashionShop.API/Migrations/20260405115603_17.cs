using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FashionShop.API.Migrations
{
    /// <inheritdoc />
    public partial class _17 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SKU",
                table: "ProductVariants",
                newName: "Sku");

            migrationBuilder.RenameIndex(
                name: "IX_ProductVariants_SKU",
                table: "ProductVariants",
                newName: "IX_ProductVariants_Sku");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Sku",
                table: "ProductVariants",
                newName: "SKU");

            migrationBuilder.RenameIndex(
                name: "IX_ProductVariants_Sku",
                table: "ProductVariants",
                newName: "IX_ProductVariants_SKU");
        }
    }
}
