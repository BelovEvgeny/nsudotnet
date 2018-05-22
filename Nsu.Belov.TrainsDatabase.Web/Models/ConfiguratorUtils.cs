using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Reinforced.Lattice.Commands;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Plugins.Limit;
using Reinforced.Lattice.Plugins.Paging;

namespace Nsu.Belov.TrainsDatabase.Web.Models
{
    public static class ConfiguratorUtils
    {
        public static void DefaultTable(this NongenericConfigurator conf)
        {
            conf.ShowMessagesWith("ltcShowMessage");
            /*conf.Partition(x => x.InitialSkipTake(take: 10).Server());

            conf.Limit(ui => ui.Values(new string[] { "10", "20", "50", "-", "All" }), "lt");

            conf.Paging(ui => ui.PagingWithPeriods().UseGotoPage(), "rb");
*/
            conf.PrettifyTitles();
            conf.AppendEmptyFilters();

            conf.DatePicker(new DatepickerOptions(
                createDatepicker: "ltcCreateDatePicker",
                putToDatepicker: "ltcPutDateToDatepicker",
                getFromDatePicker: "ltcGetDateFromDatepicker",
                destroyDatepicker: "ltcDestroyDatepicker"));
        }

        public static CommandDescriptionConfigurator ConfigureRemoval(this CommandDescriptionConfigurator x)
        {
            x.Window("confirmDelete", "#ltcModal");
            return x;
        }
    }
}