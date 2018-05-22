using System;
using System.Linq;
using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;
using Reinforced.Lattice.Configuration;

namespace Nsu.Belov.TrainsDatabase.Web.Models.CrudViewModels
{
    public class TripEditViewModel
    {
        public int[] RouteIds;

        public int[] TrainIds;
        public Configurator<Trip, TripEditRow> Configurator { get; set; }
    }

    public class TripEditRow
    {
        public int TripId { get; set; }
        public int? TrainId { get; set; }
        public int RouteId { get; set; }
        public string RouteName { get; set; }
        public string DepatrureStationName { get; set; }
        public DateTime? DepatrureDate { get; set; }
        public string ArrivalStationName { get; set; }
        public DateTime? ArrivalDate { get; set; }
    }

    public static class TripEditTable
    {
        public static Configurator<Trip, TripEditRow> Configure(this Configurator<Trip, TripEditRow> conf)
        {
            conf.DefaultTable();
            conf.PrimaryKey(x => x.TripId);
            conf.ProjectDataWith(trips =>
                from trip in trips
                from depatrure in ((
                    from tripPoint in trip.TripPoints
                    where tripPoint.StationOrder == trip.TripPoints.Min(tp => tp.StationOrder)
                    from routePoint in trip.Route.RoutePoints
                    where routePoint.StationOrder == tripPoint.StationOrder
                    select new
                    {
                        routePoint.StationOrder,
                        routePoint.Station.StationName,
                        DepartureTime = (DateTime?) tripPoint.DepartureTime
                    }).DefaultIfEmpty(new
                {
                    StationOrder = -1,
                    StationName = (string) null,
                    DepartureTime = (DateTime?) null
                }).Take(1))
                from arrival in (
                    from tripPoint in trip.TripPoints
                    where tripPoint.StationOrder == trip.TripPoints.Max(tp => tp.StationOrder)
                          && tripPoint.StationOrder != depatrure.StationOrder
                    from routePoint in trip.Route.RoutePoints
                    where routePoint.StationOrder == tripPoint.StationOrder
                    select new
                    {
                        routePoint.Station.StationName,
                        ArrivalTime = (DateTime?) tripPoint.ArrivalTime
                    }).DefaultIfEmpty(new
                {
                    StationName = (string) null,
                    ArrivalTime = (DateTime?) null
                }).Take(1)
                select new TripEditRow()
                {
                    TripId = trip.TripId,
                    RouteId = trip.RouteId,
                    TrainId = trip.TrainId,
                    RouteName = trip.Route.RouteName,
                    DepatrureStationName = depatrure.StationName,
                    DepatrureDate = depatrure.DepartureTime,
                    ArrivalStationName = arrival.StationName,
                    ArrivalDate = arrival.ArrivalTime,
                });
            return conf;
        }
    }
}