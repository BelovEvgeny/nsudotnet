namespace Nsu.Belov.TrainsDatabase.Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class somethings : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.RoutePoints", "Station_StationId", "dbo.Stations");
            DropIndex("dbo.RoutePoints", new[] { "Station_StationId" });
            RenameColumn(table: "dbo.Trips", name: "Train_TrainId", newName: "TrainId");
            RenameColumn(table: "dbo.RoutePoints", name: "Station_StationId", newName: "StationId");
            RenameIndex(table: "dbo.Trips", name: "IX_Train_TrainId", newName: "IX_TrainId");
            AddColumn("dbo.Trains", "Capacity", c => c.Int(nullable: false));
            AddColumn("dbo.TripPoints", "ArrivalTime", c => c.DateTime(nullable: false));
            AddColumn("dbo.Delays", "MinutesDelaySpan", c => c.Int(nullable: false));
            AlterColumn("dbo.RoutePoints", "StationId", c => c.Int(nullable: false));
            CreateIndex("dbo.RoutePoints", "StationId");
            AddForeignKey("dbo.RoutePoints", "StationId", "dbo.Stations", "StationId", cascadeDelete: true);
            DropColumn("dbo.Trains", "Capasity");
            DropColumn("dbo.Delays", "DelaySpan");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Delays", "DelaySpan", c => c.Time(nullable: false, precision: 7));
            AddColumn("dbo.Trains", "Capasity", c => c.Int(nullable: false));
            DropForeignKey("dbo.RoutePoints", "StationId", "dbo.Stations");
            DropIndex("dbo.RoutePoints", new[] { "StationId" });
            AlterColumn("dbo.RoutePoints", "StationId", c => c.Int());
            DropColumn("dbo.Delays", "MinutesDelaySpan");
            DropColumn("dbo.TripPoints", "ArrivalTime");
            DropColumn("dbo.Trains", "Capacity");
            RenameIndex(table: "dbo.Trips", name: "IX_TrainId", newName: "IX_Train_TrainId");
            RenameColumn(table: "dbo.RoutePoints", name: "StationId", newName: "Station_StationId");
            RenameColumn(table: "dbo.Trips", name: "TrainId", newName: "Train_TrainId");
            CreateIndex("dbo.RoutePoints", "Station_StationId");
            AddForeignKey("dbo.RoutePoints", "Station_StationId", "dbo.Stations", "StationId");
        }
    }
}
