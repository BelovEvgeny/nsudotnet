namespace Nsu.Belov.TrainsDatabase.Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class routename : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Routes", "RouteName", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Routes", "RouteName");
        }
    }
}
