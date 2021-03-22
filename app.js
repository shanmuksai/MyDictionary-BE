const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const port = 3000;
const helmet = require('helmet');
// Declare variables
var fs = require('fs'),
    obj

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', "*");
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
	next();
});

//pre-flight requests
app.options('*', function(req, res) {
	res.send(200);
});

server.listen(port, (err) => {
	if (err) {
		throw err;
	}
	/* eslint-disable no-console */
	console.log('Node Endpoints working :)');
});
app.route('/book')
  .get(function (req, res) {
    res.send('Get a random book')
  })
  app.post('/search', function (req, res) {
    try {
// Read the file and send to the callback
let request = req.body;
let word = request['word'].toUpperCase(); 

let fileName = `D${word[0].toUpperCase()}.json`

fs.readFile(`Data/${fileName}`, function (err, data) {
    if (err)  throw err;
    let jsonData = JSON.parse(data.toString());
    var recentData = fs.readFileSync('recentSearch/recentSearch.json');
    var recentJson = JSON.parse(recentData);
    let recent = recentJson.recent; 
    recent.push(word);
    recentJson.recent = recent;
    fs.writeFileSync('recentSearch/recentSearch.json', JSON.stringify(recentJson, null, 2));
    if(jsonData.hasOwnProperty(word)){
        let response ={'response':jsonData[word]};
        res.json(response);
    }else{
        let response = {'response':{"Message":"Word not present in dictionary"}};
        res.json(response);
    }

})
        
    } catch (e) {
        res.status(500).send(e.toString());
    }
  })
 
  app.post('/addbookmark', function (req, res) {
    try {
let request = req.body;
let word = request['word'].toUpperCase(); 

var data = fs.readFileSync('bookmarkData/bookmark.json');
var json = JSON.parse(data);
let bookmarks = json.bookmarks; 
let bookmark = bookmarks.find(x=>x === word);
 if(bookmark === undefined || bookmark === null){
bookmarks.push(word);
json.bookmarks = bookmarks;
fs.writeFileSync('bookmarkData/bookmark.json', JSON.stringify(json, null, 2));
 }
  res.send({"message":"done"});
    } catch (e) {
        res.status(500).send(e.toString());
    }
  })
  app.route('/getbookmark')
  .get(function (req, res) {
    var data = fs.readFileSync('bookmarkData/bookmark.json');
    var json = JSON.parse(data);
    res.json(json);
  })
  app.route('/getrecent')
  .get(function (req, res) {
    var data = fs.readFileSync('recentSearch/recentSearch.json');
    var json = JSON.parse(data);
    res.json(json);
  })

module.exports = server;