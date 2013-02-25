var map;
var g_infowindow ;
var g_geocoder;
var g_controller; 

//===========================================================================//
var markersArray = [];

function addMarker(marker) {
  markersArray.push(marker);
}

// Removes the overlays from the map, but keeps them in the array
function clearOverlays() {
  if (markersArray) {
    for (var i=0; i<markersArray.length; i++) {
      markersArray[i].setMap(null);
    }
  }
}

// Shows any overlays currently in the array
function showOverlays(map) {
  if (markersArray) {
    for (var i=0; i<markersArray.length; i++) {
      markersArray[i].setMap(map);
    }
  }
}

// Deletes all markers in the array by removing references to them
function deleteOverlays() {
  if (markersArray) {
    for (var i=0; i<markersArray.length; i++) {
      markersArray[i].setMap(null);
    }
    markersArray.length = 0;
  }
}


function create_event_marker(map,info,event){

    var position = new google.maps.LatLng(event.lat, event.lon);

    var marker = new google.maps.Marker({
            map:map,
            draggable:false,
            title: g_controller.getMarkerContent(event),     
            icon : g_controller.getMarkerIcon(event),
            // animation: google.maps.Animation.DROP,
            position: position,
            bounds: true
        });

    google.maps.event.addListener(marker, 'click', function() {
      info.setContent(marker.title);
      info.open(map, marker);
    });

    addMarker(marker);


    // map.addMarker({ 'position': new google.maps.LatLng(event.lat, event.lon), 'bounds':true } )
    // .click(function() {
    //     self.openInfoWindow({ 'content': event.date }, this);
    // });
}

/*
 * Add our customzied control into the map.
 */
function addGeoFenceControl(map) {
    var control = document.createElement('DIV');
    control.innerHTML = '<button> GeoFence </button>';
    control.className = 'btn';
    control.index = 1;

    // Add the control to the map
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(control);

    // When the button is clicked pan to sydney
    google.maps.event.addDomListener(control, 'click', function() {
        map.panTo(new google.maps.LatLng(-33.9, 151.2));
    });

    // Change the style when the user mousedowns
    google.maps.event.addDomListener(control, 'mousedown', function() {
        control.className = 'btn-selected';
    });

    // Change the style back when the user mouseups
    google.maps.event.addDomListener(control, 'mouseup', function() {
        control.className = 'btn';
    });
}


function map_initialize(mapElementId) {

    var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(3.00950002670288, 101.392852783203),
        panControl: true,
        zoomControl: true,
        scaleControl: true,
        overviewMapControl: true,
        streetViewControl: true,
        mapTypeControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById(mapElementId), mapOptions);

    g_infowindow = new google.maps.InfoWindow({
        content: "Hello"
    });

    google.maps.event.addListener(map, 'click', function() {
      g_infowindow.close();
    });

    g_geocoder = new google.maps.Geocoder();

    addGeoFenceControl(map);
}

//===============================================================================================

function onDataReceived(data){
    var events = data.aaData;
    
    console.log ("data from server", data);

    deleteOverlays();    //clean old markers...

    for (var i=0; i<events.length; i++){
        create_event_marker(map, g_infowindow, events[i]);
    }

    //set the center of map to first event's location... 
    var position = new google.maps.LatLng(events[0].lat, events[0].lon);
    map.setCenter(position);
}

function jsonData(name,type,from, to){
    var  obj = {};
    obj.msg =  parseInt(type);
    // obj.name = name;
    // obj.type = type;
    // obj.from = from;
    // obj.to = to;

    var s= "json=" + JSONstring.make(obj);

    return s;

}

// name: vehicle name
// type: event type
// from: from time
// to: to time  
function retrieveReport(name,type,from, to){

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "/ReportService",
        data: jsonData(name,type,from, to),
        dateType: "json",
        success: function (data) {
          onDataReceived(data);
        },
        error: function (xhr, status, error) {
          var err = eval("(" + xhr.responseText + ")");
          alert(err.Message);
        }
    });
}


function GenerateReport(){

    var type = $('#select_event_type').val();


    console.log("Event Type", type);
    

    retrieveReport("Taxi1",  type , "2013-01-11", "2013-04-11");
}

function testMarkerWithLabel(){
    var marker1 = new MarkerWithLabel({
       position: new google.maps.LatLng(3.00950002670288, 101.392852783203),
       draggable: true,
       raiseOnDrag: true,
       map: map,
       labelContent: "Taxi1",
       labelAnchor: new google.maps.Point(22, 0),
       labelClass: "marker_labels", // the CSS class for the label
       labelStyle: {opacity: 0.75}
     });

    var marker2 = new MarkerWithLabel({
       position: new google.maps.LatLng(3.00950002680288, 101.392852783203),
       draggable: true,
       raiseOnDrag: true,
       map: map,
       labelContent: "Cargo8",
       labelAnchor: new google.maps.Point(22, 0),
       labelClass: "marker_labels", // the CSS class for the label
       labelStyle: {opacity: 0.75}
     });
}


$(document).ready(function(){
    var logoutController = new LogoutController();
    g_controller = new VehicleEventMapController();

    $(function() {
        $( "#from" ).datetimepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1,

            showSecond: false,
            timeFormat: 'HH:mm:ss',
            stepHour: 1,
            stepMinute: 10,

          // onClose: function( selectedDate ) {
          //   $( "#to" ).datepicker( "option", "minDate", selectedDate );
          //   },

            onClose: function(dateText, inst) {
                if ($( "#to" ).val() != '') {
                    var testStartDate = $( "#from" ).datetimepicker('getDate');
                    var testEndDate = $( "#to" ).datetimepicker('getDate');
                    if (testStartDate > testEndDate)
                        $( "#to" ).datetimepicker('setDate', testStartDate);}
                    else {
                        $( "#to" ).val(dateText);
                    }
            },

            onSelect: function (selectedDateTime){
                $( "#to" ).datetimepicker('option', 'minDate', $( "#from" ).datetimepicker('getDate') );
            }
        });
        
        $("#to").datetimepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1,

            showSecond: false,
            timeFormat: 'HH:mm:ss',
            stepHour: 1,
            stepMinute: 10,

            onClose: function(dateText, inst) {
                if ($("#from").val() != '') {
                    var testStartDate = $("#from").datetimepicker('getDate');
                    var testEndDate = $("#to").datetimepicker('getDate');
                    if (testStartDate > testEndDate)
                        $("#from").datetimepicker('setDate', testEndDate);
                }else {
                    $("#from").val(dateText);
                }
            },
    
            onSelect: function (selectedDateTime){
                $("#from").datetimepicker('option', 'maxDate', $("#to").datetimepicker('getDate') );
            }
        });
    });
   

    map_initialize('map_canvas');

    testMarkerWithLabel();

    // $('#map_canvas').gmap({'disableDefaultUI':false, 'callback': function() {
    //     var self = this;
    //     $.getJSON( '/data/demo.json', function(data) { 
    //         $.each( data.markers, function(i, marker) {
    //             self.addMarker({ 'position': new google.maps.LatLng(marker.latitude, marker.longitude), 'bounds':true } ).click(function() {
    //                 self.openInfoWindow({ 'content': marker.content }, this);
    //             });
    //         });
    //     });
    // }}); 

    

})