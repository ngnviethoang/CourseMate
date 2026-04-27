using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseMate.Persistent.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLessonMaterialsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LessonMaterials_FileEntries_SlideFileId",
                table: "LessonMaterials");

            migrationBuilder.DropIndex(
                name: "IX_LessonMaterials_SlideFileId",
                table: "LessonMaterials");

            migrationBuilder.DropColumn(
                name: "SlideFileId",
                table: "LessonMaterials");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SlideFileId",
                table: "LessonMaterials",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_LessonMaterials_SlideFileId",
                table: "LessonMaterials",
                column: "SlideFileId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_LessonMaterials_FileEntries_SlideFileId",
                table: "LessonMaterials",
                column: "SlideFileId",
                principalTable: "FileEntries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
