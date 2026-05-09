using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FashionShop.API.Migrations
{
    /// <inheritdoc />
    public partial class FixOrderItemRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_OrderItems_OrderDetailId",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_OrderDetailId",
                table: "Reviews");

            migrationBuilder.AddColumn<int>(
                name: "OrderItemId",
                table: "Reviews",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_OrderItemId",
                table: "Reviews",
                column: "OrderItemId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_OrderItems_OrderItemId",
                table: "Reviews",
                column: "OrderItemId",
                principalTable: "OrderItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_OrderItems_OrderItemId",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_OrderItemId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "OrderItemId",
                table: "Reviews");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_OrderDetailId",
                table: "Reviews",
                column: "OrderDetailId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_OrderItems_OrderDetailId",
                table: "Reviews",
                column: "OrderDetailId",
                principalTable: "OrderItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
