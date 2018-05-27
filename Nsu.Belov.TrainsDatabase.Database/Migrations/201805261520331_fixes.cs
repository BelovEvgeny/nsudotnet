namespace Nsu.Belov.TrainsDatabase.Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class fixes : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.CrewMembers", "Train_TrainId", "dbo.Trains");
            DropIndex("dbo.CrewMembers", new[] { "Train_TrainId" });
            CreateTable(
                "dbo.Employees",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        Name = c.String(),
                        Age = c.Int(nullable: false),
                        Phone = c.String(),
                        Position = c.String(),
                        TrainId = c.Int(),
                    })
                .PrimaryKey(t => t.UserId)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId)
                .ForeignKey("dbo.Trains", t => t.TrainId)
                .Index(t => t.UserId)
                .Index(t => t.TrainId);
            
            DropTable("dbo.CrewMembers");
        }
        
        public override void Down()
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
                .PrimaryKey(t => t.CrewMemberId);
            
            DropForeignKey("dbo.Employees", "TrainId", "dbo.Trains");
            DropForeignKey("dbo.Employees", "UserId", "dbo.AspNetUsers");
            DropIndex("dbo.Employees", new[] { "TrainId" });
            DropIndex("dbo.Employees", new[] { "UserId" });
            DropTable("dbo.Employees");
            CreateIndex("dbo.CrewMembers", "Train_TrainId");
            AddForeignKey("dbo.CrewMembers", "Train_TrainId", "dbo.Trains", "TrainId");
        }
    }
}
