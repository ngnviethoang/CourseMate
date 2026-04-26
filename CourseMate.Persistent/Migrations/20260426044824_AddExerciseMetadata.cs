using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseMate.Persistent.Migrations
{
    /// <inheritdoc />
    public partial class AddExerciseMetadata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Exercises",
                type: "character varying(256)",
                maxLength: 256,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(1024)",
                oldMaxLength: 1024);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Exercises",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(32768)",
                oldMaxLength: 32768);

            migrationBuilder.AddColumn<string>(
                name: "Constraints",
                table: "Exercises",
                type: "jsonb",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddColumn<string>(
                name: "Examples",
                table: "Exercises",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Hints",
                table: "Exercises",
                type: "jsonb",
                nullable: false,
                defaultValue: "[]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Constraints",
                table: "Exercises");

            migrationBuilder.DropColumn(
                name: "Examples",
                table: "Exercises");

            migrationBuilder.DropColumn(
                name: "Hints",
                table: "Exercises");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Exercises",
                type: "character varying(1024)",
                maxLength: 1024,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(256)",
                oldMaxLength: 256);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Exercises",
                type: "character varying(32768)",
                maxLength: 32768,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(2000)",
                oldMaxLength: 2000);
        }
    }
}
