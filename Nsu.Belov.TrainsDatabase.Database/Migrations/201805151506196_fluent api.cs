namespace Nsu.Belov.TrainsDatabase.Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class fluentapi : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Voyages", "Route_RouteId", "dbo.Routes");
            DropForeignKey("dbo.Voyages", "Train_TrainId", "dbo.Trains");
            DropForeignKey("dbo.Delays", new[] { "VoyageId", "StationOrder" }, "dbo.VoyagePoints");
            DropForeignKey("dbo.VoyagePoints", "VoyageId", "dbo.Voyages");
            DropIndex("dbo.Voyages", new[] { "Route_RouteId" });
            DropIndex("dbo.Voyages", new[] { "Train_TrainId" });
            DropIndex("dbo.VoyagePoints", new[] { "VoyageId" });
            DropIndex("dbo.Delays", new[] { "VoyageId", "StationOrder" });
            DropPrimaryKey("dbo.Delays");
            CreateTable(
                "dbo.Trips",
                c => new
                    {
                        TripId = c.Int(nullable: false, identity: true),
                        Route_RouteId = c.Int(),
                        Train_TrainId = c.Int(),
                    })
                .PrimaryKey(t => t.TripId)
                .ForeignKey("dbo.Routes", t => t.Route_RouteId)
                .ForeignKey("dbo.Trains", t => t.Train_TrainId)
                .Index(t => t.Route_RouteId)
                .Index(t => t.Train_TrainId);
            
            CreateTable(
                "dbo.TripPoints",
                c => new
                    {
                        TripId = c.Int(nullable: false),
                        StationOrder = c.Int(nullable: false),
                        DepartureTime = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => new { t.TripId, t.StationOrder })
                .ForeignKey("dbo.Trips", t => t.TripId, cascadeDelete: true)
                .Index(t => t.TripId);
            
            AddColumn("dbo.Delays", "TripId", c => c.Int(nullable: false));
            AddPrimaryKey("dbo.Delays", new[] { "TripId", "StationOrder" });
            CreateIndex("dbo.Delays", new[] { "TripId", "StationOrder" });
            AddForeignKey("dbo.Delays", new[] { "TripId", "StationOrder" }, "dbo.TripPoints", new[] { "TripId", "StationOrder" });
            DropColumn("dbo.Delays", "VoyageId");
            DropTable("dbo.Voyages");
            DropTable("dbo.VoyagePoints");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.VoyagePoints",
                c => new
                    {
                        VoyageId = c.Int(nullable: false),
                        StationOrder = c.Int(nullable: false),
                        DepartureTime = c.DateTime(nullable: false),
                        PassengersEntered = c.Int(nullable: false),
                        PassengersLeft = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.VoyageId, t.StationOrder });
            
            CreateTable(
                "dbo.Voyages",
                c => new
                    {
                        VoyageId = c.Int(nullable: false, identity: true),
                        Route_RouteId = c.Int(),
                        Train_TrainId = c.Int(),
                    })
                .PrimaryKey(t => t.VoyageId);
            
            AddColumn("dbo.Delays", "VoyageId", c => c.Int(nullable: false));
            DropForeignKey("dbo.TripPoints", "TripId", "dbo.Trips");
            DropForeignKey("dbo.Delays", new[] { "TripId", "StationOrder" }, "dbo.TripPoints");
            DropForeignKey("dbo.Trips", "Train_TrainId", "dbo.Trains");
            DropForeignKey("dbo.Trips", "Route_RouteId", "dbo.Routes");
            DropIndex("dbo.Delays", new[] { "TripId", "StationOrder" });
            DropIndex("dbo.TripPoints", new[] { "TripId" });
            DropIndex("dbo.Trips", new[] { "Train_TrainId" });
            DropIndex("dbo.Trips", new[] { "Route_RouteId" });
            DropPrimaryKey("dbo.Delays");
            DropColumn("dbo.Delays", "TripId");
            DropTable("dbo.TripPoints");
            DropTable("dbo.Trips");
            AddPrimaryKey("dbo.Delays", new[] { "VoyageId", "StationOrder" });
            CreateIndex("dbo.Delays", new[] { "VoyageId", "StationOrder" });
            CreateIndex("dbo.VoyagePoints", "VoyageId");
            CreateIndex("dbo.Voyages", "Train_TrainId");
            CreateIndex("dbo.Voyages", "Route_RouteId");
            AddForeignKey("dbo.VoyagePoints", "VoyageId", "dbo.Voyages", "VoyageId", cascadeDelete: true);
            AddForeignKey("dbo.Delays", new[] { "VoyageId", "StationOrder" }, "dbo.VoyagePoints", new[] { "VoyageId", "StationOrder" });
            AddForeignKey("dbo.Voyages", "Train_TrainId", "dbo.Trains", "TrainId");
            AddForeignKey("dbo.Voyages", "Route_RouteId", "dbo.Routes", "RouteId");
        }
    }
}
