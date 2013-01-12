
$(document).ready(function(){

	var logoutController = new LogoutController();

	drawPollingStaus();
	drawViolationCount();
	drawViolationSummary();

	//$.plot($("#dash_polling_status"),  [ [[0, 0], [1, 1]] ], { yaxis: { max: 1 } });

	function pieHover(event, pos, obj) {
            if (!obj)
                return;
            percent = parseFloat(obj.series.percent).toFixed(2);
            //percent = obj.series.data[0][1].toString();
            $("#hover").html('<br/><br/><span style="font-weight: bold; color: ' + obj.series.color + '">' + obj.series.label + ' (' + percent + '%)</span>');
        }

    function pieClick(event, pos, obj) {
            if (!obj)
                return;
            percent = parseFloat(obj.series.percent).toFixed(2);
            var n;
            n = obj.series.label.indexOf('Inactive')
            if ( n >= 0 )
                {
                    var reurl = "Reports/ListPage.aspx?fromdate=2010.11.06 00:00:00&todate=2010.11.06 00:00:00&strException=1&strMonth=1&strYear=2012&strgroup=1&vehicleno=''&strDriverId=&strGeofenceID=&interval=&reportname=rpt_getInactiveVehicles&reportheader=Inactive Vehicles&strModuleID=45&strCompanyID=30&strFRID=1"
                    window.location.replace(reurl);
                }
            else {
                    alert('' + obj.series.label + ': ' + percent + '%');
            }
        }

	function drawPollingStaus() {
            var data = [];
            var series = 4 //Math.floor(Math.random()*10)+1;
            var paramEmployeeId = 2075
            var paramDashboard = 1

            data[0] = { label: "Moving   - ", data: 4, color: 'green' }
            data[1] = { label: "Idle     - ", data: 5, color: 'yellow' }
            data[2] = { label: "Stop     - ", data: 9, color: 'red' }
            data[3] = { label: "Inactive - ", data: 6, color: 'gray' }

            // INTERACTIVE
            $.plot($("#interactive"), data,
	        {
	            series: {
	                pie: {
	                	//innerRadius: 0.2,
	                    show: true,
	                    radius: 1,
	                    label: {
		                    show: true,
		                    radius: 3/4,
		                    formatter: function(label, series){
		                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'+label+ series.data[0][1] +'<br/>'+Math.round(series.percent)+'%</div>';
                    		},
                    		background: { 
                        		opacity: 0.8,
                    		}
                    	}
	                }
	            },
	            legend: {
            		show: false
            	}
	            // grid: {
	            //     hoverable: true,
	            //     clickable: true
	            // }
	        });

            $("#interactive").bind("plothover", pieHover);
            $("#interactive").bind("plotclick", pieClick);
        }

    function drawViolationCount(){

    	var d1 = [[2011, 1040], [2012, 0], [2013, 0], [2014, 0], [2015, 0]];
            var d2 = [[2011, 0], [2012, 293], [2013, 0], [2014, 0], [2015, 0]];
            var d3 = [[2011, 0], [2012, 0], [2013, 24], [2014, 0], [2015, 0]];
            var d4 = [[2011, 0], [2012, 0], [2013, 0], [2014, 2], [2015, 0]];
            var d5 = [[2011, 0], [2012, 0], [2013, 0], [2014, 0], [2015, 228]];

            var data1 = [
                    {
                        data: d1,
                        bars: {
                            show: true,
                            barWidth: 0.2,
                            align: "center",
                            fillColor: "#ABC6ED"
                        },
                        color: "#ABC6ED"
                    },
                    {
                        data: d2,
                        bars: {
                            show: true,
                            barWidth: 0.2,
                            align: "center",
                            fillColor: "#ABC6ED"
                        },
                        color: "#ABC6ED"
                    },
                    {
                        data: d3,
                        bars: {
                            show: true,
                            barWidth: 0.2,
                            align: "center",
                            fillColor: "#ABC6ED"
                        },
                        color: "#ABC6ED"
                    },
                    {
                        data: d4,
                        bars: {
                            show: true,
                            barWidth: 0.2,
                            align: "center",
                            fillColor: "#ABC6ED"
                        },
                        color: "#ABC6ED"
                    },
                    {
                        data: d5,
                        bars: {
                            show: true,
                            barWidth: 0.2,
                            align: "center",
                            fillColor: "#ABC6ED"
                        },
                        color: "#ABC6ED"
                    }

                ]

    	$.plot($("#dbViolationGraph"), data1, {
                xaxis: {
                    ticks: [[2011, "OS - " + 1040], [2012, "HB - " + 293], [2013, "Un.Stp - " + 24], [2014, "CntDrv - " +  2], [2015, "IDLE - " +  228]]
                }
            });
    }

 

    function drawViolationSummary(){


		var pVar1 = 1
		var pVar2 = 2
		var pVar3 = 3
		var pVar1Title = 'Oct - 2012'
		var pVar2Title = 'Nov - 2012'
		var pVar3Title = 'Dec - 2012'
		var vsdata = [
		{
		label: 'OVERSPEED',
		data: [[pVar1, 512], [pVar2, 925], [pVar3, 1623]]
		},
		{
		label: 'HARSH BRAKE',
		data: [[pVar1, 378], [pVar2, 971], [pVar3, 1249]]
		},
		{
		label: 'UNAUTORISED STOP',
		data: [[pVar1, 38], [pVar2, 123], [pVar3, 117]]
		},
		{
		label: 'IDLING',
		data: [[pVar1, 191], [pVar2, 538], [pVar3, 733]]
		},
		{
		label: 'CONT DRIVE',
		data: [[pVar1, 4], [pVar2, 5], [pVar3, 7]]
		}
		];


     	var options = {
     		series: {
     			lines: { show: true },
     			points: { show: true }
     		},
     		legend: { show: true,  noColumns:5, container: '#legendholder' },
     		xaxis: { tickDecimals: 0, ticks: [0, [1, pVar1Title], [2, pVar2Title], [3, pVar3Title]] },
     		yaxis: { min: 0 },
     		selection: { mode: "x" }
     	};

     	var placeholder = $("#dbViolationSummary");
     	var plot = $.plot(placeholder, vsdata, options);
     } 

     function drawVehicleSummary(){
     }
	 
})