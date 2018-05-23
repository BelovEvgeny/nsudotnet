namespace Nsu.Belov.TrainsDatabase.Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class capacityfix : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Trains", "FirstClassCapacity", c => c.Int(nullable: false));
            AddColumn("dbo.Trains", "SecondClassCapacity", c => c.Int(nullable: false));
            DropColumn("dbo.TripPoints", "FirstClassSeats");
            DropColumn("dbo.TripPoints", "SecondClassSeats");
        }
        
        public override void Down()
        {
            AddColumn("dbo.TripPoints", "SecondClassSeats", c => c.Int(nullable: false));
            AddColumn("dbo.TripPoints", "FirstClassSeats", c => c.Int(nullable: false));
            DropColumn("dbo.Trains", "SecondClassCapacity");
            DropColumn("dbo.Trains", "FirstClassCapacity");
        }
    }
}
