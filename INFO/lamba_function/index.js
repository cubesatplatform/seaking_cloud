const {Pool,Client} = require('pg');
var format = require('pg-format');
const fs = require('fs');

const pool = new Pool({
  user: process.env.RDS_USERNAME,
  host: process.env.RDS_HOSTNAME,
  database: process.env.RDS_DATABASE,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  idleTimeoutMillis: 120000,
  connectionTimeoutMillis: 10000
});

function generateData(data,id){
   let q = ''
    let v = []
    let i = 1
    for(let e in data){
      if(e != id){
        q += `${e}`+'=$'+ i + ',';
        i++
        v.push(data[e])
      } 
    }
    if(data[id]){
      v.push(data[id])
    }
    return {q:q,v:v}
}

exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false; // !important to reuse pool
  console.log(event)
  const client = await pool.connect();
  let data = (event.body)? JSON.parse(event.body) : {} ;
  
  if(event.queryStringParameters){
    for(let elem in event.queryStringParameters){
      data[elem.toLowerCase()] = event.queryStringParameters[elem]
    }
  }
  
  
  if(data.data && (data.data).indexOf('&') != -1){
    let dataArray = data.data.split('&')
    for(let d of dataArray){
      if(d.indexOf('=') != -1){
        let dd = d.split('=')
        data[dd[0].toLowerCase()] = dd[1]
      }else{
        data.data = d
      }
    }
  }
  
  let res ={}
  let query = {text:''}
  
  switch(event.resource){
    case '/satlog' :
      if(event.httpMethod == 'POST' || event.httpMethod == 'GET'){
        
        if(!event.queryStringParameters){
          query.text = 'SELECT * FROM SatLog ORDER BY createdon DESC OFFSET 0 LIMIT 50'
          
        }else if(event.queryStringParameters){
          if(event.queryStringParameters.page){
            let offset = (parseInt(event.queryStringParameters.page) - 1) * 50
            query.text = 'SELECT * FROM SatLog ORDER BY createdon DESC OFFSET $1 LIMIT 50'
            query.values = [offset]  
            
          }else if(event.queryStringParameters.limit){
            query.text = 'SELECT * FROM SatLog ORDER BY createdon DESC LIMIT $1'
            query.values = [event.queryStringParameters.limit]  
            
          }else if(event.queryStringParameters.delete){
            if(event.queryStringParameters.delete == 'all'){
               query.text = 'DELETE FROM SatLog'
            }else{
              data.slid = (event.queryStringParameters.delete)? event.queryStringParameters.delete : data.slid
              query.text = 'DELETE FROM SatLog  WHERE slid=$1 RETURNING *'
              query.values = [data.slid]
            }
            
          }else{
            if(data.slid){
              let gdata = generateData(data,'slid');
              query.text = 'UPDATE SatLog SET ' + gdata.q.slice(0, -1) + ' WHERE slid=$'+gdata.v.length+' RETURNING *'
              query.values = gdata.v
            }else{
              
              query.text = 'INSERT INTO SatLog (bid,data,rssi,id,cid) VALUES($1, $2, $3, $4, $5) RETURNING *'
              query.values = [
                (data.bid)? data.bid : 1, 
                (data.data)? data.data : '', 
                (data.rssi)?data.rssi : '',
                (data.id)? data.id : 1, 
                (data.cid)? data.cid : 1
                ]
            }
          }        
        }
              
      }else if(event.httpMethod == 'DELETE'){
        data.slid = (event.queryStringParameters.delete)? event.queryStringParameters.delete : data.slid
        query.text = 'DELETE FROM SatLog  WHERE slid=$1 RETURNING *'
        query.values = [data.slid]
      }
      
      break;
    case '/commands' :
      if(event.httpMethod == 'POST' ||  event.httpMethod == 'GET'){
       
        if(!event.queryStringParameters){
          query.text = 'SELECT * FROM Commands ORDER BY createdon DESC OFFSET 0 LIMIT 50'
          
        }else if(event.queryStringParameters){
          
          if(event.queryStringParameters.page){  
            let offset = (parseInt(event.queryStringParameters.page) - 1) * 50
            query.text = 'SELECT * FROM Commands ORDER BY createdon DESC OFFSET $1 LIMIT 50'
            query.values = [offset]
            
          }else if(event.queryStringParameters.limit){
            query.text = 'SELECT * FROM Commands ORDER BY createdon DESC LIMIT $1'
            query.values = [event.queryStringParameters.limit]  
            
          }else if(event.queryStringParameters.delete){
            if(event.queryStringParameters.delete == 'all'){
               query.text = 'DELETE FROM Commands'
            }else{
              data.cid = (event.queryStringParameters.delete)? event.queryStringParameters.delete : data.cid
              query.text = 'DELETE FROM Commands  WHERE cid=$1 RETURNING *'
              query.values = [data.cid]
            }
            
          }else{
            if(data.cid){
              let gdata = generateData(data,'cid');    
              query.text = 'UPDATE Commands SET ' + gdata.q.slice(0, -1) + ' WHERE cid=$'+gdata.v.length+' RETURNING *';
              query.values = gdata.v;
                
            }else if(event.queryStringParameters && (event.queryStringParameters.latest && event.queryStringParameters.value)) {
              let ack = data.latest +' = '+ data.value
              query.text = 'SELECT * FROM Commands, cast(extract(epoch from now()) as integer) WHERE '+ ack +' ORDER BY createdon DESC LIMIT 1';
              
              
            }else{
                if((data.data).indexOf('CMD') != -1){
              
                  query.text = 'INSERT INTO Commands (bid,sendon,data,sent,ack) VALUES($1, $2, $3, $4, $5) RETURNING *';
                  query.values = [
                    (data.bid)?data.bid:1, 
                    (data.sendon)?data.sendon : new Date().toISOString(), 
                    (data.data)?data.data :'', 
                    (data.sent)?data.sent : false, 
                    (data.ack)?data.ack : false
                  ]
                }else{
                  
                  let commandError = {
                    "statusCode": 400,
                    headers: {
                      "Access-Control-Allow-Origin" : "*"
                    },
                    "body": JSON.stringify({error:'need CMD in data field'}),
                    "isBase64Encoded": false
                  };
                  callback(null,commandError);
                }
                
                
            }
          }
        } 
          

        
      }else if(event.httpMethod == 'DELETE'){
        data.cid = (event.queryStringParameters.delete)? event.queryStringParameters.delete : data.cid
        query.text = 'DELETE FROM Commands  WHERE cid=$1 RETURNING *'
        query.values = [data.cid]
      }

      break;
    case '/bstation' :
       if(event.httpMethod == 'POST' || event.httpMethod == 'GET'){

        if(!event.queryStringParameters){
          query.text = 'SELECT * FROM BaseStation ORDER BY createdon DESC OFFSET 0 LIMIT 50'
   
        }else if(event.queryStringParameters){

          if(event.queryStringParameters.page){  
            let offset = (parseInt(event.queryStringParameters.page) - 1) * 50
            query.text = 'SELECT * FROM BaseStation ORDER BY createdon DESC OFFSET $1 LIMIT 50'
            query.values = [offset]

          } else if(event.queryStringParameters.limit){
            query.text = 'SELECT * FROM BaseStation ORDER BY createdon DESC LIMIT $1'
            query.values = [event.queryStringParameters.limit]  
            
          }else if(event.queryStringParameters.delete){
            if(event.queryStringParameters.delete == 'all'){
               query.text = 'DELETE FROM BaseStation'
            }else{
              data.bid = (event.queryStringParameters.delete)? event.queryStringParameters.delete : data.bid
              query.text = 'DELETE FROM BaseStation  WHERE bid=$1 RETURNING *'
              query.values = [data.bid]
            }
            
          }else{
            
            if(data.bid){
              let gdata = generateData(data,'bid');         
              query.text = 'UPDATE BaseStation SET ' + gdata.q.slice(0, -1) + ' WHERE bid=$'+gdata.v.length+' RETURNING *'
              query.values = gdata.v
            }else{
              query.text = 'INSERT INTO BaseStation (name,lat,lon,modifiedon,laston,pwd) VALUES($1, $2, $3, $4, $5, $6) RETURNING *'
              query.values = [
                (data.name)?data.name : '', 
                (data.lat)?data.lat : 9999.9999, 
                (data.lon)?data.lon : 9999.9999,
                (data.modifiedon)?data.modifiedon : new Date().toISOString(), 
                (data.laston)?data.laston : new Date().toISOString(), 
                (data.pwd)?data.pwd : ''
              ]
            }
          }  
        }

      }else if(event.httpMethod == 'DELETE' || ((event.httpMethod == 'GET' && event.queryStringParameters) && event.queryStringParameters.delete)){
        data.bid = (event.queryStringParameters.delete)? event.queryStringParameters.delete : data.bid
        query.text = 'DELETE FROM BaseStation  WHERE bid=$1 RETURNING *'
        query.values = [data.bid]
      }

      break;  
    case '/errorlog' :
      if(event.httpMethod == 'POST' || event.httpMethod == 'GET' ){

        if(!event.queryStringParameters){      
          query.text = 'SELECT * FROM ErrorLog ORDER BY createdon DESC OFFSET 0 LIMIT 50'    
        }else if(event.queryStringParameters){

          if(event.queryStringParameters.page){  
            let offset = (parseInt(event.queryStringParameters.page) - 1) * 50
            query.text = 'SELECT * FROM ErrorLog ORDER BY createdon DESC OFFSET $1 LIMIT 50'
            query.values = [offset]
          }else if(event.queryStringParameters.limit){
            query.text = 'SELECT * FROM ErrorLog ORDER BY createdon DESC LIMIT $1'
            query.values = [event.queryStringParameters.limit]  
            
          }else if(event.queryStringParameters.delete){
            if(event.queryStringParameters.delete == 'all'){
               query.text = 'DELETE FROM ErrorLog'
            }else{
              data.elid = (event.queryStringParameters.delete)? event.queryStringParameters.delete : data.elid
              query.text = 'DELETE FROM ErrorLog  WHERE elid=$1 RETURNING *'
              query.values = [data.elid]
            }
            
          }else{
            if(data.elid){           
              let gdata = generateData(data,'elid'); 
              query.text = 'UPDATE ErrorLog SET ' + gdata.q.slice(0, -1) + ' WHERE elid=$'+gdata.v.length+' RETURNING *'
              query.values = gdata.v
            }else{
              query.text = 'INSERT INTO ErrorLog (bid,data) VALUES($1, $2) RETURNING *'
              query.values = [
                (data.bid)? data.bid : 1, 
                (data.data)?data.data : ''
                ]
            }
          }
        }  
         
      }else if(event.httpMethod == 'DELETE' || ((event.httpMethod == 'GET' && event.queryStringParameters) && event.queryStringParameters.delete)){
        data.elid = (event.queryStringParameters.delete)? event.queryStringParameters.delete : data.elid
        query.text = 'DELETE FROM ErrorLog  WHERE elid=$1 RETURNING *'
        query.values = [data.elid]
      }
      
      break;  
      
    case '/imu' :  
      if(event.httpMethod == 'GET'){
        let limit = '';
        if(event.queryStringParameters && event.queryStringParameters.limit){
          limit = 'LIMIT '+ event.queryStringParameters.limit;
        }
        query.text = 'SELECT * FROM IMU  ORDER BY createdon DESC '+ limit
      }
      break;   
    case '/gps' :  
      if(event.httpMethod == 'GET'){
        let limit = '50';
        if(event.queryStringParameters && event.queryStringParameters.limit){
          limit = event.queryStringParameters.limit;
        } 
        query.text = 'SELECT * FROM GPS ORDER BY createdon DESC LIMIT $1'
        query.values = [limit]  
      }
      break; 
    case '/temp' :  
      if(event.httpMethod == 'GET'){
        let limit = '';
        if(event.queryStringParameters && event.queryStringParameters.limit){
          limit = 'LIMIT '+ event.queryStringParameters.limit;
        }
        query.text = 'SELECT * FROM Temp  ORDER BY createdon DESC '+ limit
      }
      break;  
    case '/power' :  
      if(event.httpMethod == 'GET'){
        let limit = '';
        if(event.queryStringParameters && event.queryStringParameters.limit){
          limit = 'LIMIT '+ event.queryStringParameters.limit;
        }
        query.text = 'SELECT * FROM Power  ORDER BY createdon DESC '+ limit
      }
      break;   
    case '/irarray' :  
      if(event.httpMethod == 'GET'){
        let limit = '';
      
        if(event.queryStringParameters && event.queryStringParameters.side){
          query.text = 'SELECT * FROM IRArray WHERE side = '+event.queryStringParameters.side+'  ORDER BY createdon DESC LIMIT 1'
        }else if(event.queryStringParameters && event.queryStringParameters.limit){
          limit = 'LIMIT '+ event.queryStringParameters.limit;
          query.text = 'SELECT * FROM IRArray ORDER BY createdon DESC '+ limit
        }
        
      }
      break; 
    case '/imgcomp' :  
      if(event.httpMethod == 'GET'){
        
        let limit = 'LIMIT 50';
        if(event.queryStringParameters && event.queryStringParameters.limit){
          limit = 'LIMIT '+ event.queryStringParameters.limit;
        }
        query.text = 'SELECT * FROM ImageComponent ORDER BY createdon DESC '+limit
        
      }
      break;
  }
  
 
  try {
   
    res = await client.query(query);
    res = (res.rows)? res.rows : res
    
    let response = {}
    
    if(event.resource == '/imgcomp'){
      response = {
        "statusCode": 200,
        headers: {
          "Access-Control-Allow-Origin" : "*",
          "Content-Type" : "image/png"
        },
        "body": event.queryStringParameters.file,
        "isBase64Encoded": false
      };
      callback(null, response);
    }else if(event.queryStringParameters && event.queryStringParameters.toString == 'true'){
 
      response = {
        "statusCode": 200,
        headers: {
          "Access-Control-Allow-Origin" : "*",
          "Content-Type" : "text/plain"
        },
        "body": JSON.stringify(res.map((a)=> Object.entries(a).map(function([key,value]){return key+':'+value}).join(",")).join(" | ")),
        "isBase64Encoded": false
      };
      callback(null, response);  
    }else{
      response = {
        "statusCode": 200,
        headers: {
          "Access-Control-Allow-Origin" : "*"
        },
        "body": JSON.stringify(res),
        "isBase64Encoded": false
      };
      
    
      
      callback(null, response);
    } 
  } catch(error) {
    
    callback(JSON.stringify(error));
    
  } finally {
    client.release(true);
  }
      
 
};
