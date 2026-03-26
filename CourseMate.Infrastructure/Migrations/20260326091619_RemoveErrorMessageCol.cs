using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseMate.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveErrorMessageCol : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ErrorMessage",
                table: "FileEntries");

            migrationBuilder.AlterColumn<double>(
                name: "FileSize",
                table: "FileEntries",
                type: "double precision",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "FileSize",
                table: "FileEntries",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double precision");

            migrationBuilder.AddColumn<string>(
                name: "ErrorMessage",
                table: "FileEntries",
                type: "character varying(1024)",
                maxLength: 1024,
                nullable: false,
                defaultValue: "");
        }
    }
}
