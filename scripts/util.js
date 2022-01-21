function popup(popup){
    $(popup).fadeIn(100);
    if(popup == '#popup-delete-all'){
      $(popup+ ' span.todelete').text(gcommand);
    }
  }
  
  function parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
  }
  
  function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    //var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    var time = date + ' ' + month;
    return time;
  }
  
  function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }
  
  function randomize() {
    var seed = utils.rand();
    Chart.helpers.each(Chart.instances, function (chart) {
      utils.srand(seed);
  
      chart.data.datasets.forEach(function (dataset) {
        dataset.data = generateData();
      });
  
      chart.update();
    });
  }
  
  hslToRgb = function(_h, s, l) {	
      var h = Math.min(_h, 359)/60;
      
      var c = (1-Math.abs((2*l)-1))*s;
      var x = c*(1-Math.abs((h % 2)-1));
      var m = l - (0.5*c);
      
      var r = m, g = m, b = m;
      
      if (h < 1) {
          r += c, g = +x, b += 0;
      } else if (h < 2) {
          r += x, g += c, b += 0;
      } else if (h < 3) {
          r += 0, g += c, b += x;
      } else if (h < 4) {
          r += 0, g += x, b += c;
      } else if (h < 5) {
          r += x, g += 0, b += c;
      } else if (h < 6) {
          r += c, g += 0, b += x;
      } else {
          r = 0, g = 0, b = 0;
      }
      
      return 'rgb(' + Math.floor(r*255) + ', ' + Math.floor(g*255) + ', ' + Math.floor(b*255) + ')';
  }
  
  createSpectrum = function(length) {
      var colors = [];
      // 270 because we don't want the spectrum to circle back
      var step = 270/length;
      for (var i = 1; i <= length; i++) {
          var color = hslToRgb((i)*step, 0.5, 0.5);
          colors.push(color);
      }
      
      return colors;
  }
  
  const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
  
  function imagedata_to_image(imagedata) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = imagedata.width;
    canvas.height = imagedata.height;
    ctx.putImageData(imagedata, 0, 0);
  
    var image = new Image();
    image.src = canvas.toDataURL();
    return image;
  }
  
  function base64_encode(stringToEncode) { // eslint-disable-line camelcase
    
    var encodeUTF8string = function (str) {
   
      return encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes (match, p1) {
          return String.fromCharCode('0x' + p1)
        })
    }
  
    if (typeof window !== 'undefined') {
      if (typeof window.btoa !== 'undefined') {
        return window.btoa(encodeUTF8string(stringToEncode))
      }
    } else {
      return new Buffer(stringToEncode).toString('base64')
    }
  
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    var o1
    var o2
    var o3
    var h1
    var h2
    var h3
    var h4
    var bits
    var i = 0
    var ac = 0
    var enc = ''
    var tmpArr = []
  
    if (!stringToEncode) {
      return stringToEncode
    }
  
    stringToEncode = encodeUTF8string(stringToEncode)
  
    do {
      // pack three octets into four hexets
      o1 = stringToEncode.charCodeAt(i++)
      o2 = stringToEncode.charCodeAt(i++)
      o3 = stringToEncode.charCodeAt(i++)
  
      bits = o1 << 16 | o2 << 8 | o3
  
      h1 = bits >> 18 & 0x3f
      h2 = bits >> 12 & 0x3f
      h3 = bits >> 6 & 0x3f
      h4 = bits & 0x3f
  
      // use hexets to index into b64, and append result to encoded string
      tmpArr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4)
    } while (i < stringToEncode.length)
  
    enc = tmpArr.join('')
  
    var r = stringToEncode.length % 3
  
    return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3)
  }
  
  function queryStringToJSON(qs) {
    qs = qs || location.search.slice(1);
  
    var pairs = qs.split('&');
    var result = {};
    pairs.forEach(function(p) {
        var pair = p.split('=');
        var key = pair[0];
        var value = decodeURIComponent(pair[1] || '');
  
        if( result[key] ) {
            if( Object.prototype.toString.call( result[key] ) === '[object Array]' ) {
                result[key].push( value );
            } else {
                result[key] = [ result[key], value ];
            }
        } else {
            result[key] = value;
        }
    });
  
    return JSON.parse(JSON.stringify(result));
  };
  
  function toCube(data,side){
    let imap = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let irs = data
    let irss = irs.match(new RegExp('.{1,' + Math.sqrt(irs.length).toFixed(0) + '}', 'g'));
  
    let spectrum = createSpectrum(62)
    let specContent = ''
    for(let s = 0 ; s < 62 ; s++){
      specContent += '<div style="background-color:'+ spectrum[s] +'"></div>'
    }
    let ipixel = ''
    for( let a = 0 ; a < irss.length; a++){
      ipixel += '<div class="irow">'
      for( let b = 0 ; b < irss[a].length; b++){
        
        ipixel += '<div class="ipixel" style="background:'+spectrum[imap.indexOf(irss[a][b])]+'"></div>'
      }
      ipixel += '</div>'
    }
  
  
    $('.irarray-'+side+' .data').html(ipixel);
  
   
      $('.irarray-'+side+' .data .ipixel').css('width',32 / Math.sqrt(irs.length).toFixed(0) + 'px')
      $('.irarray-'+side+' .data .ipixel').css('height',32 / Math.sqrt(irs.length).toFixed(0)+'px')
    
  }