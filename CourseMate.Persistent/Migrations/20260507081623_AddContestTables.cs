using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseMate.Persistent.Migrations
{
    /// <inheritdoc />
    public partial class AddContestTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LessonQuizAnswers_LessonQuizQuestions_QuestionId",
                table: "LessonQuizAnswers");

            migrationBuilder.DropForeignKey(
                name: "FK_LessonQuizQuestions_LessonQuizzes_QuizId",
                table: "LessonQuizQuestions");

            migrationBuilder.DropTable(
                name: "LessonSlides");

            migrationBuilder.RenameColumn(
                name: "QuizId",
                table: "LessonQuizQuestions",
                newName: "LessonQuizId");

            migrationBuilder.RenameIndex(
                name: "IX_LessonQuizQuestions_QuizId",
                table: "LessonQuizQuestions",
                newName: "IX_LessonQuizQuestions_LessonQuizId");

            migrationBuilder.RenameColumn(
                name: "QuestionId",
                table: "LessonQuizAnswers",
                newName: "LessonQuizQuestionId");

            migrationBuilder.RenameIndex(
                name: "IX_LessonQuizAnswers_QuestionId",
                table: "LessonQuizAnswers",
                newName: "IX_LessonQuizAnswers_LessonQuizQuestionId");

            migrationBuilder.AlterColumn<string>(
                name: "VideoUrl",
                table: "LessonVideos",
                type: "character varying(1024)",
                maxLength: 1024,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "citext",
                oldMaxLength: 1024);

            migrationBuilder.AlterColumn<string>(
                name: "Text",
                table: "LessonQuizQuestions",
                type: "character varying(32768)",
                maxLength: 32768,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Text",
                table: "LessonQuizAnswers",
                type: "character varying(32768)",
                maxLength: 32768,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateTable(
                name: "Contests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "citext", maxLength: 1024, nullable: false),
                    Description = table.Column<string>(type: "citext", maxLength: 32768, nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    StartTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    EndTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    DurationInMinutes = table.Column<int>(type: "integer", nullable: false),
                    AllowedLanguages = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    MemoryLimit = table.Column<int>(type: "integer", nullable: false),
                    TimeLimit = table.Column<int>(type: "integer", nullable: false),
                    AntiCheatLevel = table.Column<int>(type: "integer", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Contests_AspNetUsers_CreatorId",
                        column: x => x.CreatorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContestExercises",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContestId = table.Column<Guid>(type: "uuid", nullable: false),
                    ExerciseId = table.Column<Guid>(type: "uuid", nullable: false),
                    ScoreWeight = table.Column<int>(type: "integer", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContestExercises", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContestExercises_Contests_ContestId",
                        column: x => x.ContestId,
                        principalTable: "Contests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ContestExercises_Exercises_ExerciseId",
                        column: x => x.ExerciseId,
                        principalTable: "Exercises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContestRegistrations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContestId = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    RegistrationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    JoinTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    SubmitTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDisqualified = table.Column<bool>(type: "boolean", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContestRegistrations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContestRegistrations_AspNetUsers_StudentId",
                        column: x => x.StudentId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ContestRegistrations_Contests_ContestId",
                        column: x => x.ContestId,
                        principalTable: "Contests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContestSubmissions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContestId = table.Column<Guid>(type: "uuid", nullable: false),
                    ExerciseId = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    Language = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    Code = table.Column<string>(type: "character varying(32768)", maxLength: 32768, nullable: false),
                    Score = table.Column<int>(type: "integer", nullable: false),
                    TotalTime = table.Column<float>(type: "real", nullable: false),
                    TotalMemory = table.Column<int>(type: "integer", nullable: false),
                    IsFinal = table.Column<bool>(type: "boolean", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContestSubmissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContestSubmissions_AspNetUsers_StudentId",
                        column: x => x.StudentId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ContestSubmissions_Contests_ContestId",
                        column: x => x.ContestId,
                        principalTable: "Contests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ContestSubmissions_Exercises_ExerciseId",
                        column: x => x.ExerciseId,
                        principalTable: "Exercises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContestExercises_ContestId",
                table: "ContestExercises",
                column: "ContestId");

            migrationBuilder.CreateIndex(
                name: "IX_ContestExercises_ExerciseId",
                table: "ContestExercises",
                column: "ExerciseId");

            migrationBuilder.CreateIndex(
                name: "IX_ContestRegistrations_ContestId",
                table: "ContestRegistrations",
                column: "ContestId");

            migrationBuilder.CreateIndex(
                name: "IX_ContestRegistrations_StudentId",
                table: "ContestRegistrations",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Contests_CreatorId",
                table: "Contests",
                column: "CreatorId");

            migrationBuilder.CreateIndex(
                name: "IX_ContestSubmissions_ContestId",
                table: "ContestSubmissions",
                column: "ContestId");

            migrationBuilder.CreateIndex(
                name: "IX_ContestSubmissions_ExerciseId",
                table: "ContestSubmissions",
                column: "ExerciseId");

            migrationBuilder.CreateIndex(
                name: "IX_ContestSubmissions_StudentId",
                table: "ContestSubmissions",
                column: "StudentId");

            migrationBuilder.AddForeignKey(
                name: "FK_LessonQuizAnswers_LessonQuizQuestions_LessonQuizQuestionId",
                table: "LessonQuizAnswers",
                column: "LessonQuizQuestionId",
                principalTable: "LessonQuizQuestions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LessonQuizQuestions_LessonQuizzes_LessonQuizId",
                table: "LessonQuizQuestions",
                column: "LessonQuizId",
                principalTable: "LessonQuizzes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LessonQuizAnswers_LessonQuizQuestions_LessonQuizQuestionId",
                table: "LessonQuizAnswers");

            migrationBuilder.DropForeignKey(
                name: "FK_LessonQuizQuestions_LessonQuizzes_LessonQuizId",
                table: "LessonQuizQuestions");

            migrationBuilder.DropTable(
                name: "ContestExercises");

            migrationBuilder.DropTable(
                name: "ContestRegistrations");

            migrationBuilder.DropTable(
                name: "ContestSubmissions");

            migrationBuilder.DropTable(
                name: "Contests");

            migrationBuilder.RenameColumn(
                name: "LessonQuizId",
                table: "LessonQuizQuestions",
                newName: "QuizId");

            migrationBuilder.RenameIndex(
                name: "IX_LessonQuizQuestions_LessonQuizId",
                table: "LessonQuizQuestions",
                newName: "IX_LessonQuizQuestions_QuizId");

            migrationBuilder.RenameColumn(
                name: "LessonQuizQuestionId",
                table: "LessonQuizAnswers",
                newName: "QuestionId");

            migrationBuilder.RenameIndex(
                name: "IX_LessonQuizAnswers_LessonQuizQuestionId",
                table: "LessonQuizAnswers",
                newName: "IX_LessonQuizAnswers_QuestionId");

            migrationBuilder.AlterColumn<string>(
                name: "VideoUrl",
                table: "LessonVideos",
                type: "citext",
                maxLength: 1024,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(1024)",
                oldMaxLength: 1024);

            migrationBuilder.AlterColumn<string>(
                name: "Text",
                table: "LessonQuizQuestions",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(32768)",
                oldMaxLength: 32768);

            migrationBuilder.AlterColumn<string>(
                name: "Text",
                table: "LessonQuizAnswers",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(32768)",
                oldMaxLength: 32768);

            migrationBuilder.CreateTable(
                name: "LessonSlides",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    FileUrl = table.Column<string>(type: "citext", maxLength: 1024, nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    LastModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LessonId = table.Column<Guid>(type: "uuid", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true)
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
                name: "IX_LessonSlides_LessonId",
                table: "LessonSlides",
                column: "LessonId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_LessonQuizAnswers_LessonQuizQuestions_QuestionId",
                table: "LessonQuizAnswers",
                column: "QuestionId",
                principalTable: "LessonQuizQuestions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LessonQuizQuestions_LessonQuizzes_QuizId",
                table: "LessonQuizQuestions",
                column: "QuizId",
                principalTable: "LessonQuizzes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
