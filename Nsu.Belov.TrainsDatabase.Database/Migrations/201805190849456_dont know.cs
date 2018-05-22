namespace Nsu.Belov.TrainsDatabase.Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class dontknow : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Trips", "Route_RouteId", "dbo.Routes");
            DropIndex("dbo.Trips", new[] { "Route_RouteId" });
            RenameColumn(table: "dbo.Trips", name: "Route_RouteId", newName: "RouteId");
            AlterColumn("dbo.Trips", "RouteId", c => c.Int(nullable: false));
            CreateIndex("dbo.Trips", "RouteId");
            AddForeignKey("dbo.Trips", "RouteId", "dbo.Routes", "RouteId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Trips", "RouteId", "dbo.Routes");
            DropIndex("dbo.Trips", new[] { "RouteId" });
            AlterColumn("dbo.Trips", "RouteId", c => c.Int());
            RenameColumn(table: "dbo.Trips", name: "RouteId", newName: "Route_RouteId");
            CreateIndex("dbo.Trips", "Route_RouteId");
            AddForeignKey("dbo.Trips", "Route_RouteId", "dbo.Routes", "RouteId");
        }
    }
}
