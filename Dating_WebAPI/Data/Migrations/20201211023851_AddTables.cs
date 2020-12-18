using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Dating_WebAPI.Data.Migrations
{
    public partial class AddTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Favor",
                columns: table => new
                {
                    FavorId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FavorType = table.Column<string>(type: "nvarchar(20)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Favor", x => x.FavorId);
                });

            migrationBuilder.CreateTable(
                name: "Sexual",
                columns: table => new
                {
                    SexualId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SexualType = table.Column<string>(type: "nvarchar(5)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sexual", x => x.SexualId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserName = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    PasswordHash = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    PasswordSalt = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    SexualId = table.Column<int>(type: "int", nullable: false),
                    FavorId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_Users_Favor_FavorId",
                        column: x => x.FavorId,
                        principalTable: "Favor",
                        principalColumn: "FavorId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Users_Sexual_SexualId",
                        column: x => x.SexualId,
                        principalTable: "Sexual",
                        principalColumn: "SexualId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_FavorId",
                table: "Users",
                column: "FavorId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_SexualId",
                table: "Users",
                column: "SexualId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Favor");

            migrationBuilder.DropTable(
                name: "Sexual");
        }
    }
}