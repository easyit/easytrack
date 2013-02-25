
$(document).ready(function(){
    var logoutController = new LogoutController();

    var poly;
    var markers = [];
    var path = new google.maps.MVCArray;

    var map;
    initialize();

    

    function initialize() {
    var uluru = new google.maps.LatLng(3.00950002670288, 101.392852783203);

    map = new google.maps.Map(document.getElementById("map_canvas"), {
      zoom: 14,
      center: uluru,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    poly = new google.maps.Polygon({
      strokeWeight: 3,
      fillColor: '#5555FF'
    });
    poly.setMap(map);
    poly.setPaths(new google.maps.MVCArray([path]));

    google.maps.event.addListener(map, 'click', addPoint);
  }

  function addPoint(event) {
    path.insertAt(path.length, event.latLng);

    var marker = new google.maps.Marker({
      position: event.latLng,
      map: map,
      draggable: true,
      icon:'/images/lock.png'
    });
    markers.push(marker);
    marker.setTitle("#" + path.length);

    google.maps.event.addListener(marker, 'click', function() {
      marker.setMap(null);
      for (var i = 0, I = markers.length; i < I && markers[i] != marker; ++i);
      markers.splice(i, 1);
      path.removeAt(i);
      }
    );

    google.maps.event.addListener(marker, 'dragend', function() {
      for (var i = 0, I = markers.length; i < I && markers[i] != marker; ++i);
      path.setAt(i, marker.getPosition());
      }
    );
  }

  

})