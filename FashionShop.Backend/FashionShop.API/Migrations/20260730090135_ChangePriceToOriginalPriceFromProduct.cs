using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FashionShop.API.Migrations
{
    /// <inheritdoc />
    public partial class ChangePriceToOriginalPriceFromProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Price",
                table: "Products",
                newName: "OriginalPrice");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "OriginalPrice",
                table: "Products",
                newName: "Price");
        }
    }
}
