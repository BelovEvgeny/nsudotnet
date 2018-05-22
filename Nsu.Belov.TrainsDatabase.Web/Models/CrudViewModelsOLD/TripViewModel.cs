using System;
using System.Linq;
using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;
using Reinforced.Lattice.Configuration;

namespace Nsu.Belov.TrainsDatabase.Web.Models.CrudViewModels
{
    public class TripViewModel
    {
        public Configurator<Trip, Trip> Configurator { get; set; }
    }

   /* public class TripRow
    {
        public int TripId { get; set; }
        public int TrainId { get; set; }
        public int RouteId { get; set; }
        public string RouteName { get; set; }
        public string DepatrureStationName { get; set; }
        public DateTime DepatrureDate { get; set; }
        public string ArrivalStationName { get; set; }
        public DateTime ArrivalDate { get; set; }
    }*/

    public static class TripTable
    {
        public static Configurator<Trip, Trip> Configure(this Configurator<Trip, Trip> conf)
        {
            conf.DefaultTable();
            conf.PrimaryKey(x => x.TripId);
          /*  conf.ProjectDataWith(x => x.Select(t => new TripRow()
            {
                TripId = t.TripId,
                RouteId = t.RouteId,
                RouteName = t.Route.RouteName,
                DepatrureStationName =
                    t.Route.RoutePoints.OrderBy(rp => rp.StationOrder).FirstOrDefault().Station.StationName,
                DepatrureDate = t.TripPoints.OrderBy(rp => rp.StationOrder).FirstOrDefault().DepartureTime,
                ArrivalStationName = t.Route.RoutePoints.OrderByDescending(rp => rp.StationOrder).FirstOrDefault()
                    .Station.StationName,
                ArrivalDate = t.TripPoints.OrderByDescending(rp => rp.StationOrder).FirstOrDefault().ArrivalTime

            }));*/
            return conf;
        }
    }
}