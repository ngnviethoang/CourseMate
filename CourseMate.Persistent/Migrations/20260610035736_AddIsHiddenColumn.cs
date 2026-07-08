using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseMate.Persistent.Migrations
{
    /// <inheritdoc />
    public partial class AddIsHiddenColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /* migrationBuilder.AddColumn<bool>(
                name: "IsHidden",
                table: "Exercises",
                type: "boolean",
                nullable: false,
                defaultValue: false); */
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsHidden",
                table: "Exercises");
        }
    }
}
