let gcommand = 'satlog';

let gyroChartData = []
let rotChartData = []
let magChartData = []
let quatChartData = []
let accChartData = []
let laccChartData = []
let rpyChartData = []
let gpsChartData = []
let tempChartData =[]

var map;
var markers = [];

let page = 1


$(document).ready(function () {
 
  $('.popup-overlay .popup-close').click(function(){
    $('.popup-overlay').hide()
  })

  getIR(1);
  getIR(2);
  getIR(3);
  getIR(4);
  getIR(5);
  getIR(6);
 
  createSeries('gyrox','#7033D3')
  createSeries('gyroy',"#2DCABD")
  createSeries('gyroz','#E84779')
  createSeries('gyroaccu','#FCD15D')

  getSatlog()
  getIMU()
  getGPS();
  getBaseStation();
  getPower();
  getTemp()
 
  var wHeight = $(window).height();

  $('.main .row1').height(wHeight - 70);

  var row1Height = $('.main .row1').height();

  $('#map').height(row1Height / 2 + 100);

  var rbox = row1Height - $('#map').height();
  $('.row3 .box').each(function () {
    $(this).height(rbox - 48);
  });

  $('.col-graphs .box').each(function () {
    var cbox = row1Height / 2 ;
    $(this).css('height', cbox);
  });

  $('#map-sat').css('height', $('#box-sat').height() - $('#box-sat .list-group').height() - 60);

  $('#map-station').css('height', $('#map-sat').height());

  $('#chart-1').height($('#box-sgraphs').height() * 0.6);
  $('#chart-2').height($('#box-sgraphs').height() - $('#chart-1').height() - 30);
  $('#chart-3').height($('#box-sgraphs').height() - $('#chart-1').height() - 30);

  $('#chart-4').height($('#box-sdetails').height() - $('#box-sdetails .list-inertia').height() - 60);
  
  $('.aside').height(wHeight);

  $('.ticons i').click(function () {
    var thetext = $(this).attr('rel');  
    var thealt = $(this).attr('alt');
    if(gcommand=='satlog'){
      $('.row-messagebox-'+gcommand+' .messagebox').val(thealt);
    }else if(gcommand=='commands'){
      $('.row-messagebox-'+gcommand+' .messagebox').val(thetext);
    }
    
  });

  //sensor select

  $('.sensor-select').change(function(){
    reloadChart()
  })
  
  $('.ticons').hide();
  $('.ticons-satlog').show();

  ///TOGGLE COMMANDS TAB
  $('.row-messagebox').hide()
  $('.row-messagebox-satlog').show()

  $('.row-commands .col').click(function(){
    page  = 1;
    
    $('#list-commands').html('')
    $('.list-loader').hide(); 

    
    $('.row-commands .col').removeClass('col-active')
      $(this).addClass('col-active')
      gcommand = $(this).text().toLowerCase().trim();

      if(gcommand == 'image'){
        $('.row-messagebox').hide()
        $('.row-messagebox-image').show();
        $('.ticons').hide();
        $('.imgcomp-preview').show();
     
        $('#list-commands').hide();
        $('.list-loader').hide();
        $('.button-delete-all').hide();
        
      }else{   
        $('.row-messagebox').hide()
        $('.row-messagebox-'+gcommand).show();
        listCommands(gcommand);
        $('.ticons').hide();
        $('.ticons-'+gcommand).show();
     
        $('#list-commands').show();
        $('.button-delete-all').show();
        $('.imgcomp-preview').hide();
      }
  })


  //LOAD MORE
  $('.list-loader .button').click(function(){
     page = page + 1;
    listCommands(gcommand);
  })
});



function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: new google.maps.LatLng(-33.92, 151.25),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true
  });
  getMainMap();
  listCommands('satlog');
}

function getMainMap() {
  $('#map-container .fa-redo-alt').addClass('fa-spin');

  $.ajax({
    type: 'GET',
    url: 'https://9nxvzfnhrd.execute-api.us-east-1.amazonaws.com/v1/gps',
    success: function (data) {
      setMapOnAll(null);
      $('#map-container .fa-redo-alt').removeClass('fa-spin');
      var infowindow = new google.maps.InfoWindow({
        maxWidth: 250,
      });
      var bounds = new google.maps.LatLngBounds();
      var marker, i;
      for (i = 0; i < data.length; i++) {
        if(data[i].lat != 9999.9999 || data[i].lon != 9999.9999){
        //var coords = $.parseJSON(data[i].data);
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(data[i].lat, data[i].lon),
            map: map,
            animation: google.maps.Animation.DROP,
            icon: 'images/marker.png',
            //icon: 'images/' + data[i].type + '.png',
          });
          markers.push(marker);
          bounds.extend(marker.position);

          google.maps.event.addListener(
            marker,
            'mouseover',
            (function (marker, i) {
              return function () {
                var contentString =
                  '<div class="info-window-content">' +
                  '<div class="bodyContent">' +
                  '<div>Latitude : ' +
                  data[i].lat +
                  '</div>' +
                  '<div>Longitude : ' +
                  data[i].lon +
                  '</div>' +
                  //data[i].timestamp +
                  '<div class="time"><i class="far fa-calendar"></i> ' +
                  data[i].timestamp +
                  '</div>' +
                  '</div>' +
                  '</div>';

                infowindow.setContent(contentString);
                infowindow.open(map, marker);
              };
            })(marker, i)
          );
          google.maps.event.addListener(
            marker,
            'mouseout',
            (function (marker, i) {
              return function () {
                infowindow.close(map, marker);
              };
            })(marker, i)
          );
        }
      }

      map.fitBounds(bounds);
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function listCommands(command) {
 // $('#list-commands').html('');

  
  $.ajax({
    type: 'GET',
    url: 'https://9nxvzfnhrd.execute-api.us-east-1.amazonaws.com/v1/'+command +'?page='+page,
    success: function (data) {

      $('.list-loader span').text(data.length * page)
      // console.log(data);
      var content = '';
      for (var i = 0; i < data.length; i++) {
          
        content += '<li class="list-group-item listed">';
        content += '<div class="row">';
          if(command =='commands') {
            content += '<div class="col-1">'+ data[i].cid + '</div>';
            content += '<div class="col-data col-6">'+ data[i].data + '</div>';
            content += '<div class="col-2">'+ data[i].sent + '</div>';
            content += '<div class="col-2">'+ data[i].ack + '</div>';
            content += '<div class="col-action col-1 px-0"><i class="fas fa-times" data-id="'+data[i].cid+'"  data-key="cid" onclick="confirmDeleteRecord(this)"></i></div>'; 

          }else if( command=='satlog'){
            content += '<div class="col-1">'+ data[i].bid + '</div>';
            content += '<div class="col-data col-6">'+ data[i].data + '</div>';
            content += '<div class="col-1">'+ data[i].rssi + '</div>';
            content += '<div class="col col-1">'+ data[i].id + '</div>';
            content += '<div class="col-2">'+ data[i].cid + '</div>';
            content += '<div class="col-action col-1 px-0"><i class="fas fa-times" data-id="'+data[i].slid+'"  data-key="slid" onclick="confirmDeleteRecord(this)"></i></div>'; 
      
          }else if( command=='errorlog'){
            content += '<div class="col-1">'+ data[i].bid + '</div>';
            content += '<div class="col-data col">'+ data[i].data + '</div>';     
            content += '<div class="col-action col-1 px-0"><i class="fas fa-times" data-id="'+data[i].elid+'"  data-key="elid" onclick="confirmDeleteRecord(this)"></i></div>'; 
          }   
        
        

        content += '</div>';

        content += '<div class="record-overlay"><div class="content">Delete? '; 
        content += '<button class="button button-pink button-delete">Continue</button>'; 
        content += '<button class="button button-cancel">Cancel</button>'; 
        content += '</div></div>'; 

        content += '<div class="row"><div class="col label">'+ data[i].createdon + '</div></div>';
        content += '</li>';

      }

      let header = ''

      if(page == 1){
        header += '<div class="row row-list-header">';
        if(command =='commands') {
          header += '<div class="col-1">id</div>';
          header += '<div class="col col-6">data</div>';
          header += '<div class="col-2">sent</div>';
          header += '<div class="col-2">ack</div>';
        }else if( command=='satlog'){
          header += '<div class="col-1">bid</div>';
          header += '<div class="col col-6">data</div>';
          header += '<div class="col-1">rssi</div>';
          header += '<div class="col-1">id</div>';
          header += '<div class="col-2">cid</div>';
        }
        else if( command=='errorlog'){
          header += '<div class="col-1">bid</div>';
          header += '<div class="col col">data</div>';
        
        }
        header += '<div class="col-1  px-0">&nbsp;</div>';
        header += '</div>';

      }

      $('#list-commands').append(header + content);
      $('.list-loader').show()
      
    },
    error: function (error) {
      console.log(error);
      
    },
  });

}

function sendCommand() {
  $('.list-loader').hide()
  $('.list-loader span').text('0');
  let thecommand = queryStringToJSON($('.row-messagebox-'+gcommand+' .messagebox').val())

  console.log(thecommand)
  if($('.row-messagebox-'+gcommand+' .messagebox').val() != ''){
    if(gcommand == 'satlog'){
        $.ajax({
            type: 'GET',
            data: thecommand,
            url: 'https://9nxvzfnhrd.execute-api.us-east-1.amazonaws.com/v1/satlog',
            success: function (data) {
              console.log(data)
              page = 1
              $('#list-commands').html('');
              listCommands(gcommand);
              getMainMap() 
              getSatlog()
              getIMU()
              getGPS();
              getBaseStation();
              getPower();
              getTemp();

              getIR(1);
              getIR(2);
              getIR(3);
              getIR(4);
              getIR(5);
              getIR(6);

    
              $('.messagebox').val('');
              $('.list-loader').show()
            },
            error: function (error) {
              console.log(error);
             
              $('.messagebox').val('');
              $('.list-loader').show()
            },
          });
        

    }else if(gcommand == 'commands'){

      $.ajax({
        type: 'GET',
        data:{data: decodeURIComponent($.trim($('.row-messagebox-'+gcommand+' .messagebox').val()))},
        url: 'https://9nxvzfnhrd.execute-api.us-east-1.amazonaws.com/v1/commands',
        success: function (data) {
          console.log(data);
          page = 1
          $('#list-commands').html('');
          listCommands(gcommand);
          getMainMap() 
          getSatlog()
          getIMU()
          getGPS();
          getBaseStation();
          getPower();
          getTemp();

          getIR(1);
          getIR(2);
          getIR(3);
          getIR(4);
          getIR(5);
          getIR(6);
          $('.messagebox').val('');
          $('.list-loader').show()
        },
        error: function (error) {
          console.log(error);
         
          $('.messagebox').val('');
          $('.list-loader').show()
        },
      });
    }else if(gcommand == 'errorlog'){

      $.ajax({
        type: 'GET',
        data:{data: decodeURIComponent($.trim($('.row-messagebox-'+gcommand+' .messagebox').val()))},
        url: 'https://9nxvzfnhrd.execute-api.us-east-1.amazonaws.com/v1/errorlog',
        success: function (data) {
          console.log(data);
          page = 1
          $('#list-commands').html('');
          listCommands(gcommand);
          getMainMap() 
              getSatlog()
              getIMU()
              getGPS();
              getBaseStation();
              getPower();
              getTemp();

              getIR(1);
              getIR(2);
              getIR(3);
              getIR(4);
              getIR(5);
              getIR(6);

          $('.messagebox').val('');
          $('.list-loader').show()
        },
        error: function (error) {
          console.log(error);
         
          $('.messagebox').val('');
          $('.list-loader').show()
        },
      });
    }else if(gcommand == 'image'){
      if($('.row-messagebox-image input').val() != ''){
        let b64 = btoa(unescape(encodeURIComponent($('.row-messagebox-image input').val())))
        const blob = b64toBlob(b64, 'image/png');
        const blobUrl = URL.createObjectURL(blob);
        console.log(base64_encode($('.row-messagebox-image input').val()))
  
        //let dot = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
  
        $.ajax({
          type: 'GET',
          url: 'https://9nxvzfnhrd.execute-api.us-east-1.amazonaws.com/v1/imgcomp?file='+$('.row-messagebox-image input').val(),
          success: function (data) {
  
            // $('.imgcomp-preview').html(data)
  
            $('.imgcomp-preview').empty().append(
              $("<img />").attr("src",'data:image/png;base64,'+  data)
            );
            console.log(data)
          },
          error: function (error) {
            console.log(error);
          },
        });
      }
    }
  }

}

function confirmDeleteRecord(e){
  let parent = $(e).parent().parent().parent()
  
  $('.record-overlay' ,parent).show();
  $('.record-overlay .button-delete' ,parent).click(function(){
    let id = $(e).data("id");
    let key = $(e).data("key");

    console.log(key,id);
    

    $.ajax({
      type: 'GET',
      url: 'https://9nxvzfnhrd.execute-api.us-east-1.amazonaws.com/v1/'+gcommand+'?delete='+id,
      success: function (data) {
        console.log(data)
        $('#list-commands').html('');
        listCommands(gcommand);
        
      },
      error: function (error) {
        console.log(error);
      },
    });


  })

  $('.record-overlay .button-cancel' ,parent).click(function(){
    $('.record-overlay' ,parent).hide();
  })
}

function deleteAll(){
  $.ajax({
    type: 'GET',
    url: 'https://9nxvzfnhrd.execute-api.us-east-1.amazonaws.com/v1/'+gcommand+'?delete=all',
    success: function (data) {
      $('.popup-overlay').hide()
      console.log(data)
      $('#list-commands').html('');
      listCommands(gcommand);
      getMainMap() 
      getSatlog()
      getIMU()
      getGPS();
      getBaseStation();
      getPower();
      getTemp();

      getIR(1);
      getIR(2);
      getIR(3);
      getIR(4);
      getIR(5);
      getIR(6);
    },
    error: function (error) {
      console.log(error);
    },
  });
}

