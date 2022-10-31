const fetch = require('node-fetch');

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




app.get("/trivia", async (req, res) => {
  // fetch the data
  const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");

  // fail if bad response
  if (!response.ok) {
    res.status(500);
    res.send(`Open Trivia Database failed with HTTP code ${response.status}`);
    return;
  }

  // interpret the body as json
  const content = await response.json();

  // fail if db failed
  if (content.response_code !== 0) {
    res.status(500);
    res.send(`Open Trivia Database failed with internal response code ${response.response_code}`);
    return;
  }
  
  const category =  content.results[0].category;
  const difficulty =  content.results[0].difficulty;
  const question = content.results[0].question;
  const correct_answer = content.results[0].correct_answer;
  const incorrect_answers = content.results[0].incorrect_answers;


  res.render('trivia', {
    category: category,
    difficulty: difficulty,
    question: question,
    correctanswer: correct_answer,
    answers: shuffle(options),
   
  });

});


function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

// Start listening for network connections
app.listen(port);

app.use(express.static('public'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// Printout for readability
console.log("Server Started!");
