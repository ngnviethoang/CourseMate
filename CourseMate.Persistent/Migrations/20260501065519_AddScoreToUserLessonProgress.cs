using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseMate.Persistent.Migrations
{
    /// <inheritdoc />
    public partial class AddScoreToUserLessonProgress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Score",
                table: "UserLessonProgresses",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Score",
                table: "UserLessonProgresses");
        }
    }
}
