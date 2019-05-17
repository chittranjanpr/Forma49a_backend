const express = require('express');
const app = express();
var cors = require('cors');
const Nexmo = require('nexmo');
const path = require('path');
const SendOtp = require('sendotp');
var bodyParser = require('body-parser')
const otplib =  require('otplib');

const port =  5000;  

// const sendOtp = new SendOtp('264127AxbfOOWBw5c6e7137');
const sendOtp = new SendOtp('268396AyieLKmkg5c90eb1f');
// app.listen(5000)

app.use(express.static(path.join(__dirname, "public")));

app.get('/ping', function (req, res) {
  console.log("asdfghjkl;")
  res.send('pong')
}) 

// React Path Public
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

var MongoClient = require('mongodb').MongoClient;

// const port = process.env. PORT || 5000;  

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

var url = "mongodb://localhost:27017/";

global.myotp = "" ;
global.phno = "";

app.post('/checkphonenumber', (req, res) => {
  var count = 0;
    const alldata = req.body;
    console.log(alldata.phonenumber)
  
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("panform");
      //Find the first document in the customers collection:
      dbo.collection("formtable").findOne({id : `${alldata.phonenumber}`}, function(err, result) {
        if (err) throw console.log("error",err);
         console.log("error11",result);
  
        if(result == null )
        {
         console.log("data null fouund")
         res.json(
          "Nulldata"
        )
        }
        else{
          console.log("data  fouund")
          const secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD'
          const token = otplib.authenticator.generate(secret);
          sendOtp.send(`91${alldata.phonenumber}`, "PRIIND", `${token}`, function (error, data) {
            console.log(data);
          });

          res.json(
          {
            token,result
          }  

          )
        }
         
        db.close();
      });
    });
  
  })


app.post('/saveData', (req, res) => {
var count = 0;
  const alldata = req.body;
  console.log(alldata.phonenumber)

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("panform");
    //Find the first document in the customers collection:
    dbo.collection("formtable").findOne({id : `${alldata.phonenumber}`}, function(err, result) {
      if (err) throw console.log("error",err);
       console.log("error11",result);

      if(result == null )
      {
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("panform");
          var myobj = {id :  alldata.phonenumber, alldata  };
          dbo.collection("formtable").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
          });
        });
      }
      else{
        count = 1;
      }
      
      if(count == 1)
      {
          MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("panform");
            var myquery = { id : `${global.phno}` };
            var newvalues = { $set: {alldata } };
            dbo.collection("formtable").updateOne(myquery, newvalues, function(err, res) {
              if (err) throw err;
              console.log("1 document updated");
              db.close();
            });
          });
          count=0;
      }

      db.close();
    });
  });

})

  app.post('/sendnumber', (req, res) => {
    res.json(
      "verified"
    )
    alldata = req.body;
    console.log("phone number",alldata.phonenumber)
    global.phno = alldata.phonenumber

    const secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD'
    // Alternatively: const secret = otplib.authenticator.generateSecret();
    const token = otplib.authenticator.generate(secret);
    
    global.myopt = token;
    console.log("data",myopt)
    console.log("global data",global.myopt)
    // const accountSid = 'AC6ac3c01907e59f108e0bdf3fbf5ec5e8';
    // const authToken = '9293070191b4a6b103c273c2150452b1';
    // const client = require('twilio')(accountSid, authToken);

    // client.messages
    //   .create({
    //     body: 'The OTP is' + token,
    //     from: '+12024996362',
    //     to: "+91" + alldata.phonenumber,
    //     // to: "+919566612348",
    //   })
    //   .then(message => console.log(message.sid))
    // .done();

    // const nexmo = new Nexmo({
    //   apiKey: 'baffada5',
    //   apiSecret: 'EHohk1kAn7RdMfeR'
    // })
    // const from = 'Nexmo'
    // const to = '919566612348' 
    // const text = 'The OTP is' + token
    // nexmo.message.sendSms(from, to, text)
    sendOtp.send(`91${alldata.phonenumber}`, "PRIIND", `${token}`, function (error, data) {
      console.log(data);
    });

    alldata.phonenumber = "";

      })



  app.get('/sendmsg', (req, res) => {
    console.log(global.myopt)
    res.send(global.myopt)
 
    });


  // app.post('/updateData', (req, res) => {
  //   const alldata = req.body.data;
  //   console.log(alldata)
  // MongoClient.connect(url, function(err, db) {
  //   if (err) throw err;
  //   var dbo = db.db("invoicedb");
  //   var myquery = { id : "1" };
  //   var newvalues = { $set: {alldata } };
  //   dbo.collection("invoicedata").updateOne(myquery, newvalues, function(err, res) {
  //     if (err) throw err;
  //     console.log("1 document updated");
  //     db.close();
  //   });
  // });

  // })

  app.get('/viewData', (req, res) => {
    console.log("phno",global.phno)
    console.log("otp...",global.myopt)

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("panform");
      //Find the first document in the customers collection:
      dbo.collection("formtable").findOne({id : `${global.phno}`}, function(err, result) {
        if (err) throw err;
        res.json(
          result
        )
        console.log("results",result);
        db.close();
      });
    });
  })

app.listen(port, () => console.log(`server running on port:${port}`))

 



// // const accountSid = 'AC6ac3c01907e59f108e0bdf3fbf5ec5e8';
// // const authToken = '9293070191b4a6b103c273c2150452b1';
// // const client = require('twilio')(accountSid, authToken);

// // client.messages
// //   .create({
// //      body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
// //      from: '+12024996362',
// //      to: '+919566612348'
// //    })
// //   .then(message => console.log(message.sid))
// // .done();



// // const otplib =  require('otplib');
// // const secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD'
// // // Alternatively: const secret = otplib.authenticator.generateSecret();
// // const token = otplib.authenticator.generate(secret);
// // console.log("data",token)
// // const isValid = otplib.authenticator.check(token, secret);
// // // or
// // const isValid = otplib.authenticator.verify({ token, secret })