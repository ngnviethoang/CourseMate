using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseMate.Persistent.Migrations
{
    /// <inheritdoc />
    public partial class AddRecommendTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "xmin",
                table: "AspNetUsers");

            migrationBuilder.CreateTable(
                name: "StudentPreferences",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    FavouriteCategories = table.Column<string>(type: "jsonb", nullable: false, defaultValueSql: "'[]'::jsonb"),
                    PreferredDifficulty = table.Column<int>(type: "integer", nullable: false),
                    LearningGoal = table.Column<string>(type: "citext", maxLength: 512, nullable: false),
                    MinutesPerDay = table.Column<int>(type: "integer", nullable: false),
                    SkillLevel = table.Column<string>(type: "citext", maxLength: 64, nullable: false),
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
                });

            migrationBuilder.CreateTable(
                name: "StudentSkillProfiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    Category = table.Column<string>(type: "citext", maxLength: 128, nullable: false),
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
                });

            migrationBuilder.CreateIndex(
                name: "IX_StudentPreferences_StudentId",
                table: "StudentPreferences",
                column: "StudentId",
                unique: true);

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
                name: "StudentPreferences");

            migrationBuilder.DropTable(
                name: "StudentSkillProfiles");

            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "AspNetUsers",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);
        }
    }
}
