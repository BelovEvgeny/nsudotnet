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

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RoutePoint>()
                .HasKey(rp => new {rp.RouteId, rp.StationOrder})
                .HasRequired(rp => rp.Route)
                .WithMany(r => r.RoutePoints);
            //.HasForeignKey(rp =>  rp.RouteId);

            modelBuilder.Entity<VoyagePoint>()
                .HasKey(vp => new {vp.VoyageId, vp.StationOrder})
                .HasRequired(vp => vp.Voyage)
                .WithMany(v => v.VoyagePoints);
            // .HasForeignKey(vp=>vp.VoyageId)


            modelBuilder.Entity<Delay>()
                .HasKey(d => new {d.VoyageId, d.StationOrder})
                .HasRequired(d => d.VoyagePoint)
                .WithOptional(vp => vp.Delay);

            base.OnModelCreating(modelBuilder);
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