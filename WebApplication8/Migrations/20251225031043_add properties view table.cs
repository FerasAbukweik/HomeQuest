using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication8.Migrations
{
    /// <inheritdoc />
    public partial class addpropertiesviewtable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "totalViews",
                table: "Users");

            migrationBuilder.AddColumn<DateTime>(
                name: "latestActiveDate",
                table: "PropertiesListings",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PropertyViews",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    userId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    propertyLisingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    viewedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyViews", x => x.id);
                    table.ForeignKey(
                        name: "FK_PropertyViews_PropertiesListings_propertyLisingId",
                        column: x => x.propertyLisingId,
                        principalTable: "PropertiesListings",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_PropertyViews_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_PropertyViews_propertyLisingId",
                table: "PropertyViews",
                column: "propertyLisingId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyViews_userId",
                table: "PropertyViews",
                column: "userId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PropertyViews");

            migrationBuilder.DropColumn(
                name: "latestActiveDate",
                table: "PropertiesListings");

            migrationBuilder.AddColumn<long>(
                name: "totalViews",
                table: "Users",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }
    }
}
