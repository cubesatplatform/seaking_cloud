function getPower(){
    let hand = chartPower.hands.push(new am4charts.ClockHand());
    if(chartPower.hands.length > 1){
      chartPower.hands.removeIndex(0).dispose(); 
    }
    $.ajax({
      type: 'GET',
      url: 'https://9nxvzfnhrd.execute-api.us-east-1.amazonaws.com/v1/power?limit=30',
      success: function (data) {
  
        hand.showValue(data[0].value);
      },
      error: function (error) {
        console.log(error);
      },
    });
   
  }