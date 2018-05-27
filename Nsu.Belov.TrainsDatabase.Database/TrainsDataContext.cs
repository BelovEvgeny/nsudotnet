using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;
using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;

namespace Nsu.Belov.TrainsDatabase.Database
{
    public class TrainsDataContext : IdentityDbContext<ApplicationUser>
    {
        public TrainsDataContext() : base("DefaultConnection")
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RoutePoint>()
                .HasKey(rp => new {rp.RouteId, rp.StationOrder})
                .HasRequired(rp => rp.Route)
                .WithMany(r => r.RoutePoints)
                .HasForeignKey(rp => rp.RouteId);


            modelBuilder.Entity<TripPoint>()
                .HasKey(vp => new {vp.TripId, vp.StationOrder})
                .HasRequired(vp => vp.Trip)
                .WithMany(v => v.TripPoints)
                .HasForeignKey(vp => vp.TripId);


            modelBuilder.Entity<Delay>()
                .HasKey(d => new {d.TripId, d.StationOrder})
                .HasRequired(d => d.TripPoint)
                .WithOptional(vp => vp.Delay);

            modelBuilder.Entity<Ticket>()
                .HasRequired(t => t.FromTripPoint)
                .WithMany(tp => tp.TicketsFromHere)
                .HasForeignKey(t => new {t.TripId, t.StartStationOrder})
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Ticket>()
                .HasRequired(t => t.ToTripPoint)
                .WithMany(tp => tp.TicketsToHere)
                .HasForeignKey(t => new {t.TripId, t.EndStationOrder})
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Ticket>()
                .HasRequired(x => x.Trip)
                .WithMany(x=>x.Tickets)
                .HasForeignKey(x => x.TripId);

            modelBuilder.Entity<Ticket>()
                .HasRequired(x => x.Passenger)
                .WithMany(x => x.Tickets)
                .HasForeignKey(x => x.UserId);

            modelBuilder.Entity<RoutePoint>()
                .HasRequired(x => x.Station)
                .WithMany()
                .HasForeignKey(x => x.StationId);

            modelBuilder.Entity<Trip>()
                .HasRequired(x => x.Train)
                .WithMany(x => x.Trips)
                .HasForeignKey(x => x.TrainId);

            modelBuilder.Entity<Trip>()
                .HasRequired(x => x.Route)
                .WithMany()
                .HasForeignKey(x => x.RouteId);

            modelBuilder.Entity<Employee>()
                .HasOptional(x => x.Train)
                .WithMany(x=>x.Employees)
                .HasForeignKey(x => x.TrainId);

            modelBuilder.Entity<Employee>()
                .HasKey(employee => employee.UserId)
                .HasRequired(x => x.ApplicationUser)
                .WithOptional();

            base.OnModelCreating(modelBuilder);
        }
        
        public DbSet<Delay> Delays { get; set; }
        public DbSet<Route> Routes { get; set; }
        public DbSet<RoutePoint> RoutePoints { get; set; }
        public DbSet<Station> Stations { get; set; }
        public DbSet<Train> Trains { get; set; }
        public DbSet<Trip> Trips { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<TripPoint> TripPoints { get; set; }
        public DbSet<Employee> Employees { get; set; }
    }
}