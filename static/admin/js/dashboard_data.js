$(function () {
  var line_chart = "";
  var bar_chart = "";

// ------------Date Picker----------
  var dateFormat = "yy-mm-dd";
  from = $( "#datetimepicker_1" )
    .datepicker({
      dateFormat: "yy-mm-dd",
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 1
    })
    .on( "change", function() {
      to.datepicker( "option", "minDate", getDate( this ) );
    }),
  to = $( "#datetimepicker_2" ).datepicker({
    dateFormat: "yy-mm-dd",
    defaultDate: "+1w",
    changeMonth: true,
    numberOfMonths: 1
  })
  .on( "change", function() {
    from.datepicker( "option", "maxDate", getDate( this ) );
  });

    function getDate( element ) {
      var date;
      try {
        date = $.datepicker.parseDate(dateFormat, element.value );
      } catch( error ) {
        date = null;
      }

      return date;
    }

//----------------------Date Change Event---------------------
  $(document).on('change', '#datetimepicker_1, #datetimepicker_2', function() {
    var datetimepicker_1 = $("#datetimepicker_1").val();
    var datetimepicker_2 = $("#datetimepicker_2").val();
    if(datetimepicker_1 && datetimepicker_2){
        set_data();
    }
  });

  function update_dashboard(data){
    $("#total_offer_received").html(data.total_offer_received);
    $("#total_register_user").html(data.total_register_user);
    $("#total_customer").html(data.total_customer);
    $("#total_agent").html(data.total_agent);
    $("#total_property").html(data.total_property);
    $("#total_sold_property").html(data.total_sold_property);
    $("#total_boat_request").html(data.total_boat_request);
    $("#total_enquiry").html(data.total_enquiry);
    $("#active_user").html(data.total_active_customer);
    $("#inactive_user").html(data.total_inactive_customer);
    $("#active_agent").html(data.total_active_agent);
    $("#inactive_agent").html(data.total_inactive_agent);
    $("#active_property").html(data.total_active_property);
    $("#inactive_property").html(data.total_inactive_property);
    $("#approved_registration").html(data.total_approved_bid_registration);
    $("#pending_registration").html(data.total_pending_bid_registration);
    $("#accept_offer").html(data.total_accept_master_offer);
    $("#pending_offer").html(data.total_pending_master_offer);
    $("#total_projects").html(data.total_project);
    $("#active_project").html(data.total_active_project);
    $("#inactive_project").html(data.total_inactive_project);
    $("#total_employee").html(data.total_employee);
    $("#active_employee").html(data.total_active_employee);
    $("#inactive_employee").html(data.total_inactive_employee);
    $("#under_review_user").html(data.total_under_review_user);
    $("#verified_user").html(data.total_verified_user);
    $("#total_developer").html(data.total_developer);
    $("#active_developer").html(data.total_active_developer);
    $("#inactive_developer").html(data.total_inactive_developer);
    $("#total_transaction").html(data.total_transaction);
  }

  function signup_view_graph(dataset, label=""){
      var signup_data_display = dataset.signup_data_display;
      var page_view = dataset.page_view;
      if (label == ""){
        var labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
      }else{
        var labels = label;
      }

      var data = {
        labels: labels,
        datasets: [
          {
            label: "Signup Customer",
            backgroundColor: "red",
            borderColor: "red",
            data: signup_data_display
            //data: [3, 5, 6, 7, 3, 5, 6, 7, 9, 10, 11, 18]
          },
          {
            label: "Detail Page View",
            backgroundColor: "blue",
            borderColor: "blue",
            data: page_view
            //data: [4, 6, 7, 8, 4, 6, 7, 8, 10, 11, 12, 19]
          }
        ]
      };

      var chartOptions = {
        responsive: true,
        legend: {
          position: "top"
        },
        title: {
          // display: true,
          // text: "Chart.js Bar Chart"
        },
        scales: {
//          yAxes: [{
//            ticks: {
//              beginAtZero: true,
////              reverse: false,
//              stepSize: 1
//            }
//          }]
            y: {
//                title: {
//                  display: true,
//                  text: 'Value'
//                },
                min: 0,
                //max: 100,
                ticks: {
                  // forces step size to be 50 units
                  stepSize: 1
                }
            }
        }
      }
      if (line_chart){
        line_chart.destroy();
      }
      var ctx_1 = document.getElementById("line_chart").getContext('2d');
      line_chart = new Chart(ctx_1, {
          type: 'line',
          data: data,
          options: chartOptions,
      });
  }

  function property_registration_graph(dataset, label=""){
      var property_data_display = dataset.property_data_display;
      var registration_data_display = dataset.registration_data_display;
      if (label == ""){
        var labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
      }else{
        var labels = label;
      }

      var data = {
        labels: labels,
        datasets: [
        {
          label: "Property",
          backgroundColor: "green",
          //borderColor: "green",
          //borderWidth: 1,
          //data: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
          data: property_data_display
        },
        {
          label: "Registered User",
          backgroundColor: "blue",
          //borderColor: "blue",
          //borderWidth: 1,
          //data: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
          data: registration_data_display
        }
      ]
      };
      var chartOptions = {
        responsive: true,
        legend: {
          position: "top"
        },
        title: {
          // display: true,
          // text: "Chart.js Bar Chart"
        },
        scales: {
//          yAxes: [{
//            ticks: {
//              beginAtZero: true,
////              reverse: false,
////              stepSize: 3
////                min: 0,
////                callback: function(value, index, values) {
////                    if (Math.floor(value) === value) {
////                        return value;
////                    }
////                }
//            }
//          }]
            y: {
//                title: {
//                  display: true,
//                  text: 'Value'
//                },
                min: 0,
                //max: 100,
                ticks: {
                  // forces step size to be 50 units
                  stepSize: 1
                }
            }
        }
      }
      if(bar_chart){
        bar_chart.destroy();
      }
      var ctx_2 = document.getElementById("bar_chart").getContext('2d');
      bar_chart = new Chart(ctx_2, {
          type: 'bar',
          data: data,
          options: chartOptions,
      });
  }

  // -------------------------Google Map--------------------------
  let map;
  async function initMap(data) {
    const position = { lat: 25.276987, lng: 55.296249 };
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    map = new Map(document.getElementById("map"), {
      zoom: 7,
      center: position,
      mapId: "DEMO_MAP_ID",
    });
    var image="/static/theme-1/images/home_icon.png";
    $.each(data, function( index, value ) {
      if(value.location != ""){
          marker_position = { lat: parseFloat(value.location.lat), lng: parseFloat(value.location.lon) };
          marker = new google.maps.Marker({
              position: marker_position,
              map: map,
               icon: {
                 url: image,
                 scaledSize: new google.maps.Size(35, 50), // scaled size
                 origin: new google.maps.Point(0,0), // origin
                 anchor: new google.maps.Point(0, 0) // anchor
               },
              title: value.name,
          });
      }
    });
  }

  // ----------------------Refresh Signup Page Graph--------------------
  $(document).on('click', '#refresh_signup_view_graph', function() {
    var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
    var datetimepicker_1 = $("#datetimepicker_1").val();
    var datetimepicker_2 = $("#datetimepicker_2").val();
    $.ajax({
        url: '/admin/update-signup-view-graph/',
        type: 'post',
        dateType: 'json',
        cache: false,
        data: {"start_date": datetimepicker_1, "end_date": datetimepicker_2, "csrfmiddlewaretoken": csrf_token},
        beforeSend: function(){
            //$('.overlay').show();
            $(".signup_graph").show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                var signup_view = response.signup_view;
                var label = response.label;
                signup_view_graph(signup_view, label);
            }
            $(".signup_graph").hide();
        }
    });
  });

  // ----------------------Refresh Property Registration Graph--------------------
  $(document).on('click', '#refresh_property_registration_graph', function() {
    var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
    var datetimepicker_1 = $("#datetimepicker_1").val();
    var datetimepicker_2 = $("#datetimepicker_2").val();
    $.ajax({
        url: '/admin/update-property-registration-graph/',
        type: 'post',
        dateType: 'json',
        cache: false,
        data: {"start_date": datetimepicker_1, "end_date": datetimepicker_2, "csrfmiddlewaretoken": csrf_token},
        beforeSend: function(){
            //$('.overlay').show();
            $(".registration_graph").show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                var property_registration = response.property_registration;
                var label = response.label;
                property_registration_graph(property_registration, label);
            }
            $(".registration_graph").hide();
        }
    });
  });

  // ----------------------Refresh Map--------------------
  $(document).on('click', '#refresh_map', function() {
    var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
    var datetimepicker_1 = $("#datetimepicker_1").val();
    var datetimepicker_2 = $("#datetimepicker_2").val();
    $.ajax({
        url: '/admin/update-dashboard-map/',
        type: 'post',
        dateType: 'json',
        cache: false,
        data: {"start_date": datetimepicker_1, "end_date": datetimepicker_2, "csrfmiddlewaretoken": csrf_token},
        beforeSend: function(){
            //$('.overlay').show();
            $(".map_graph").hide();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                  initMap(response.data);
            }
            $(".map_graph").hide();

        }
    });
  });

  function set_data(){
    var datetimepicker_1 = $("#datetimepicker_1").val();
    var datetimepicker_2 = $("#datetimepicker_2").val();
    var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
    $.ajax({
        url: '/admin/update-dashboard/',
        type: 'post',
        dateType: 'json',
        cache: false,
        data: {"start_date": datetimepicker_1, "end_date": datetimepicker_2, "csrfmiddlewaretoken": csrf_token},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                update_dashboard(response.dashboard_data);
                signup_view_graph(response.signup_view, response.label);
                property_registration_graph(response.property_registration, response.label);
                initMap(response.dashboard_map);
            }

        }
    });
  }
  //set_data();

  function load_dashboard_data(){
    var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
    var datetimepicker_1 = $("#datetimepicker_1").val();
    var datetimepicker_2 = $("#datetimepicker_2").val();
    $.ajax({
        url: '/admin/update-dashboard-data/',
        type: 'post',
        dateType: 'json',
        cache: false,
        async: false,
        data: {"start_date": datetimepicker_1, "end_date": datetimepicker_2, "csrfmiddlewaretoken": csrf_token},
        beforeSend: function(){
            //$('.overlay').show();
            $(".custom-loader").show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                var signup_view = response.signup_view;
                var label = response.label;
                update_dashboard(response.dashboard_data);
                load_signup_map();
            }
        }
    });
  }
  function load_signup_map(){
    var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
    var datetimepicker_1 = $("#datetimepicker_1").val();
    var datetimepicker_2 = $("#datetimepicker_2").val();
    $.ajax({
        url: '/admin/update-signup-view-graph/',
        type: 'post',
        dateType: 'json',
        cache: false,
        async: false,
        data: {"start_date": datetimepicker_1, "end_date": datetimepicker_2, "csrfmiddlewaretoken": csrf_token},
        beforeSend: function(){
            //$('.overlay').show();
            //$(".custom-loader").show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                var signup_view = response.signup_view;
                var label = response.label;
                $(".signup_graph").hide();
                signup_view_graph(signup_view, label);
                load_registration_map();
            }
        }
    });
  }
  function load_registration_map(){
    var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
    var datetimepicker_1 = $("#datetimepicker_1").val();
    var datetimepicker_2 = $("#datetimepicker_2").val();
    $.ajax({
        url: '/admin/update-property-registration-graph/',
        type: 'post',
        dateType: 'json',
        cache: false,
        async: false,
        data: {"start_date": datetimepicker_1, "end_date": datetimepicker_2, "csrfmiddlewaretoken": csrf_token},
        beforeSend: function(){
            //$('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                var property_registration = response.property_registration;
                var label = response.label;
                $(".registration_graph").hide();
                property_registration_graph(property_registration, label);
                load_map();
            }
        }
    });
  }
  function load_map(){
    var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
    var datetimepicker_1 = $("#datetimepicker_1").val();
    var datetimepicker_2 = $("#datetimepicker_2").val();
    $.ajax({
        url: '/admin/update-dashboard-map/',
        type: 'post',
        dateType: 'json',
        cache: false,
        data: {"start_date": datetimepicker_1, "end_date": datetimepicker_2, "csrfmiddlewaretoken": csrf_token},
        beforeSend: function(){
            //$('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                  $(".map_graph").hide();
                  initMap(response.data);
            }
        }
    });
  }
  load_dashboard_data();

});