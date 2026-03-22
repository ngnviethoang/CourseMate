using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseMate.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRowVersionColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "UserLessonProgresses",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "Reviews",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "Payments",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "Orders",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "OrderItems",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "Notifications",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "LessonVideos",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "Lessons",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "LessonReadings",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "LessonQuizzes",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "LessonCodings",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "Enrollments",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "Courses",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "Chapters",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "Categories",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "Carts",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "CartItems",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "xmin",
                table: "UserLessonProgresses");

            migrationBuilder.DropColumn(
                name: "xmin",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "xmin",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "xmin",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "xmin",
                table: "OrderItems");

            migrationBuilder.DropColumn(
                name: "xmin",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "xmin",
                table: "LessonVideos");

            migrationBuilder.DropColumn(
                name: "xmin",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "xmin",
                table: "LessonReadings");

            migrationBuilder.DropColumn(
                name: "xmin",
                table: "LessonQuizzes");

            migrationBuilder.DropColumn(
                name: "xmin",
                table: "LessonCodings");

            migrationBuilder.DropColumn(
                name: "xmin",
                table: "Enrollments");

            migrationBuilder.DropColumn(
                name: "xmin",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "xmin",
                table: "Chapters");

            migrationBuilder.DropColumn(
                name: "xmin",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "xmin",
                table: "Carts");

            migrationBuilder.DropColumn(
                name: "xmin",
                table: "CartItems");
        }
    }
}
