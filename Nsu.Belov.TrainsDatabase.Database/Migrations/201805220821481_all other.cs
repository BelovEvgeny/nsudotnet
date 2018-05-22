namespace Nsu.Belov.TrainsDatabase.Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class allother : DbMigration
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
                    })
                .PrimaryKey(t => t.TrainId);
            
            CreateTable(
                "dbo.Trips",
                c => new
                    {
                        TripId = c.Int(nullable: false, identity: true),
                        RouteId = c.Int(nullable: false),
                        TrainId = c.Int(),
                    })
                .PrimaryKey(t => t.TripId)
                .ForeignKey("dbo.Routes", t => t.RouteId, cascadeDelete: true)
                .ForeignKey("dbo.Trains", t => t.TrainId)
                .Index(t => t.RouteId)
                .Index(t => t.TrainId);
            
            CreateTable(
                "dbo.Routes",
                c => new
                    {
                        RouteId = c.Int(nullable: false, identity: true),
                        RouteName = c.String(),
                    })
                .PrimaryKey(t => t.RouteId);
            
            CreateTable(
                "dbo.RoutePoints",
                c => new
                    {
                        RouteId = c.Int(nullable: false),
                        StationOrder = c.Int(nullable: false),
                        StationId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.RouteId, t.StationOrder })
                .ForeignKey("dbo.Routes", t => t.RouteId, cascadeDelete: true)
                .ForeignKey("dbo.Stations", t => t.StationId, cascadeDelete: true)
                .Index(t => t.RouteId)
                .Index(t => t.StationId);
            
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
                        TripId = c.Int(nullable: false),
                        StationOrder = c.Int(nullable: false),
                        ArrivalTime = c.DateTime(),
                        DepartureTime = c.DateTime(),
                        FirstClassSeats = c.Int(nullable: false),
                        SecondClassSeats = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.TripId, t.StationOrder })
                .ForeignKey("dbo.Trips", t => t.TripId, cascadeDelete: true)
                .Index(t => t.TripId);
            
            CreateTable(
                "dbo.Delays",
                c => new
                    {
                        TripId = c.Int(nullable: false),
                        StationOrder = c.Int(nullable: false),
                        MinutesDelaySpan = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.TripId, t.StationOrder })
                .ForeignKey("dbo.TripPoints", t => new { t.TripId, t.StationOrder })
                .Index(t => new { t.TripId, t.StationOrder });
            
            CreateTable(
                "dbo.Tickets",
                c => new
                    {
                        TicketId = c.Int(nullable: false, identity: true),
                        TripId = c.Int(nullable: false),
                        StartStationOrder = c.Int(nullable: false),
                        EndStationOrder = c.Int(nullable: false),
                        SeatsType = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.TicketId)
                .ForeignKey("dbo.TripPoints", t => new { t.TripId, t.StartStationOrder })
                .ForeignKey("dbo.TripPoints", t => new { t.TripId, t.EndStationOrder })
                .Index(t => new { t.TripId, t.StartStationOrder })
                .Index(t => new { t.TripId, t.EndStationOrder });
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.TripPoints", "TripId", "dbo.Trips");
            DropForeignKey("dbo.Tickets", new[] { "TripId", "EndStationOrder" }, "dbo.TripPoints");
            DropForeignKey("dbo.Tickets", new[] { "TripId", "StartStationOrder" }, "dbo.TripPoints");
            DropForeignKey("dbo.Delays", new[] { "TripId", "StationOrder" }, "dbo.TripPoints");
            DropForeignKey("dbo.Trips", "TrainId", "dbo.Trains");
            DropForeignKey("dbo.Trips", "RouteId", "dbo.Routes");
            DropForeignKey("dbo.RoutePoints", "StationId", "dbo.Stations");
            DropForeignKey("dbo.RoutePoints", "RouteId", "dbo.Routes");
            DropForeignKey("dbo.CrewMembers", "Train_TrainId", "dbo.Trains");
            DropIndex("dbo.Tickets", new[] { "TripId", "EndStationOrder" });
            DropIndex("dbo.Tickets", new[] { "TripId", "StartStationOrder" });
            DropIndex("dbo.Delays", new[] { "TripId", "StationOrder" });
            DropIndex("dbo.TripPoints", new[] { "TripId" });
            DropIndex("dbo.RoutePoints", new[] { "StationId" });
            DropIndex("dbo.RoutePoints", new[] { "RouteId" });
            DropIndex("dbo.Trips", new[] { "TrainId" });
            DropIndex("dbo.Trips", new[] { "RouteId" });
            DropIndex("dbo.CrewMembers", new[] { "Train_TrainId" });
            DropTable("dbo.Tickets");
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
