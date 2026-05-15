using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseMate.Persistent.Migrations
{
    /// <inheritdoc />
    public partial class AddAntiCheatViolationTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MaxViolations",
                table: "Contests",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DisqualifiedAt",
                table: "ContestRegistrations",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DisqualifiedReason",
                table: "ContestRegistrations",
                type: "character varying(32768)",
                maxLength: 32768,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ViolationCount",
                table: "ContestRegistrations",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "AntiCheatViolations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContestId = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    ViolationType = table.Column<int>(type: "integer", nullable: false),
                    Details = table.Column<string>(type: "character varying(32768)", maxLength: 32768, nullable: false),
                    OccurredAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AntiCheatViolations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AntiCheatViolations_AspNetUsers_StudentId",
                        column: x => x.StudentId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AntiCheatViolations_Contests_ContestId",
                        column: x => x.ContestId,
                        principalTable: "Contests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AntiCheatViolations_ContestId_StudentId",
                table: "AntiCheatViolations",
                columns: new[] { "ContestId", "StudentId" });

            migrationBuilder.CreateIndex(
                name: "IX_AntiCheatViolations_StudentId",
                table: "AntiCheatViolations",
                column: "StudentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AntiCheatViolations");

            migrationBuilder.DropColumn(
                name: "MaxViolations",
                table: "Contests");

            migrationBuilder.DropColumn(
                name: "DisqualifiedAt",
                table: "ContestRegistrations");

            migrationBuilder.DropColumn(
                name: "DisqualifiedReason",
                table: "ContestRegistrations");

            migrationBuilder.DropColumn(
                name: "ViolationCount",
                table: "ContestRegistrations");
        }
    }
}
