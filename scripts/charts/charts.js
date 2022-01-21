

$(document).ready(function(){

	
	  

	am4core.useTheme(am4themes_animated);
	am4core.useTheme(am4themes_dark);

	chart1 = am4core.create("chart-1", am4charts.XYChart);
	chart1.paddingBottom = 10;
	chart1.responsive = {
	  "enabled": true
	};
	chart1.legend = new am4charts.Legend();
	// chart1.dataSource.url = "https://maze-key.com/data/chart1-data.json";
	// chart1.dataSource.load();
	chart1.data = [];

	var c1Axis = chart1.xAxes.push(new am4charts.CategoryAxis());
	c1Axis.renderer.grid.template.location = 0;
	c1Axis.dataFields.category = "label";
	c1Axis.tooltip.background.strokeWidth = 0;
	c1Axis.tooltip.background.cornerRadius = 3;
	c1Axis.tooltip.background.pointerLength = 0;
	c1Axis.tooltip.background.fill = am4core.color("#7033D3");
	c1Axis.renderer.grid.template.strokeWidth = 0


	
	var v1Axis = chart1.yAxes.push(new am4charts.ValueAxis());
	v1Axis.tooltip.disabled = true;
	v1Axis.renderer.minGridDistance = 20;
	v1Axis.strokeWidth = 0

	var v1Axis2 = chart1.yAxes.push(new am4charts.ValueAxis());
	v1Axis2.tooltip.disabled = true;
	v1Axis2.renderer.minGridDistance = 20;
	v1Axis2.strokeWidth = 0
	v1Axis2.renderer.opposite = true;

	

	// var series3 = chart1.series.push(new am4charts.LineSeries());
	// series3.dataFields.categoryX  = "label";
	// series3.dataFields.valueY = "value3";
	// series3.tooltipText = "{valueY}";
	// series3.stroke = am4core.color("#FD2D7A"); 
	// series3.strokeWidth = 2;



	// var bullets1 = series1.bullets.push(new am4charts.CircleBullet());
	// bullets1.fill = am4core.color("#7033D3"); 
	// bullets1.circle.radius = 3;	

	// chart1.cursor = new am4charts.XYCursor();
	// chart1.cursor.snapToSeries = series1;
	// chart1.cursor.xAxis = c1Axis;






	///002
	chart2 = am4core.create("chart-2", am4charts.RadarChart);
	chart2.innerRadius = am4core.percent(79);
	chart2.paddingLeft = 0;
	chart2.paddingRight = 0;
	paddingBottom =20;

	// chart2.data = [{
	//   "label": "data1",
	//   "value": 74	
	// }];


	var c2Axis = chart2.yAxes.push(new am4charts.CategoryAxis());
	c2Axis.dataFields.category = "label";
	c2Axis.renderer.grid.template.stroke = am4core.color("#0F1214");
	c2Axis.renderer.grid.template.strokeWidth = 10;
	c2Axis.renderer.grid.template.strokeOpacity = 1;
	c2Axis.renderer.labels.template.disabled = true;

	var v2Axis = chart2.xAxes.push(new am4charts.ValueAxis());
	v2Axis.renderer.grid.template.strokeOpacity = 0;
	v2Axis.min = 0;
	v2Axis.max = 100; 
	v2Axis.renderer.labels.template.disabled = true;

	var series2 = chart2.series.push(new am4charts.RadarColumnSeries());
	series2.dataFields.valueX = "value";
	series2.dataFields.categoryY = "label";
	series2.fill = am4core.color("#7033D3"); 
	series2.strokeWidth = 0;
	series2.sequencedInterpolation = true;
	series2.sequencedInterpolationDelay = 100;
	series2.stacked = true;
	// series2.columns.template.radarColumn.cornerRadius = 30;


	var c2Label = chart2.radarContainer.createChild(am4core.Label);
	//c2Label.text = chart2.data[0]. value + '%';
	c2Label.fontSize = 20;
	c2Label.horizontalCenter = "middle";
	c2Label.verticalCenter = "middle";	

	chart2.dataSource.url = "https://maze-key.com/data/chart2-data.json";
	chart2.dataSource.load();
	chart2.dataSource.events.on("done", function(ev) {
	  // Data loaded and parsed
	  var cdata = ev.target.data;
	  c2Label.text = cdata[0]. value + '%';
	});



	///003
	chart3 = am4core.create("chart-3", am4charts.RadarChart);
	chart3.innerRadius = am4core.percent(86);
	chart3.startAngle = -180;
	chart3.endAngle = 0;
	
	paddingBottom =20;

	// chart3.data = [{
	//   "label": "data1",
	//   "value": 1030	
	// }];


	var c3Axis = chart3.yAxes.push(new am4charts.CategoryAxis());
	c3Axis.dataFields.category = "label";
	c3Axis.renderer.grid.template.stroke = am4core.color("#0F1214");
	c3Axis.renderer.grid.template.strokeWidth = 10;
	c3Axis.renderer.grid.template.strokeOpacity = 1;
	c3Axis.renderer.labels.template.disabled = true;
	c3Axis.renderer.grid.template.cornerRadius = 30;
	// c3Axis.renderer.minGridDistance = 50

	var v3Axis = chart3.xAxes.push(new am4charts.ValueAxis());
	v3Axis.renderer.grid.template.strokeOpacity = 0;
	v3Axis.min = 900;
	v3Axis.max = 1050; 
	v3Axis.strictMinMax = true;
	v3Axis.renderer.minGridDistance = 150;
	// v3Axis.renderer.labels.template.disabled = true;

	var series3 = chart3.series.push(new am4charts.RadarColumnSeries());
	series3.dataFields.valueX = "value";
	series3.dataFields.categoryY = "label";
	series3.fill = am4core.color("#7033D3"); 
	series3.strokeWidth = 0;
	series3.sequencedInterpolation = true;
	series3.sequencedInterpolationDelay = 100;
	series3.stacked = true;
	// series3.columns.template.radarColumn.cornerRadius = 30;


	var c3Label = chart3.radarContainer.createChild(am4core.Label);
	// c3Label.text = chart3.data[0]. value + ' hPa';
	c3Label.fontSize = 20;
	c3Label.horizontalCenter = "middle";
	c3Label.verticalCenter = "middle";	


	chart3.dataSource.url = "https://maze-key.com/data/chart3-data.json";
	chart3.dataSource.load();
	chart3.dataSource.events.on("done", function(ev) {
	  // Data loaded and parsed
	  var cdata = ev.target.data;
	  c3Label.text = cdata[0]. value + ' hPa';
	});


	
	///0004

	chartTemp = am4core.create("chart-temp", am4charts.GaugeChart);
	chartTemp.innerRadius = -10;
	chartTemp.paddingBottom = 0;

	var c4axis = chartTemp.xAxes.push(new am4charts.ValueAxis());
	c4axis.min = -100;
	c4axis.max =100;
	

	

	var c4range0 = c4axis.axisRanges.create();
	c4range0.value = -100;
	c4range0.endValue = 0;
	c4range0.axisFill.fillOpacity = 0.3;
	c4range0.axisFill.fill = am4core.color("#E84779");
	c4range0.axisFill.zIndex = 1;

	var c4range1 = c4axis.axisRanges.create();
	c4range1.value = 0;
	c4range1.endValue = 100;
	c4range1.axisFill.fillOpacity = 1;
	c4range1.axisFill.fill =  am4core.color("#E84779");
	c4range1.axisFill.zIndex = 1;
    //range1.axisFill.fill =  am4core.color("#d43663");

	
	// setInterval(() => {
	//   hand.showValue(Math.random() * 100, 1000, am4core.ease.cubicOut);
	// }, 2000);




	// var c4Label = chartTemp.radarContainer.createChild(am4core.Label);
	// c4Label.text = 'Temperature';
	// c4Label.fontSize = 20;

    // c4Label.y = 50;
	// c4Label.horizontalCenter = "middle";
	// c4Label.verticalCenter = "bottom";





///0005

chartPower = am4core.create("chart-power", am4charts.GaugeChart);
chartPower.innerRadius = -10;
chartPower.paddingBottom = 0;

var c5axis = chartPower.xAxes.push(new am4charts.ValueAxis());
c5axis.min = 0;
c5axis.max = 1000;

var range = c5axis.axisRanges.create();
range.value = 0;
range.endValue = 1000;
range.axisFill.fillOpacity = 1;
range.axisFill.fill = am4core.color("#492a95");
range.axisFill.zIndex = 1;

//range1.axisFill.fill =  am4core.color("#d43663");

// hand5 = chartPower.hands.push(new am4charts.ClockHand());
// hand5.showValue(-5, 0, am4core.ease.cubicOut);
	// setInterval(() => {
	//   hand.showValue(Math.random() * 100, 1000, am4core.ease.cubicOut);
	// }, 2000);







	//TIMELINE

// chartTimeline = am4core.create("chart-timeline", am4charts.XYChart);
// chartTimeline.paddingTop = 0;
// chartTimeline.paddingBottom = 0;
// Add data
// chartTimeline.data = [{
//   "x": 1,
//   "y": 1,
//   "text": "Start up",
//   "center": "top"
// }, {
//   "x": 2,
//   "y": 1,
//   "text": "Liftoff",
//   "center": "bottom"
// }, {
//   "x": 4,
//   "y": 1,
//   "text": "Main Engine Cutoff",
//   "center": "top"
// }, {
//   "x": 7,
//   "y": 1,
//   "text": "[bold]Stage 1[/]\nEntry Burn",
//   "center": "bottom"
// }, {
//   "x": 8,
//   "y": 1,
//   "text": "[bold]Second Stage[/]\nEngine Cutoff",
//   "center": "top"
// }, {
//   "x": 8.5,
//   "y": 1,
//   "text": "[bold]Stage 1[/]\nLanding",
//   "center": "bottom"
// }, {
//   "x": 20,
//   "y": 1,
//   "text": "[bold]Second Stage[/]\nEngine Startup 2",
//   "center": "top"
 
// }, {
//   "x": 22,
//   "y": 1,
//   "text": "[bold]Second Stage[/]\nEngine Cutoff",
//   "center": "bottom"
 
// }, {
//   "x": 27,
//   "y": 1,
//   "text": "Deploy",
//   "center": "top"
 
// }, {
//   "x": 29,
//   "y": 1,
//   "text": "Deploy",
//   "center": "bottom"
 


// }];

// chartTimeline.dataSource.url = "https://maze-key.com/data/chartTimeline-data.json";
// chartTimeline.dataSource.load();

// Create axes
// var xTimelineAxis = chartTimeline.xAxes.push(new am4charts.ValueAxis());
// xTimelineAxis.dataFields.valueX = "x";
// xTimelineAxis.renderer.grid.template.disabled = true;
// xTimelineAxis.renderer.labels.template.disabled = true;
// xTimelineAxis.renderer.baseGrid.disabled = true;
// xTimelineAxis.tooltip.disabled = true;
// xTimelineAxis.min=0;
// xTimelineAxis.max=30;


// var yTimelineAxis = chartTimeline.yAxes.push(new am4charts.ValueAxis());
// yTimelineAxis.min = 0;
// yTimelineAxis.max = 2;
// yTimelineAxis.strictMinMax = true;
// yTimelineAxis.renderer.grid.template.disabled = true;
// yTimelineAxis.renderer.labels.template.disabled = true;
// yTimelineAxis.renderer.baseGrid.disabled = true;
// yTimelineAxis.tooltip.disabled = true;


// // Create series
// var seriesTimeline = chartTimeline.series.push(new am4charts.LineSeries());
// seriesTimeline.dataFields.valueX = "x";
// seriesTimeline.dataFields.valueY = "y";
// seriesTimeline.strokeWidth = 5;
// seriesTimeline.sequencedInterpolation = true;
// seriesTimeline.stroke = am4core.color("#492a95"); 



// var bulletTimeline = seriesTimeline.bullets.push(new am4charts.CircleBullet());
// bulletTimeline.circle.radius = 6;
// bulletTimeline.fill = am4core.color("#7033D3"); 
// bulletTimeline.setStateOnChildren = true;
// bulletTimeline.states.create("hover");
// bulletTimeline.circle.states.create("hover").properties.radius = 10;
// bulletTimeline.states.create("hover").properties.fill = am4core.color("#fff");



// var labelBulletTimeline = seriesTimeline.bullets.push(new am4charts.LabelBullet());
// labelBulletTimeline.label.text = "{text}";
// // labelBullet.label.fontSize = 11;
// labelBulletTimeline.label.maxWidth = 150;
// labelBulletTimeline.label.wrap = true;
// labelBulletTimeline.label.truncate = false;
// labelBulletTimeline.label.textAlign = "middle";
// labelBulletTimeline.label.paddingTop = 20;
// labelBulletTimeline.label.paddingBottom = 20;
// labelBulletTimeline.label.fill = am4core.color("#fff");



// labelBulletTimeline.setStateOnChildren = true;
// labelBulletTimeline.states.create("hover").properties.scale = 1.1;
// labelBulletTimeline.label.propertyFields.verticalCenter = "center";


// chartTimeline.cursor = new am4charts.XYCursor();
// chartTimeline.cursor.lineX.disabled = true;
// chartTimeline.cursor.lineY.disabled = true;
















	
})
function reloadSensors(){
	// chartTemp.dataSource.url =  'https://maze-key.com/data/sensor-data.json';
	// chartTemp.dataSource.load();
	// chartTemp.dataSource.events.on("done", function(ev) {
	//   hand4.showValue(ev.data[0], 0, am4core.ease.cubicOut);
	// });

	// chartPower.dataSource.url =  'https://maze-key.com/data/sensor-data.json';
	// chartPower.dataSource.load();
	// chartPower.dataSource.events.on("done", function(ev) {
	//   hand5.showValue(ev.data[1], 0, am4core.ease.cubicOut);
	// });
}

function reloadGraphs(){

	

	// this[chart].dataSource.url = 'https://maze-key.com/data/'+chart+'-data.json';
	// this[chart].dataSource.load();

	// chart1.dataSource.url = 'https://maze-key.com/data/chart1-data.json';
	// chart1.dataSource.load();

	chart2.dataSource.url = 'https://maze-key.com/data/chart2-data.json';
	chart2.dataSource.load();

	chart3.dataSource.url = 'https://maze-key.com/data/chart3-data.json';
	chart3.dataSource.load();


}

function reloadTimeline(){
	chartTimeline.dataSource.url = 'https://maze-key.com/data/chartTimeline-data.json';
	chartTimeline.dataSource.load();

}



function reloadChart(){
	let charttype = $('.sensor-select').val()
	let clength = chart1.series.length
	  for( let s=0; s < clength; s++){
		chart1.series.removeIndex(0).dispose();
	  }
	  if(charttype =='gyro'){
		chart1.data = gyroChartData;
		createSeries('gyrox','#7033D3')
		createSeries('gyroy',"#2DCABD")
		createSeries('gyroz','#E84779')
		createSeries('gyroaccu','#FCD15D')
  
	  }else if(charttype=='rot'){
		chart1.data = rotChartData;
		createSeries('rotx','#7033D3')
		createSeries('roty',"#2DCABD")
		createSeries('rotz','#E84779')
		createSeries('rotaccu','#FCD15D')
  
	  }else if(charttype=='mag'){
		chart1.data = magChartData;
  
		createSeries('magx','#7033D3')
		createSeries('magy',"#2DCABD")
		createSeries('magz','#E84779')
		createSeries('magaccu','#FCD15D')
	  }else if(charttype=='quat'){
		chart1.data = quatChartData;
  
		createSeries('quatx','#7033D3')
		createSeries('quaty',"#2DCABD")
		createSeries('quatz','#E84779')
		createSeries('quataccu','#FCD15D')
	  }else if(charttype=='acc'){
		chart1.data = accChartData;
  
		createSeries('accx','#7033D3')
		createSeries('accy',"#2DCABD")
		createSeries('accz','#E84779')
		createSeries('accu','#FCD15D')
	  }else if(charttype=='lacc'){
		chart1.data = laccChartData;
  
		createSeries('laccx','#7033D3')
		createSeries('laccy',"#2DCABD")
		createSeries('laccz','#E84779')
		createSeries('linaccu','#FCD15D')
	  }else if(charttype=='rpy'){
		chart1.data = rpyChartData;
  
		createSeries('roll','#7033D3')
		createSeries('pitch',"#2DCABD")
		createSeries('yaw','#E84779')
  
	  }else if(charttype=='gps'){
		chart1.data = gpsChartData;
		createSeries('vel','#7033D3')
		createSeries('alt',"#E84779")
  
	  }else if(charttype=='temp'){  
		chart1.data = tempChartData;
		createSeries('temp','#E84779')
	  }
}
  
function createSeries(name,color){
	var series = chart1.series.push(new am4charts.LineSeries());
	series.dataFields.categoryX  = "label";
	series.dataFields.valueY = name;
	series.stroke = am4core.color(color); 
	series.strokeWidth = 2;
	series.name = name;
}