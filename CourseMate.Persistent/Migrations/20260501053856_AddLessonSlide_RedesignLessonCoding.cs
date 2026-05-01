using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseMate.Persistent.Migrations
{
    /// <inheritdoc />
    public partial class AddLessonSlide_RedesignLessonCoding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExpectedOutput",
                table: "LessonCodings");

            migrationBuilder.DropColumn(
                name: "ProblemStatement",
                table: "LessonCodings");

            migrationBuilder.DropColumn(
                name: "StarterCode",
                table: "LessonCodings");

            migrationBuilder.AddColumn<Guid>(
                name: "ExerciseId",
                table: "LessonCodings",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "LessonSlides",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    LessonId = table.Column<Guid>(type: "uuid", nullable: false),
                    FileUrl = table.Column<string>(type: "citext", maxLength: 1024, nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LessonSlides", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LessonSlides_Lessons_LessonId",
                        column: x => x.LessonId,
                        principalTable: "Lessons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LessonCodings_ExerciseId",
                table: "LessonCodings",
                column: "ExerciseId");

            migrationBuilder.CreateIndex(
                name: "IX_LessonSlides_LessonId",
                table: "LessonSlides",
                column: "LessonId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_LessonCodings_Exercises_ExerciseId",
                table: "LessonCodings",
                column: "ExerciseId",
                principalTable: "Exercises",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LessonCodings_Exercises_ExerciseId",
                table: "LessonCodings");

            migrationBuilder.DropTable(
                name: "LessonSlides");

            migrationBuilder.DropIndex(
                name: "IX_LessonCodings_ExerciseId",
                table: "LessonCodings");

            migrationBuilder.DropColumn(
                name: "ExerciseId",
                table: "LessonCodings");

            migrationBuilder.AddColumn<string>(
                name: "ExpectedOutput",
                table: "LessonCodings",
                type: "citext",
                maxLength: 32768,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProblemStatement",
                table: "LessonCodings",
                type: "citext",
                maxLength: 32768,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StarterCode",
                table: "LessonCodings",
                type: "citext",
                maxLength: 32768,
                nullable: false,
                defaultValue: "");
        }
    }
}
