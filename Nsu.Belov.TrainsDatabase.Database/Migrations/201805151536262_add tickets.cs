namespace Nsu.Belov.TrainsDatabase.Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addtickets : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Tickets",
                c => new
                    {
                        TicketId = c.Int(nullable: false, identity: true),
                        TripId = c.Int(nullable: false),
                        StartStationOrder = c.Int(nullable: false),
                        EndStationOrder = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.TicketId)
                .ForeignKey("dbo.TripPoints", t => new { t.TripId, t.StartStationOrder })
                .ForeignKey("dbo.TripPoints", t => new { t.TripId, t.EndStationOrder })
                .Index(t => new { t.TripId, t.StartStationOrder })
                .Index(t => new { t.TripId, t.EndStationOrder });
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Tickets", new[] { "TripId", "EndStationOrder" }, "dbo.TripPoints");
            DropForeignKey("dbo.Tickets", new[] { "TripId", "StartStationOrder" }, "dbo.TripPoints");
            DropIndex("dbo.Tickets", new[] { "TripId", "EndStationOrder" });
            DropIndex("dbo.Tickets", new[] { "TripId", "StartStationOrder" });
            DropTable("dbo.Tickets");
        }
    }
}
