var socket = io.connect("http://localhost:3000");

// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function(){
        
        socket.on('gasdata', function(data) {
            console.log('received:' + data );
        });

    });

function SubmitData(){
    var reading = $(gas_reading).val();
    var imei = $(device_imei).val();
    var data = {};
    

    data.imei = imei;
    data.reading = reading;
    data.date = new Date();

    console.log(data);

    socket.emit('gasdata', data );
}


function GasController(){
	
}


GasController.prototype.init = function( ) {
   
}

GasController.prototype.load = function( ) {
    
    
}

