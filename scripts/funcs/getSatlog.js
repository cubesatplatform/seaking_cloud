
function getSatlog(){
    $.ajax({
      type: 'GET',
      url: 'https://9nxvzfnhrd.execute-api.us-east-1.amazonaws.com/v1/satlog?limit=1',
      success: function (data) {
        $('.col-inertia .val-rssi').text(data[0].rssi);
      },
      error: function (error) {
        console.log(error);
      },
    });
  }
  