using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nsu.Belov.TrainsDatabase.Database
{
    public class TrainsDataContext : DbContext
    {
        public TrainsDataContext() : base("Trains")
        {
        }

        public DbSet<CrewMember> CrewMembers { get; set; }
        public DbSet<Delay> Delays { get; set; }
        public DbSet<Route> Routes { get; set; }
        public DbSet<RoutePoint> RoutePoints { get; set; }
        public DbSet<Station> Stations { get; set; }
        public DbSet<Train> Trains { get; set; }
        public DbSet<Voyage> Voyages { get; set; }
        public DbSet<VoyagePoint> VoyagePoints { get; set; }
    }
}