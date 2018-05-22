namespace Nsu.Belov.TrainsDatabase.Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class timefixes : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.TripPoints", "ArrivalTime", c => c.DateTime());
            AlterColumn("dbo.TripPoints", "DepartureTime", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.TripPoints", "DepartureTime", c => c.DateTime(nullable: false));
            AlterColumn("dbo.TripPoints", "ArrivalTime", c => c.DateTime(nullable: false));
        }
    }
}
