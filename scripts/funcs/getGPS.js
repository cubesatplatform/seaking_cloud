function getGPS(){
    $.ajax({
      type: 'GET',
      url: 'https://9nxvzfnhrd.execute-api.us-east-1.amazonaws.com/v1/gps',
      success: function (data) {
        for(let d in data[0]){
          $('.box-gps .val-'+ d ).text((data[0][d] == '9999.9999')? '-' : data[0][d]);
        }
        var mapSat = new google.maps.Map(document.getElementById('map-sat'), {
          zoom: 2,
          center: new google.maps.LatLng(data[0].lat, data[0].lon),
          disableDefaultUI: true
        });
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(data[0].lat, data[0].lon),
          map: mapSat,
          animation: google.maps.Animation.DROP,
          icon: 'images/s.png',
        });
  
        gpsChartData = []
        let index = 1
        for (let e of data){
          if(index <= 30 && (e.vel != 9999.9999 || e.alt != 9999.9999)){
            let g = {
              "label": index,
              "vel":e.vel,
              "alt":e.alt,
            }
            gpsChartData.push(g)
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
  