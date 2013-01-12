
$(document).ready(function(){

	var logoutController = new LogoutController();

	drawViolationCount();

	$.ajax({
            url: '/data/polling_status.json',
            method: 'GET',
            dataType: 'json',
            success: onPollingStatusDataReceived
        });

	$.ajax({
            url: '/data/violation_summary.json',
            method: 'GET',
            dataType: 'json',
            success: onViolationSummaryDataReceived
        });

	// then fetch the data with jQuery
    function onPollingStatusDataReceived(series) {
			drawPollingStatus(series);
    }
        
    
    function onViolationSummaryDataReceived(data) {
    
    	drawViolationSummary(data);
    }

    function drawViolationSummary(vsdata){
		var pVar1Title = 'Oct - 2012';
		var pVar2Title = 'Nov - 2012';
		var pVar3Title = 'Dec - 2012';

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

     function drawPollingStatus(series){
     	var data = [	{ label: "Moving   - ", data: 4, color: 'green' },
				{ label: "Idle     - ", data: 5, color: 'yellow' },
				{ label: "Stop     - ", data: 9, color: 'red' },
				{ label: "Inactive - ", data: 6, color: 'gray' }
			]

        var options = {
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
	        }
            
            // and plot all we got
            $.plot($("#interactive"), data, options);

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

 

    

     
	 
})