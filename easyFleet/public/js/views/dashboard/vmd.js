
$(document).ready(function(){
    var logoutController = new LogoutController();



    $('#vehicles_table').dataTable( {
    	"sDom": "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
    	"sPaginationType": "bootstrap",
		"oLanguage": {
			"sLengthMenu": "_MENU_ records per page"
		}
	} );


    
    // $('#top_overspeed_table').dataTable( 
    //  {"bPaginate": false,
 //        "bLengthChange": false,
 //        "bFilter": true,
 //        "bSort": false,
 //        "bInfo": false,
 //        "bAutoWidth": false} );
})