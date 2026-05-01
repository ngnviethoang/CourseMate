using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseMate.Persistent.Migrations
{
    /// <inheritdoc />
    public partial class AddLessonQuizTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AspNetUsers_UserId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_UserId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "NotificationType",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "ExpectedOutput",
                table: "LessonCodings");

            migrationBuilder.DropColumn(
                name: "ProblemStatement",
                table: "LessonCodings");

            migrationBuilder.DropColumn(
                name: "StarterCode",
                table: "LessonCodings");

            migrationBuilder.AddColumn<double>(
                name: "Score",
                table: "UserLessonProgresses",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<Guid>(
                name: "ExerciseId",
                table: "LessonCodings",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "LessonQuizQuestions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    QuizId = table.Column<Guid>(type: "uuid", nullable: false),
                    Text = table.Column<string>(type: "text", nullable: false),
                    Position = table.Column<int>(type: "integer", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LessonQuizQuestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LessonQuizQuestions_LessonQuizzes_QuizId",
                        column: x => x.QuizId,
                        principalTable: "LessonQuizzes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.CreateTable(
                name: "LessonQuizAnswers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    QuestionId = table.Column<Guid>(type: "uuid", nullable: false),
                    Text = table.Column<string>(type: "text", nullable: false),
                    IsCorrect = table.Column<bool>(type: "boolean", nullable: false),
                    Position = table.Column<int>(type: "integer", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LessonQuizAnswers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LessonQuizAnswers_LessonQuizQuestions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "LessonQuizQuestions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_ReceiverId",
                table: "Notifications",
                column: "ReceiverId");

            migrationBuilder.CreateIndex(
                name: "IX_LessonCodings_ExerciseId",
                table: "LessonCodings",
                column: "ExerciseId");

            migrationBuilder.CreateIndex(
                name: "IX_LessonQuizAnswers_QuestionId",
                table: "LessonQuizAnswers",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_LessonQuizQuestions_QuizId",
                table: "LessonQuizQuestions",
                column: "QuizId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AspNetUsers_ReceiverId",
                table: "Notifications",
                column: "ReceiverId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LessonCodings_Exercises_ExerciseId",
                table: "LessonCodings");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AspNetUsers_ReceiverId",
                table: "Notifications");

            migrationBuilder.DropTable(
                name: "LessonQuizAnswers");

            migrationBuilder.DropTable(
                name: "LessonSlides");

            migrationBuilder.DropTable(
                name: "LessonQuizQuestions");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_ReceiverId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_LessonCodings_ExerciseId",
                table: "LessonCodings");

            migrationBuilder.DropColumn(
                name: "Score",
                table: "UserLessonProgresses");

            migrationBuilder.DropColumn(
                name: "ExerciseId",
                table: "LessonCodings");

            migrationBuilder.AddColumn<int>(
                name: "NotificationType",
                table: "Notifications",
                type: "integer",
                nullable: false,
                defaultValue: 0);

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

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId",
                table: "Notifications",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AspNetUsers_UserId",
                table: "Notifications",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
