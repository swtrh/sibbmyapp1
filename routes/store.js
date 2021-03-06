var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var mongoURL = 'mongodb://messagewriter:'+ (process.env.DBPASSWORD || 'empty') + '@ds042898.mongolab.com:42898/sibbsuperduperdb'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('store', { title: 'Express Store', message_url: process.env.MESSAGE_URL });
});

/*
router.route('/message').post(function (req, res, next) {
  console.log('Receiving message ' + req.body.message);
  res.send('Message was ' + req.body.message);   
});

*/
router.route('/message')
.post(function (req, res, next) {
var txtMessage = (req.body.message || 'empty message');
// Storing message in database
MongoClient.connect(mongoURL, function(err, db) {
console.log("Connected to database");

db.collection('messages').insert({'message': txtMessage}, {w: 1 }, function (err, item) {
if (err) {
console.log('Error storing message in database: ' + err);
db.close();
res.status(400).send('Error, unable to store message: ' + txtMessage);
} else {
db.close();
console.log('Message stored ok in database: ' + txtMessage)
res.status(200).send('Message stored: "' + txtMessage + '"');
}
});
});
// End storing message in database
});
 
module.exports = router;
