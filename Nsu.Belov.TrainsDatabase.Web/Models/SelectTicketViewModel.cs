using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Reinforced.Lattice.Configuration;

namespace Nsu.Belov.TrainsDatabase.Web.Models
{
    public class SelectTicketViewModel
    {
        public int DepartureStationId { get; set; }
        public int ArrivalStationId { get; set; }

        public string Date { get; set; }

        public IEnumerable<SelectListItem> StationNames { get; set; }
        public Configurator<SelectTripRow, SelectTripRow> Configurator { get; set; }
    }

    public class SelectTripRow
    {
        public int TripId { get; set; }
        public int? TrainId { get; set; }
        public int RouteId { get; set; }
        public DateTime? DepartureTime { get; set; }
        public DateTime? ArrivalTime { get; set; }
    }

    public static class SelectTripTable
    {
        public static Configurator<SelectTripRow, SelectTripRow> Configure(
            this Configurator<SelectTripRow, SelectTripRow> conf)
        {
            conf.DefaultTable();
            //conf.Column(c => c.StationId).Title("Id");
            //conf.Column(c => c.StationName).Title("Station Name");
            return conf;
        }
    }
}