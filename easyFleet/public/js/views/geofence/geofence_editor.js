var circles = [];
var polygons = [];
var geoid = 19748;    //HY TODO

// ================================================================================
function updateCircleBoundary(name,type, geoid, circles){
  if (circles.length > 0) {
    for (var i = 0; i < circles.length; i++) {
      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/UpdateGeofence",
        data: "{'pGeofenceId':'" + geoid + "','pGeofenceName':'" + name + "','pGeofenceType':'" + type + "','pLatitude':'" + circles[i].getCenter().lat() + "','pLongitude':'" + circles[i].getCenter().lng() + "','pRadius':'" + circles[i].getRadius() + "','pFillColor':'" + circles[i].get('fillColor') + "','pCoordinates':''}",
        dateType: "json",
        success: function () {
          document.getElementById('mainContent_warning').innerHTML = "<div class='success'>Saved Successfully</div>";
        },
        error: function (xhr, status, error) {
          var err = eval("(" + xhr.responseText + ")");
          alert(err.Message);
        }
      });
    }
  }
}

// ================================================================================
function updatePolygons(name,type,geoid, polygons){
   if (polygons.length > 0) {
    for (var i = 0; i < polygons.length; i++) {
      var polyarray = polygons[i].getPath();
      var pCoordinates = "";
      for (var j = 0; j < polyarray.length; j++) {
        pCoordinates = pCoordinates + polyarray.getAt(j).lat() + ',' + polyarray.getAt(j).lng() + "|";
      }

      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/UpdateGeofence",
        data: "{'pGeofenceId':'" + geoid + "','pGeofenceName':'" + name + "','pGeofenceType':'" + type + "','pLatitude':'0','pLongitude':'0','pRadius':'0','pFillColor':'" + polygons[i].get('fillColor') + "','pCoordinates':'" + pCoordinates + "'}",
        dateType: "json",
        success: function (msg) {
          //alert(msg.d);
          document.getElementById('mainContent_warning').innerHTML = "<div class='success'>Saved Successfully</div>";
        },
        error: function (xhr, status, error) {
          var err = eval("(" + xhr.responseText + ")");
          alert(err.Message);
        }
      });
    }
  }
}

// ================================================================================
function UpdateGeofences() {
  var pGeofenceName = document.getElementById('geofencename').value;
  var pGeofenceType = document.getElementById('geofencetype').value;

  document.getElementById('mainContent_warning').innerHTML = "";

  if ((circles.length == 0) && (polygons.length == 0)) {
    document.getElementById('mainContent_warning').innerHTML = "<div class='alert alert-error'>Not a valid Geofences.</div>";
    return false;
  }

  if (pGeofenceName.length == 0) {
    document.getElementById('mainContent_warning').innerHTML = "<div class='alert alert-error'>Enter GeofenceName.</div>";
    return false;
  }

  if (pGeofenceType <= 0) {
    document.getElementById('mainContent_warning').innerHTML = "<div class='alert alert-error'>Select Geofence Type.</div>";
    return false;
  }

  updateCircleBoundary(pGeofenceName,pGeofenceType, geoid, circles);
  updatePolygons(pGeofenceName,pGeofenceType, geoid, polygons);
}


function test() {
      alert('polygon : ' + polygons.length);
      alert('circles : ' + circles.length);
    }


// ================================================================================
$(document).ready(function(){
  var logoutController = new LogoutController();

  gmapDrawing();
})

// ================================================================================

function gmapDrawing(){
    
    var poly;
    var markers = [];
    var path = new google.maps.MVCArray;

   
    var map;
    var drawingManager;
    var selectedShape;
    var colors = ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'];
    var selectedColor;
    var colorButtons = {};
    

    initialize();
    

    function clearSelection() {
      if (selectedShape) {
        selectedShape.setEditable(false);
        selectedShape = null;
      }
    }

    function setSelection(shape) {
      clearSelection();
      selectedShape = shape;
      shape.setEditable(true);
      selectColor(shape.get('fillColor') || shape.get('strokeColor'));
    }

    function deleteSelectedShape() {
      if (selectedShape) {

        if ((circles.length > 0) && (selectedShape.type = 'circle')) {
          for (var i = 0; i < circles.length; i++) {
            if (circles[i].getRadius() == selectedShape.getRadius()) {
              circles.splice(i, 1);
              selectedShape.setMap(null);
              break;
            }
          }
        }
        
        if ((polygons.length > 0) && (selectedShape.type = 'polygon')) {
          for (var i = 0; i < polygons.length; i++) {
            if (polygons[i].getPath() == selectedShape.getPath()) {
              polygons.splice(i, 1);
              selectedShape.setMap(null);
              break;
            }
          }
        }

        selectedShape.setMap(null);
      }
    }

    function selectColor(color) {
      selectedColor = color;
      for (var i = 0; i < colors.length; ++i) {
        var currColor = colors[i];
        colorButtons[currColor].style.border = currColor == color ? '2px solid #789' : '2px solid #fff';
      }

      // Retrieves the current options from the drawing manager and replaces the
      // stroke or fill color as appropriate.

      // var polylineOptions = drawingManager.get('polylineOptions');
      // polylineOptions.strokeColor = color;
      // drawingManager.set('polylineOptions', polylineOptions);

      // var rectangleOptions = drawingManager.get('rectangleOptions');
      // rectangleOptions.fillColor = color;
      // drawingManager.set('rectangleOptions', rectangleOptions);

      var circleOptions = drawingManager.get('circleOptions');
      circleOptions.fillColor = color;
      drawingManager.set('circleOptions', circleOptions);

      var polygonOptions = drawingManager.get('polygonOptions');
      polygonOptions.fillColor = color;
      drawingManager.set('polygonOptions', polygonOptions);
    }

    function setSelectedShapeColor(color) {
      if (selectedShape) {
        if (selectedShape.type == google.maps.drawing.OverlayType.POLYLINE) {
          selectedShape.set('strokeColor', color);
        } else {
          selectedShape.set('fillColor', color);
        }
      }
    }

    function makeColorButton(color) {
      var button = document.createElement('span');
      button.className = 'color-button';
      button.style.backgroundColor = color;
      google.maps.event.addDomListener(button, 'click', function() {
        selectColor(color);
        setSelectedShapeColor(color);
      });

      return button;
    }

    function buildColorPalette() {
      var colorPalette = document.getElementById('color-palette');
      for (var i = 0; i < colors.length; ++i) {
        var currColor = colors[i];
        var colorButton = makeColorButton(currColor);
        colorPalette.appendChild(colorButton);
        colorButtons[currColor] = colorButton;
      }
      selectColor(colors[0]);
    }

    function initialize() {
      var map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: 10,
        center: new google.maps.LatLng(25.774252, -80.190262 ),  //22.344, 114.048
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        zoomControl: true
      });

      var polyOptions = {
        strokeWeight: 0,
        fillOpacity: 0.45,
        editable: true
      };
        
      // Creates a drawing manager attached to the map that allows the user to draw
      // markers, lines, and shapes.
      drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.CIRCLE,
            google.maps.drawing.OverlayType.POLYGON,
            // google.maps.drawing.OverlayType.MARKER,
            // google.maps.drawing.OverlayType.POLYLINE,
            // google.maps.drawing.OverlayType.RECTANGLE
          ]
        },

        circleOptions: polyOptions,
        polygonOptions: polyOptions,
        map: map
      });

      google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
        if (e.type != google.maps.drawing.OverlayType.MARKER) {
            // Switch back to non-drawing mode after drawing a shape.
            drawingManager.setDrawingMode(null);

            // Add an event listener that selects the newly-drawn shape when the user
            // mouses down on it.
            var newShape = e.overlay;
            newShape.type = e.type;
            google.maps.event.addListener(newShape, 'click', function() {
              setSelection(newShape);
            });
            setSelection(newShape);
          }

          if (e.type == google.maps.drawing.OverlayType.CIRCLE) {
            circles.push(e.overlay);
          }
          
          if (e.type == google.maps.drawing.OverlayType.POLYGON) {
            polygons.push(e.overlay);
          }
      });

        // Clear the current selection when the drawing mode is changed, or when the
        // map is clicked.
      google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
      google.maps.event.addListener(map, 'click', clearSelection);
      google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', deleteSelectedShape);

      buildColorPalette();
    }
}

// ================================================================================