using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Pgvector;

#nullable disable

namespace CourseMate.Persistent.Migrations
{
    /// <inheritdoc />
    public partial class AddRecommendationSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                    RowVersion = table.Column<uint>(type: "xid", rowVersion: true, nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
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

            migrationBuilder.CreateIndex(
                name: "IX_StudentPreferences_StudentId",
                table: "StudentPreferences",
                column: "StudentId",
                unique: true);

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
                    RowVersion = table.Column<uint>(type: "xid", rowVersion: true, nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
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
                name: "IX_StudentSkillProfiles_IsWeakArea",
                table: "StudentSkillProfiles",
                column: "IsWeakArea");

            migrationBuilder.CreateIndex(
                name: "IX_StudentSkillProfiles_StudentId_Category_Difficulty",
                table: "StudentSkillProfiles",
                columns: new[] { "StudentId", "Category", "Difficulty" },
                unique: true);

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
                    RowVersion = table.Column<uint>(type: "xid", rowVersion: true, nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
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

            migrationBuilder.CreateIndex(
                name: "IX_RecommendationLogs_CreationTime",
                table: "RecommendationLogs",
                column: "CreationTime");

            migrationBuilder.CreateIndex(
                name: "IX_RecommendationLogs_StudentId_RecommendationType",
                table: "RecommendationLogs",
                columns: new[] { "StudentId", "RecommendationType" });

            migrationBuilder.CreateTable(
                name: "CourseEmbeddings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseId = table.Column<Guid>(type: "uuid", nullable: false),
                    SourceText = table.Column<string>(type: "character varying(32768)", maxLength: 32768, nullable: false),
                    Dimensions = table.Column<int>(type: "integer", nullable: false),
                    Embedding = table.Column<Vector>(type: "vector(768)", nullable: false),
                    RowVersion = table.Column<uint>(type: "xid", rowVersion: true, nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
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

            migrationBuilder.CreateIndex(
                name: "IX_CourseEmbeddings_CourseId",
                table: "CourseEmbeddings",
                column: "CourseId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "CourseEmbeddings");
            migrationBuilder.DropTable(name: "RecommendationLogs");
            migrationBuilder.DropTable(name: "StudentSkillProfiles");
            migrationBuilder.DropTable(name: "StudentPreferences");
        }
    }
}
