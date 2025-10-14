function set_datetimepicker(element){
    try{
        $(element).datetimepicker({
              format: 'YYYY-MM-DD hh:mm A',
        });
    }catch(ex){

    }

}

function setCurrentFutureDateTimePicker(element){
    try{
        const $input = $(element);

        // Destroy existing DateTimePicker instance first
        if ($input.data("DateTimePicker")) {
            $input.data("DateTimePicker").destroy();
        }
        
        const currentValue = $input.val(); // Value from DB (e.g., "2025-07-05 04:00 PM")
        const now = moment().startOf('day'); // Current date & time
        let minDate = now; // Default to now
        
        if (currentValue) {
            const dbMoment = moment(currentValue, 'YYYY-MM-DD hh:mm A');
            // Use the earlier of current time or DB value
            if (dbMoment.isBefore(now)) {
                minDate = dbMoment;
            }
        }
        $(element).datetimepicker({
            format: 'YYYY-MM-DD hh:mm A',
            minDate: minDate,
            useCurrent: false,
            // keepOpen: false,
        });

        let timeSetOnce = false; // Flag to avoid overwriting manually set times

        // $input.on("dp.change", function (e) {
        //     const selected = e.date;

        //     if (!timeSetOnce && selected && selected.hour() === 0 && selected.minute() === 0) {
        //         const now = moment();
        //         selected.set({
        //             hour: now.hour(),
        //             minute: now.minute()
        //         });

        //         $input.data("DateTimePicker").date(selected);
        //         timeSetOnce = true; // Avoid future overrides
        //     }
        // });

        $input.on("dp.change", function (e) {
            const selected = e.date;
            const current = moment();

            // Only reset if selected is in the past AND different from current
            if (selected && selected.isBefore(current, 'minute')) {
                // Set to current datetime
                $input.data("DateTimePicker").date(current);
            }
        });

    }catch(ex){
        console.error("DateTimePicker init error:", ex);
    }

}


function setCurrentFutureDateTimePicker__OLD(element){
    try{
        const $input = $(element);
        const currentValue = $input.val(); // Value from DB (e.g., "2025-07-05 04:00 PM")
        const now = moment(); // Current date & time
        let minDate = now; // Default to now
        
        if (currentValue) {
            const dbMoment = moment(currentValue, 'YYYY-MM-DD hh:mm A');
            // Use the earlier of current time or DB value
            if (dbMoment.isBefore(now)) {
                minDate = dbMoment;
            }
        }
        $(element).datetimepicker({
            format: 'YYYY-MM-DD hh:mm A',
            minDate: moment(),
            useCurrent: true,
        });
    }catch(ex){
        console.error("DateTimePicker init error:", ex);
    }

}

function set_datepicker(element){
    try{
        $(element).datetimepicker({
              format: 'YYYY-MM-DD',
              widgetPositioning: { horizontal: 'left', vertical: 'bottom'},
        });
    }catch(ex){

    }

}

function set_datepicker_past(element){
    try{
        $(element).datetimepicker({
              format: 'YYYY-MM-DD',
              widgetPositioning: { horizontal: 'left', vertical: 'bottom'},
              maxDate: moment(),
        });
    }catch(ex){

    }

}

function convertToUTC(dateStr) {
    // Step 1: Convert "MM-DD-YYYY hh:mm AM/PM" to a proper format for JavaScript
    let parsedDate = new Date(
        Date.parse(dateStr.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")) // Convert MM-DD-YYYY to MM/DD/YYYY
    );
  
    // Step 2: Adjust for the local timezone offset to get UTC time
    let utcDate = new Date(parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60000);
  
    // Step 3: Return the UTC time in ISO format
    return utcDate.toISOString();
}
  
function formatToLocalTime(utcDateStr) {
    if(utcDateStr != ""){
        // Step 1: Create Date object from UTC string
        let utcDate = new Date(utcDateStr);
    
        // Step 2: Convert to local time components
        let year = utcDate.getFullYear();
        let month = String(utcDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        let day = String(utcDate.getDate()).padStart(2, "0");
    
        let hours = utcDate.getHours();
        let minutes = String(utcDate.getMinutes()).padStart(2, "0");
    
        // Step 3: Convert to 12-hour format with AM/PM
        let period = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // Convert 0 to 12 for midnight
    
        // Step 4: Format the result
        return `${year}-${month}-${day} ${hours}:${minutes} ${period}`;
    }
    return "";
}

function convertLocalToUTC_OLD(localDateTime) {
    var browserDate = new Date(localDateTime);
    var utcDate = moment(browserDate).utc().format();
    // console.log("Browser Date:", browserDate);
    // console.log("UTC Date:", utcDate);
    return utcDate;
}

function convertLocalToUTC(localDateTime) {
    // Expecting format: "YYYY-MM-DD hh:mm A" (e.g. "2025-06-30 12:00 AM")
    const localMoment = moment(localDateTime, "YYYY-MM-DD hh:mm A");

    if (!localMoment.isValid()) {
        console.error("Invalid date format:", localDateTime);
        return null;
    }

    return localMoment.utc().format(); // ISO string in UTC
}


function randerUtcToLocal(field){
    var datetime_value = $(field).text();
    datetime_value = formatToLocalTime(datetime_value);
    $(field).text(datetime_value);
}

function randerAddListingUtcToLocal(fromField, toField){
    var datetime_value = $(fromField).val();
    if(datetime_value){
        datetime_value = formatToLocalTime(datetime_value);
        $(toField).val(datetime_value);
    }
}


function getLocalDateFromUTC(myTimeStamp, dateformat, timeformat){
    var dateX = new Date(myTimeStamp);
    date = new Date(dateX.getTime());
    
    var fullyear = date.getFullYear();
    var halfYear = parseInt(date.getFullYear().toString().substr(2,2), 10);
    var mts = date.getMonth()+1;
    var short_month_name = date.toLocaleString('default', { month: 'short' })
    var long_month_name = date.toLocaleString('default', { month: 'long' })
    var month_num = (mts < 10)?'0'+mts:mts;
    var dt = (date.getDate() < 10)?'0'+date.getDate():date.getDate();
    var hrs = (date.getHours() < 10)?'0'+date.getHours():date.getHours();
    var mins = (date.getMinutes() < 10)?'0'+date.getMinutes():date.getMinutes();
    var secs = (date.getSeconds() < 10)?'0'+date.getSeconds():date.getSeconds();

    var timeStp = '';
    if(dateformat == 'yyyy-mm-dd'){
        timeStp = fullyear+'-'+month_num+'-'+dt;
    }else if(dateformat == 'mm-dd-yyyy'){
        timeStp = month_num+'-'+dt+'-'+fullyear;
    }else if(dateformat == 'dd-mm-yyyy'){
        timeStp = dt+'-'+month_num+'-'+fullyear;
    }else if(dateformat == 'dd-mm-yy'){
        timeStp = dt+'-'+month_num+'-'+halfYear;
    }else if(dateformat == 'mm-dd-yy'){
        timeStp = month_num+'-'+dt+'-'+halfYear;
    }else if(dateformat == 'yy-mm-dd'){
        timeStp = halfYear+'-'+month_num+'-'+dt;
    }else if(dateformat == 'j m, Y'){
        timeStp = dt+' '+short_month_name+', '+fullyear;
    }else if(dateformat == 'm j, Y'){
        timeStp = short_month_name+' '+dt+', '+fullyear;
    }else if(dateformat == 'M j, Y'){
        timeStp = long_month_name+' '+dt+'th, '+fullyear;
    }else if(dateformat == 'j M, Y'){
        timeStp = dt+' '+long_month_name+', '+fullyear;
    }
    if(timeformat =='ampm'){
        var mer = (parseInt(hrs) >= 12)?'PM':'AM';
        hrs = parseInt(hrs) % 12;
        hrs = (hrs)?hrs:12;
        timeStp = timeStp+" "+hrs+":"+mins+" "+mer;
    }else{
        timeStp = timeStp+" "+hrs+":"+mins+":"+secs;
    }
    return timeStp;
}


