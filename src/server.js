// use the express library
const express = require('express');

// create a new server application
const app = express();


const cookieParser = require('cookie-parser');
app.use(cookieParser());
// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;

const {encode} = require('html-entities');


// The main page of our website
// ... snipped out code ...

let nextVisitorId = 1;
var visitSince = -1;
var vistedText;



app.get('/', (req, res) => {
  let newdate = new Date();
  if(req.cookies != undefined && req.cookies['visited'] != undefined){
    let olddate = new Date(req.cookies['visited']);
    visitSince = Math.floor((newdate.getTime() - olddate.getTime()) / 1000);
    vistedText = `It has been ${visitSince} seconds since your last visit`;
  } else {
    vistedText = 'you have never visited';
  }
  res.cookie('visitorId', nextVisitorId++);
  res.cookie('visited', newdate);

  res.render('welcome', {
    name: req.query.name || "World",
    localDateTime: new Date(req.cookies['visited']).toLocaleString('en-US')|| new Date().toLocaleString(),
    visitorIdValue: req.cookies['visitorId'] || nextVisitorId,
    visitSince: vistedText || 'you have never visited',
  });
//  res.cookie('visited', Date.now().toString());
console.log("cookies:",req.cookies);
});




// Start listening for network connections
app.listen(port);

app.use(express.static('public'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// Printout for readability
console.log("Server Started!");
