function getIMU(){
    $.ajax({
      type: 'GET',
      url: 'https://9nxvzfnhrd.execute-api.us-east-1.amazonaws.com/v1/imu?limit=30 ',
      success: function (data) {
        gyroChartData = []
        rotChartData = []
        magChartData = []
  
        let index = 1
        for (let e of data){
          if(
            e.gyrox != 9999.9999 ||
            e.gyroy != 9999.9999 ||
            e.gyroz != 9999.9999 ||
            e.rotx != 9999.9999 ||
            e.roty != 9999.9999 ||
            e.rotz != 9999.9999 ||
            e.magx != 9999.9999 ||
            e.magy != 9999.9999 ||
            e.magz != 9999.9999 ){
  
            let g = {
              "label": index,
              "gyrox":e.gyrox,
              "gyroy":e.gyroy,
              "gyroz":e.gyroz,
              "gyroaccu":e.gyroaccu
            }
            gyroChartData.push(g)
  
            let r = {
              "label": index,
              "rotx":e.rotx,
              "roty":e.roty,
              "rotz":e.rotz,
              "rotaccu":e.rotaccu
            }
            rotChartData.push(r)
  
            let m = {
              "label": index,
              "magx":e.magx,
              "magy":e.magy,
              "magz":e.magz,
              "magaccu":e.magaccu
            }
            magChartData.push(m)
  
            let q = {
              "label": index,
              "quatx":e.quatx,
              "quaty":e.quaty,
              "quatz":e.quatz,
              "quataccu":e.quataccu
            }
            quatChartData.push(q)
  
  
            let a = {
              "label": index,
              "accx":e.accx,
              "accy":e.accy,
              "accz":e.accz,
              "accu":e.accu
            }
            accChartData.push(a)
  
            let l = {
              "label": index,
              "laccx":e.laccx,
              "laccy":e.laccy,
              "laccz":e.laccz,
              "linaccu":e.linaccu
            }
            laccChartData.push(l)
  
  
            let rpy = {
              "label": index,
              "roll":e.roll,
              "pitch":e.pitch,
              "yaw":e.yaw,
              
            }
            rpyChartData.push(rpy)
            
            index++
          }
        }
  
        reloadChart();
        // chart1.data = gyroChartData;
      },
      error: function (error) {
        console.log(error);
      },
    });
   
  }