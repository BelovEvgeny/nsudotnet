using System;
using System.Linq;
using System.Web.Mvc;
using Nsu.Belov.TrainsDatabase.Database;
using Nsu.Belov.TrainsDatabase.Database.DatabaseEntities;
using Reinforced.Lattice.Configuration;

namespace Nsu.Belov.TrainsDatabase.Web.Models
{
    public class TripEditViewModel
    {
        public SelectListItem[] RouteIds;

        public SelectListItem[] TrainIds;
        public Configurator<Trip, TripRow> Configurator { get; set; }
    }

    public class TripRow
    {
        public int TripId { get; set; }
        public int TrainId { get; set; }
        public int RouteId { get; set; }
        public string RouteName { get; set; }
        public string DepatrureStationName { get; set; }
        public DateTime? DepatrureDate { get; set; }
        public string ArrivalStationName { get; set; }
        public DateTime? ArrivalDate { get; set; }
    }

    public static class TripEditTable
    {
        public static Configurator<Trip, TripRow> Configure(this Configurator<Trip, TripRow> conf)
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
                select new TripRow()
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

    public class TripPointForViewModel
    {
        public Configurator<TripPoint, TripPointForRow> Configurator { get; set; }
    }

    public class TripPointForRow
    {
        public int TripId { get; set; }
        public int StationOrder { get; set; }
        public DateTime? ArrivalTime { get; set; }
        public DateTime? DepartureTime { get; set; }
        public int FirstClassSeatsLeft { get; set; }
        public int SecondClassSeatsLeft { get; set; }
        public int? DelayinMinutes { get; set; }
    }

    public static class TripPointForTable
    {
        public static Configurator<TripPoint, TripPointForRow> Configure(
            this Configurator<TripPoint, TripPointForRow> conf)
        {
            conf.DefaultTable();
            conf.PrimaryKey(x => new {x.TripId, x.StationOrder});
            conf.ProjectDataWith(tripPoints =>
               from tripPoint in tripPoints
                    select new
                    {
                        tripPoint,
                        touchingTickets = tripPoint.Trip.Tickets.Where(x =>
                            x.StartStationOrder <= tripPoint.StationOrder &&
                            x.EndStationOrder >= tripPoint.StationOrder)
                    }
                    into z
                    select new TripPointForRow()
                    {
                        TripId = z.tripPoint.TripId,
                        StationOrder = z.tripPoint.StationOrder,
                        ArrivalTime = z.tripPoint.ArrivalTime,
                        DepartureTime = z.tripPoint.DepartureTime,
                        DelayinMinutes = z.tripPoint.Delay.MinutesDelaySpan,
                        FirstClassSeatsLeft = z.tripPoint.Trip.Train.FirstClassCapacity - 
                                              z.touchingTickets.Count(x => x.SeatsType == SeatsType.FirstClass),
                        SecondClassSeatsLeft = z.tripPoint.Trip.Train.SecondClassCapacity - 
                                               z.touchingTickets.Count(x => x.SeatsType == SeatsType.SecondClass),
                    }
            );
            return conf;
        }
    }
}