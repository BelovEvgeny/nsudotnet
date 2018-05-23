namespace Nsu.Belov.TrainsDatabase.Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class notnulTrip_TrainId : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Trips", "TrainId", "dbo.Trains");
            DropIndex("dbo.Trips", new[] { "TrainId" });
            AlterColumn("dbo.Trips", "TrainId", c => c.Int(nullable: false));
            CreateIndex("dbo.Trips", "TrainId");
            AddForeignKey("dbo.Trips", "TrainId", "dbo.Trains", "TrainId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Trips", "TrainId", "dbo.Trains");
            DropIndex("dbo.Trips", new[] { "TrainId" });
            AlterColumn("dbo.Trips", "TrainId", c => c.Int());
            CreateIndex("dbo.Trips", "TrainId");
            AddForeignKey("dbo.Trips", "TrainId", "dbo.Trains", "TrainId");
        }
    }
}
