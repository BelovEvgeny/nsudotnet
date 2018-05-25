using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Nsu.Belov.TrainsDatabase.Web.ValidationAnnotations;
using Reinforced.Lattice.Configuration;

namespace Nsu.Belov.TrainsDatabase.Web.Models
{
    public class SelectTicketViewModel
    {
       
        public int DepartureStationId { get; set; }
        [NotEqual("DepartureStationId")]
        public int ArrivalStationId { get; set; }

        [Required(ErrorMessage = "Выберите интервал отправления")]
        public string DateStart { get; set; }
        [Required(ErrorMessage = "Выберите интервал отправления")]
        public string DateEnd { get; set; }

        public SelectListItem[] StationNames { get; set; }
        public Configurator<SelectTripRow, SelectTripRow> Configurator { get; set; }
    }

    public class SelectTripRow
    {
        public int TripId { get; set; }
        public int? TrainId { get; set; }
        public int RouteId { get; set; }
        public int NumberOfStations { get; set; }
        public int DepartureStationOrder { get; set; }
        public int ArrivalStationOrder { get; set; }
        public DateTime? DepartureTime { get; set; }
        public DateTime? ArrivalTime { get; set; }
        public int FirstClassTickets { get; set; }
        public int SecondClassTickets { get; set; }
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