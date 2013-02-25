function VehicleEventMapController(){
	
}

/*
 *Get icon of marker based on the event 
 */
VehicleEventMapController.prototype.getMarkerIcon = function(event) {
	var icon_rootpath = "/images/map/";
	var icon ;
    var type ;
    var color;
    var dir = "west"; 

    if (event.speed > 60) {
        color = "red/";
    }else{
        color = "green/";
    }

    icon = icon_rootpath + color + dir + ".png"

    console.log ("icon ", icon);

    return icon;
}

VehicleEventMapController.prototype.getMarkerContent= function(event) {
	var title = JSONstring.make(event);
	tile = "<div>" + title + "</div>";

	var h1 = "<h1>" + event.imei+ "</h1>";
	var location = "<p>" + event.lat+ ","+ event.lon + "</p>";
	var time = "<p>" + event.date + "</p>";

	var content = "<div>" + h1 + location + time + "</div>";

	return content;

	// var contentString = '<div id="content">'+ h1;
 //        +
 //        '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
 //        'sandstone rock formation in the southern part of the '+
 //        'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
 //        'south west of the nearest large town, Alice Springs; 450&#160;km '+
 //        '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
 //        'features of the Uluru - Kata Tjuta National Park. Uluru is '+
 //        'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
 //        'Aboriginal people of the area. It has many springs, waterholes, '+
 //        'rock caves and ancient paintings. Uluru is listed as a World '+
 //        'Heritage Site.</p>'+
 //        '<p>Attribution: Uluru, <a href="http://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
 //        'http://en.wikipedia.org/w/index.php?title=Uluru</a> '+
 //        '(last visited June 22, 2009).</p>'+
 //        '</div>';

   
}