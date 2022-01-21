function getIR(side){
    //let hand = chartPower.hands.push(new am4charts.ClockHand());
    
    $.ajax({
        type: 'GET',
        url: 'https://9nxvzfnhrd.execute-api.us-east-1.amazonaws.com/v1/irarray?side='+side,
        success: function (data) {

        toCube(data[0].data,side)
        },
        error: function (error) {
        console.log(error);
        },
    });

}