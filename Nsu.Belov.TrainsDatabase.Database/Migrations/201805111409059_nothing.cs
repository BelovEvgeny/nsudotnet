namespace Nsu.Belov.TrainsDatabase.Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class nothing : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.CrewMembers",
                c => new
                    {
                        CrewMemberId = c.Int(nullable: false, identity: true),
                        FirstName = c.String(),
                        LastName = c.String(),
                        Age = c.Int(nullable: false),
                        Phone = c.String(),
                        Function = c.String(),
                        Train_TrainId = c.Int(),
                    })
                .PrimaryKey(t => t.CrewMemberId)
                .ForeignKey("dbo.Trains", t => t.Train_TrainId)
                .Index(t => t.Train_TrainId);
            
            CreateTable(
                "dbo.Trains",
                c => new
                    {
                        TrainId = c.Int(nullable: false, identity: true),
                        Category = c.String(),
                        Capasity = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.TrainId);
            
            CreateTable(
                "dbo.Trips",
                c => new
                    {
                        VoyageId = c.Int(nullable: false, identity: true),
                        Route_RouteId = c.Int(),
                        Train_TrainId = c.Int(),
                    })
                .PrimaryKey(t => t.VoyageId)
                .ForeignKey("dbo.Routes", t => t.Route_RouteId)
                .ForeignKey("dbo.Trains", t => t.Train_TrainId)
                .Index(t => t.Route_RouteId)
                .Index(t => t.Train_TrainId);
            
            CreateTable(
                "dbo.Routes",
                c => new
                    {
                        RouteId = c.Int(nullable: false, identity: true),
                    })
                .PrimaryKey(t => t.RouteId);
            
            CreateTable(
                "dbo.RoutePoints",
                c => new
                    {
                        RouteId = c.Int(nullable: false),
                        StationOrder = c.Int(nullable: false),
                        Station_StationId = c.Int(),
                    })
                .PrimaryKey(t => new { t.RouteId, t.StationOrder })
                .ForeignKey("dbo.Routes", t => t.RouteId, cascadeDelete: true)
                .ForeignKey("dbo.Stations", t => t.Station_StationId)
                .Index(t => t.RouteId)
                .Index(t => t.Station_StationId);
            
            CreateTable(
                "dbo.Stations",
                c => new
                    {
                        StationId = c.Int(nullable: false, identity: true),
                        StationName = c.String(),
                    })
                .PrimaryKey(t => t.StationId);
            
            CreateTable(
                "dbo.TripPoints",
                c => new
                    {
                        VoyageId = c.Int(nullable: false),
                        StationOrder = c.Int(nullable: false),
                        DepartureTime = c.DateTime(nullable: false),
                        PassengersEntered = c.Int(nullable: false),
                        PassengersLeft = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.VoyageId, t.StationOrder })
                .ForeignKey("dbo.Trips", t => t.VoyageId, cascadeDelete: true)
                .Index(t => t.VoyageId);
            
            CreateTable(
                "dbo.Delays",
                c => new
                    {
                        VoyageId = c.Int(nullable: false),
                        StationOrder = c.Int(nullable: false),
                        DelaySpan = c.Time(nullable: false, precision: 7),
                    })
                .PrimaryKey(t => new { t.VoyageId, t.StationOrder })
                .ForeignKey("dbo.TripPoints", t => new { t.VoyageId, t.StationOrder })
                .Index(t => new { t.VoyageId, t.StationOrder });
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.TripPoints", "TripId", "dbo.Trips");
            DropForeignKey("dbo.Delays", new[] { "TripId", "StationOrder" }, "dbo.TripPoints");
            DropForeignKey("dbo.Trips", "Train_TrainId", "dbo.Trains");
            DropForeignKey("dbo.Trips", "Route_RouteId", "dbo.Routes");
            DropForeignKey("dbo.RoutePoints", "Station_StationId", "dbo.Stations");
            DropForeignKey("dbo.RoutePoints", "RouteId", "dbo.Routes");
            DropForeignKey("dbo.CrewMembers", "Train_TrainId", "dbo.Trains");
            DropIndex("dbo.Delays", new[] { "TripId", "StationOrder" });
            DropIndex("dbo.TripPoints", new[] { "TripId" });
            DropIndex("dbo.RoutePoints", new[] { "Station_StationId" });
            DropIndex("dbo.RoutePoints", new[] { "RouteId" });
            DropIndex("dbo.Trips", new[] { "Train_TrainId" });
            DropIndex("dbo.Trips", new[] { "Route_RouteId" });
            DropIndex("dbo.CrewMembers", new[] { "Train_TrainId" });
            DropTable("dbo.Delays");
            DropTable("dbo.TripPoints");
            DropTable("dbo.Stations");
            DropTable("dbo.RoutePoints");
            DropTable("dbo.Routes");
            DropTable("dbo.Trips");
            DropTable("dbo.Trains");
            DropTable("dbo.CrewMembers");
        }
    }
}
