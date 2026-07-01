using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Pgvector;

#nullable disable

namespace CourseMate.Persistent.Migrations
{
    /// <inheritdoc />
    public partial class AddRecommendationAnalytics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CourseEmbeddings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseId = table.Column<Guid>(type: "uuid", nullable: false),
                    SourceText = table.Column<string>(type: "character varying(32768)", maxLength: 32768, nullable: false),
                    Dimensions = table.Column<int>(type: "integer", nullable: false),
                    Embedding = table.Column<Vector>(type: "vector(768)", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseEmbeddings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourseEmbeddings_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RecommendationAnalytics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseId = table.Column<Guid>(type: "uuid", nullable: false),
                    EnrollmentId = table.Column<Guid>(type: "uuid", nullable: true),
                    ContentScore = table.Column<double>(type: "double precision", nullable: false),
                    CollaborativeScore = table.Column<double>(type: "double precision", nullable: false),
                    WeaknessScore = table.Column<double>(type: "double precision", nullable: false),
                    PopularityScore = table.Column<double>(type: "double precision", nullable: false),
                    FinalScore = table.Column<double>(type: "double precision", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: false),
                    Feedback = table.Column<string>(type: "text", nullable: true),
                    FeedbackTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    EnrolledAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsCompleted = table.Column<bool>(type: "boolean", nullable: false),
                    CompletedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecommendationAnalytics", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RecommendationLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    RecommendationType = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    Strategy = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    ResultCount = table.Column<int>(type: "integer", nullable: false),
                    Payload = table.Column<string>(type: "character varying(32768)", maxLength: 32768, nullable: false),
                    TopScore = table.Column<double>(type: "double precision", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecommendationLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecommendationLogs_AspNetUsers_StudentId",
                        column: x => x.StudentId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StudentPreferences",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    FavouriteCategories = table.Column<string>(type: "jsonb", nullable: false, defaultValueSql: "'[]'::jsonb"),
                    PreferredDifficulty = table.Column<int>(type: "integer", nullable: true),
                    LearningGoal = table.Column<string>(type: "character varying(32768)", maxLength: 32768, nullable: false),
                    MinutesPerDay = table.Column<int>(type: "integer", nullable: false),
                    SkillLevel = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    RecommendContests = table.Column<bool>(type: "boolean", nullable: false),
                    RecommendExercises = table.Column<bool>(type: "boolean", nullable: false),
                    AutoRefresh = table.Column<bool>(type: "boolean", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentPreferences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentPreferences_AspNetUsers_StudentId",
                        column: x => x.StudentId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StudentSkillProfiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    Category = table.Column<string>(type: "citext", maxLength: 1024, nullable: false),
                    Difficulty = table.Column<int>(type: "integer", nullable: false),
                    TotalAttempts = table.Column<int>(type: "integer", nullable: false),
                    PassedAttempts = table.Column<int>(type: "integer", nullable: false),
                    AverageScore = table.Column<double>(type: "double precision", nullable: false),
                    AverageRuntime = table.Column<double>(type: "double precision", nullable: false),
                    MasteryScore = table.Column<double>(type: "double precision", nullable: false),
                    IsWeakArea = table.Column<bool>(type: "boolean", nullable: false),
                    LastAttemptedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentSkillProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentSkillProfiles_AspNetUsers_StudentId",
                        column: x => x.StudentId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CourseEmbeddings_CourseId",
                table: "CourseEmbeddings",
                column: "CourseId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RecommendationLogs_CreationTime",
                table: "RecommendationLogs",
                column: "CreationTime");

            migrationBuilder.CreateIndex(
                name: "IX_RecommendationLogs_StudentId_RecommendationType",
                table: "RecommendationLogs",
                columns: new[] { "StudentId", "RecommendationType" });

            migrationBuilder.CreateIndex(
                name: "IX_StudentPreferences_StudentId",
                table: "StudentPreferences",
                column: "StudentId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StudentSkillProfiles_IsWeakArea",
                table: "StudentSkillProfiles",
                column: "IsWeakArea");

            migrationBuilder.CreateIndex(
                name: "IX_StudentSkillProfiles_StudentId_Category_Difficulty",
                table: "StudentSkillProfiles",
                columns: new[] { "StudentId", "Category", "Difficulty" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CourseEmbeddings");

            migrationBuilder.DropTable(
                name: "RecommendationAnalytics");

            migrationBuilder.DropTable(
                name: "RecommendationLogs");

            migrationBuilder.DropTable(
                name: "StudentPreferences");

            migrationBuilder.DropTable(
                name: "StudentSkillProfiles");
        }
    }
}
