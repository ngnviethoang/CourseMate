using System.Collections.Generic;
using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseMate.Persistent.Migrations
{
    /// <inheritdoc />
    public partial class FinalFixForJsonMapping : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Examples",
                table: "Exercises",
                type: "jsonb",
                nullable: true,
                oldClrType: typeof(List<ExerciseExample>),
                oldType: "jsonb",
                oldDefaultValueSql: "'[]'::jsonb");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<List<ExerciseExample>>(
                name: "Examples",
                table: "Exercises",
                type: "jsonb",
                nullable: false,
                defaultValueSql: "'[]'::jsonb",
                oldClrType: typeof(string),
                oldType: "jsonb",
                oldNullable: true);
        }
    }
}
