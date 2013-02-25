
$(document).ready(function(){
    var logoutController = new LogoutController();



    var oTable = $('#vehicles_table').dataTable( {
    	"sDom": "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
    	"sPaginationType": "bootstrap",
		"oLanguage": {
			"sLengthMenu": "_MENU_ records per page"
		},

        "aLengthMenu": [[50, 100, 150, -1], [50, 100, 150, "All"]],

        "aoColumnDefs": 
        [
            { "sTitle": "Date Time",     "mData": "date",  "sType": "date", "aTargets": [ 0] },
            { "sTitle": "Device ID",     "mData": "imei",  "bSortable": false, "aTargets": [ 1 ] },
            { "sTitle": "Reading",       "mData": "reading",  "aTargets": [ 2 ] }
        ],

    
        "bServerSide": true,
        "bProcessing": true,
        "sAjaxSource": "/gas_processing",
        "sServerMethod": "GET",

         "fnServerParams": function ( aoData ) {
            aoData.push( { "name": "more_data", "value": "my_value" } );
        }

        // "sScrollY": "200px",
        // "oScroller": {
        //     "loadingIndicator": true
        // }
	} );


})