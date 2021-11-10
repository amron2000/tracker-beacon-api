const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
var multer = require('multer');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "sql6.freesqldatabase.com",
  user: "sql6450233",
  password: "uPXhdJH1q1",
  database: "sql6450233"
});


const forms = multer();
const app = express();
const port = process.env.PORT || 3000;

app.use('/demo', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(forms.array()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Nothing much here!')
})


app.post('/log-tracking', function(req, res) {
    console.log('**** Tracked. Now logging ****');
    let body = req.body;

    let startTime = body.start;
    let endTime = body.end;
    let trackInfo = body.msg;


    let time = (endTime - startTime) / 1000;
    logMsg = `${time.toFixed(2)} seconds`;

    if (time > 60) {
        time = time / 60;
        logMsg = `${time.toFixed(2)} minutes`;
    }

    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
    
    console.log('URL: ', fullUrl);
    console.log('In Session for: ', logMsg);
    console.log('Tracking info: ', trackInfo);


require('dns').lookup(require('os').hostname(), function (err, ip, fam) {
  console.log('ip address: ' + ip); //getting the ip address

  var pool  = mysql.createPool({
    connectionLimit : 10,
    host: "sql6.freesqldatabase.com",
  user: "sql6450233",
  password: "uPXhdJH1q1",
  database: "sql6450233"
  });

  pool.getConnection(function(err,con) {
    if (err) throw err;
    console.log("Connected!");
    let currentDate =  new Date().toLocaleString();
    var sql = "INSERT INTO trackinginfo (time,ip,url) VALUES ?";
    var VALUES = [[currentDate,ip,fullUrl]];
    con.query(sql, [VALUES],function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
      con.release();
    });
  });
});


    
});

app.listen(port, () => {
  console.log(`User Tracking app listening at http://localhost:${port}`)
})




