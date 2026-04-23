using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseMate.Persistent.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePaymentTransactions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Orders",
                type: "character varying(32768)",
                maxLength: 32768,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "PaymentTransactions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Currency = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    Amount = table.Column<decimal>(type: "numeric", nullable: false),
                    Provider = table.Column<string>(type: "citext", maxLength: 1024, nullable: false),
                    FailReason = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    OrderId = table.Column<Guid>(type: "uuid", nullable: false),
                    TransactionId = table.Column<string>(type: "citext", maxLength: 1024, nullable: false),
                    RawRequest = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    RawResponse = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentTransactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PaymentTransactions_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PaymentTransactions_OrderId",
                table: "PaymentTransactions",
                column: "OrderId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PaymentTransactions");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Orders");

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric", nullable: false),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    LastModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    OrderId = table.Column<Guid>(type: "uuid", nullable: false),
                    Provider = table.Column<string>(type: "citext", maxLength: 1024, nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    TransactionId = table.Column<string>(type: "citext", maxLength: 1024, nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Payments_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Payments_OrderId",
                table: "Payments",
                column: "OrderId",
                unique: true);
        }
    }
}
