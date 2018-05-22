namespace Nsu.Belov.TrainsDatabase.Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ticketsclasses : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Tickets", "SeatsType", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Tickets", "SeatsType");
        }
    }
}
