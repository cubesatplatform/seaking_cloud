function getBaseStation(){
    $.ajax({
      type: 'GET',
      url: 'https://9nxvzfnhrd.execute-api.us-east-1.amazonaws.com/v1/bstation?limit=1',
      success: function (data) {
    
        for(let d in data[0]){
          if(d == 'laston'){
            data[0][d] = parseISOString(data[0][d]).toDateString();
         
          }
  
          $('.box-bstation .val-'+ d ).text((data[0][d] == '9999.9999')? '-' : data[0][d]);
          var mapSat = new google.maps.Map(document.getElementById('map-station'), {
            zoom: 2,
            center: new google.maps.LatLng(data[0].lat, data[0].lon),
            disableDefaultUI: true
          });
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(data[0].lat, data[0].lon),
            map: mapSat,
            animation: google.maps.Animation.DROP,
            icon: 'images/g.png',
          });
        }    
      },
      error: function (error) {
        console.log(error);
      },
    });
  }