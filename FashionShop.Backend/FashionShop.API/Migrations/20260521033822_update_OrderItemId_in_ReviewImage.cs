using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FashionShop.API.Migrations
{
    /// <inheritdoc />
    public partial class update_OrderItemId_in_ReviewImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrderDetailId",
                table: "Reviews");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OrderDetailId",
                table: "Reviews",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
