namespace Nsu.Belov.TrainsDatabase.Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class allotherv2 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Employees",
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
                        FirstClassCapacity = c.Int(nullable: false),
                        SecondClassCapacity = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.TrainId);
            
            CreateTable(
                "dbo.Trips",
                c => new
                    {
                        TripId = c.Int(nullable: false, identity: true),
                        RouteId = c.Int(nullable: false),
                        TrainId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.TripId)
                .ForeignKey("dbo.Routes", t => t.RouteId, cascadeDelete: true)
                .ForeignKey("dbo.Trains", t => t.TrainId, cascadeDelete: true)
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
                "dbo.Tickets",
                c => new
                    {
                        TicketId = c.Int(nullable: false, identity: true),
                        TripId = c.Int(nullable: false),
                        StartStationOrder = c.Int(nullable: false),
                        EndStationOrder = c.Int(nullable: false),
                        UserId = c.String(nullable: false, maxLength: 128),
                        SeatsType = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.TicketId)
                .ForeignKey("dbo.TripPoints", t => new { t.TripId, t.StartStationOrder })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .ForeignKey("dbo.TripPoints", t => new { t.TripId, t.EndStationOrder })
                .ForeignKey("dbo.Trips", t => t.TripId, cascadeDelete: true)
                .Index(t => new { t.TripId, t.StartStationOrder })
                .Index(t => new { t.TripId, t.EndStationOrder })
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.TripPoints",
                c => new
                    {
                        TripId = c.Int(nullable: false),
                        StationOrder = c.Int(nullable: false),
                        ArrivalTime = c.DateTime(),
                        DepartureTime = c.DateTime(),
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
                "dbo.AspNetUsers",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Email = c.String(maxLength: 256),
                        EmailConfirmed = c.Boolean(nullable: false),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        PhoneNumber = c.String(),
                        PhoneNumberConfirmed = c.Boolean(nullable: false),
                        TwoFactorEnabled = c.Boolean(nullable: false),
                        LockoutEndDateUtc = c.DateTime(),
                        LockoutEnabled = c.Boolean(nullable: false),
                        AccessFailedCount = c.Int(nullable: false),
                        UserName = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.UserName, unique: true, name: "UserNameIndex");
            
            CreateTable(
                "dbo.AspNetUserClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false, maxLength: 128),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserLogins",
                c => new
                    {
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                        UserId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.LoginProvider, t.ProviderKey, t.UserId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserRoles",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        RoleId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetRoles", t => t.RoleId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);
            
            CreateTable(
                "dbo.AspNetRoles",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Name, unique: true, name: "RoleNameIndex");
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles");
            DropForeignKey("dbo.Trips", "TrainId", "dbo.Trains");
            DropForeignKey("dbo.Tickets", "TripId", "dbo.Trips");
            DropForeignKey("dbo.Tickets", new[] { "TripId", "EndStationOrder" }, "dbo.TripPoints");
            DropForeignKey("dbo.Tickets", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserClaims", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.Tickets", new[] { "TripId", "StartStationOrder" }, "dbo.TripPoints");
            DropForeignKey("dbo.TripPoints", "TripId", "dbo.Trips");
            DropForeignKey("dbo.Delays", new[] { "TripId", "StationOrder" }, "dbo.TripPoints");
            DropForeignKey("dbo.Trips", "RouteId", "dbo.Routes");
            DropForeignKey("dbo.RoutePoints", "StationId", "dbo.Stations");
            DropForeignKey("dbo.RoutePoints", "RouteId", "dbo.Routes");
            DropForeignKey("dbo.Employees", "Train_TrainId", "dbo.Trains");
            DropIndex("dbo.AspNetRoles", "RoleNameIndex");
            DropIndex("dbo.AspNetUserRoles", new[] { "RoleId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "UserId" });
            DropIndex("dbo.AspNetUserLogins", new[] { "UserId" });
            DropIndex("dbo.AspNetUserClaims", new[] { "UserId" });
            DropIndex("dbo.AspNetUsers", "UserNameIndex");
            DropIndex("dbo.Delays", new[] { "TripId", "StationOrder" });
            DropIndex("dbo.TripPoints", new[] { "TripId" });
            DropIndex("dbo.Tickets", new[] { "UserId" });
            DropIndex("dbo.Tickets", new[] { "TripId", "EndStationOrder" });
            DropIndex("dbo.Tickets", new[] { "TripId", "StartStationOrder" });
            DropIndex("dbo.RoutePoints", new[] { "StationId" });
            DropIndex("dbo.RoutePoints", new[] { "RouteId" });
            DropIndex("dbo.Trips", new[] { "TrainId" });
            DropIndex("dbo.Trips", new[] { "RouteId" });
            DropIndex("dbo.Employees", new[] { "Train_TrainId" });
            DropTable("dbo.AspNetRoles");
            DropTable("dbo.AspNetUserRoles");
            DropTable("dbo.AspNetUserLogins");
            DropTable("dbo.AspNetUserClaims");
            DropTable("dbo.AspNetUsers");
            DropTable("dbo.Delays");
            DropTable("dbo.TripPoints");
            DropTable("dbo.Tickets");
            DropTable("dbo.Stations");
            DropTable("dbo.RoutePoints");
            DropTable("dbo.Routes");
            DropTable("dbo.Trips");
            DropTable("dbo.Trains");
            DropTable("dbo.Employees");
        }
    }
}
