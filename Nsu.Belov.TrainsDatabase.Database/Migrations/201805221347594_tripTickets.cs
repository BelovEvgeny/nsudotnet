namespace Nsu.Belov.TrainsDatabase.Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class tripTickets : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Tickets", "Trip_TripId", c => c.Int());
            CreateIndex("dbo.Tickets", "Trip_TripId");
            AddForeignKey("dbo.Tickets", "TripId", "dbo.Trips", "TripId", cascadeDelete: true);
            AddForeignKey("dbo.Tickets", "Trip_TripId", "dbo.Trips", "TripId");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Tickets", "Trip_TripId", "dbo.Trips");
            DropForeignKey("dbo.Tickets", "TripId", "dbo.Trips");
            DropIndex("dbo.Tickets", new[] { "Trip_TripId" });
            DropColumn("dbo.Tickets", "Trip_TripId");
        }
    }
}
