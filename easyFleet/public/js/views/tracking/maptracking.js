
$(document).ready(function(){
    var logoutController = new LogoutController();

    $('#map_canvas').gmap({'disableDefaultUI':true, 'callback': function() {
        var self = this;
        $.getJSON( '/data/demo.json', function(data) { 
            $.each( data.markers, function(i, marker) {
                self.addMarker({ 'position': new google.maps.LatLng(marker.latitude, marker.longitude), 'bounds':true } ).click(function() {
                    self.openInfoWindow({ 'content': marker.content }, this);
                });
            });
        });
    }}); 

})