using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseMate.Persistent.Migrations
{
    /// <inheritdoc />
    public partial class AddPrizeRangeColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Rank",
                table: "ContestPrizes",
                newName: "MinRank");

            migrationBuilder.AddColumn<int>(
                name: "MaxRank",
                table: "ContestPrizes",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaxRank",
                table: "ContestPrizes");

            migrationBuilder.RenameColumn(
                name: "MinRank",
                table: "ContestPrizes",
                newName: "Rank");
        }
    }
}
