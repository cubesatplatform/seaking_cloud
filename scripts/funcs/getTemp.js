
function getTemp(){
  
  
    let hand = chartTemp.hands.push(new am4charts.ClockHand());
    if(chartTemp.hands.length > 1){
      chartTemp.hands.removeIndex(0).dispose(); 
    }
  
    
    
    $.ajax({
      type: 'GET',
      url: 'https://9nxvzfnhrd.execute-api.us-east-1.amazonaws.com/v1/temp?limit=30',
      success: function (data) {
        // 
        hand.showValue(data[0].value);
  
        tempChartData =[]
        let index =1
        for (let e of data){
          if(e.value != 9999.9999 ){
            let t = {
              "label": index,
              "temp":e.value,
            }
            tempChartData.push(t)
            index++;
          }
        }
        reloadChart();
      },
      error: function (error) {
        console.log(error);
      },
    });
   
  }
  