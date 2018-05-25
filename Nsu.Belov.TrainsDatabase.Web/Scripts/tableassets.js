var ltcCreateDatePicker = function(element) {
    var date = null;
    $(element).css('cursor', 'pointer');
    $(element).css('text-align', 'center');
    if ($(element).val()) date = new Date($(element).val());
    if ($(element).parents("#editform").length > 0) {
        $(element)
            .datetimepicker({
                format: "HH:mm DD.MM.YY",
                showClear: true,
                showTodayButton: true
            });
    } else {
        $(element)
            .datetimepicker({
                format: "DD.MM.YY",
                showClear: true,
                showTodayButton: true
            });
    }
    if (date != undefined)
        ltcPutDateToDatepicker(element, date);
    $(element)
        .on('dp.change',
            function() {
                Reinforced.Lattice.Master.fireDomEvent('keyup', element);
            });
};

var ltcPutDateToDatepicker = function(element, date) {
    $(element).data("DateTimePicker").date(date);
};

var ltcGetDateFromDatepicker = function(element, date) {
    var dt = $(element).data("DateTimePicker").date();
    if (dt == null || dt == undefined) return null;
    if (dt._isAMomentObject) {
        var toDate = dt.toDate();
        toDate.setHours(toDate.getHours() - toDate.getTimezoneOffset() / 60);
        return toDate;
    } else
        return dt;
    // if (!dt.getTime) return null;
};

var ltcDestroyDatepicker = function(element) {
    $(element).data("DateTimePicker").destroy();
};

var ltcShowModal = function() {
    $('#ltcModal').modal('show');
};

var ltcHideModal = function() {
    $('#ltcModal').modal('hide');
};


var getDurationinMinutes = function(from, to) {
    var x = moment(from);
    var y = moment(to);
    return moment.duration(y.diff(x)).asMinutes();
};

var humanizeTimeSpan = function(spanInMinutes) {
    var duration = moment.duration(spanInMinutes, 'minutes');
    // return duration.locale("ru").humanize();
    //да, почти так же, как вы в вк показывали. да, для duration нет format метода. 
    //есть сторонние плагины, но не вижу смысла их качать 
    var time = duration.hours() + "ч. " + duration.minutes() + "м.";
    var days = duration.days();
    if (days > 0) {
        return days + "д. " + time;
    } else {
        return time;
    }

};

var ltcShowMessage = function(x) {
    $.toast({
        heading: x.Title,
        text: x.Details,
        icon: x.Class,
        loader: true, // Change it to false to disable loader
        loaderBg: '#9EC600' // To change the background
    });
};

var parseDateTime = function(s) {
    if (s) return moment(s).format("HH:mm DD.MM.YY");
    return "-";
};

String.prototype.myFormat = function() {
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];

        var args = ("string" === t || "number" === t)
            ? Array.prototype.slice.call(arguments)
            : arguments[0];
        var key;
        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }
    return str;
};