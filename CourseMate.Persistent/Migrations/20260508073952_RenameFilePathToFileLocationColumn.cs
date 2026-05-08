using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseMate.Persistent.Migrations
{
    /// <inheritdoc />
    public partial class RenameFilePathToFileLocationColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FilePath",
                table: "FileEntries");

            migrationBuilder.RenameColumn(
                name: "TempDirPath",
                table: "FileEntries",
                newName: "FileLocation");

            migrationBuilder.RenameColumn(
                name: "ChunkPath",
                table: "FileChunks",
                newName: "ChunkLocation");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FileLocation",
                table: "FileEntries",
                newName: "TempDirPath");

            migrationBuilder.RenameColumn(
                name: "ChunkLocation",
                table: "FileChunks",
                newName: "ChunkPath");

            migrationBuilder.AddColumn<string>(
                name: "FilePath",
                table: "FileEntries",
                type: "character varying(1024)",
                maxLength: 1024,
                nullable: false,
                defaultValue: "");
        }
    }
}
