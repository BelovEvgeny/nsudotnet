namespace Nsu.Belov.TrainsDatabase.Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class trippointseats : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.TripPoints", "FirstClassSeats", c => c.Int(nullable: false));
            AddColumn("dbo.TripPoints", "SecondClassSeats", c => c.Int(nullable: false));
            DropColumn("dbo.Trains", "Category");
            DropColumn("dbo.Trains", "Capacity");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Trains", "Capacity", c => c.Int(nullable: false));
            AddColumn("dbo.Trains", "Category", c => c.String());
            DropColumn("dbo.TripPoints", "SecondClassSeats");
            DropColumn("dbo.TripPoints", "FirstClassSeats");
        }
    }
}
