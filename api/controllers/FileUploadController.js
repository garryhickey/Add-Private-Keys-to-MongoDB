/**
 * FileUploadController
 *
 * @description :: Server-side logic for managing Fileuploads
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var assert = require('assert');


module.exports = {

uploadFile: function (req, res) {
req.file('privateKeyFile').upload({
},function whenDone(err, uploadedFiles) {
  if (err) return res.negotiate(err);

  else
	var fd = uploadedFiles[0].fd;
	    fs.readFile(fd, 'utf8', function (err, data) {

		var url = 'mongodb://<dbhost>';

		MongoClient.connect(url, function(err, db) {
    	if (err) {
       		 console.log('Sorry unable to connect to MongoDB Error:', err);
   		 } else {
 
        	var collection = db.collection('privateKeys');
  
       		 var customer_key = {
            	user_id: "1234",
            	key: data
  
        	};
 
        
        collection.insertOne(customer_key, { w: 1 }, function(err, records) {
            console.log("Record added :- " + records);
        });
 
        db.close();
        //return res.ok();
    }
		}); 
	});
});

},


downloadFile: function (req, res) {
console.log("we have reached the download file functionality");

MongoClient.connect("mongodb://<dbhost>", function(err, db) {
  assert.equal(null, err);

  db.collection('privateKeys').findOne({user_id : "1234" }, function (err, document) {
    assert.equal(null, err);


    console.log(document.key);

    res.set('Content-Type', 'text/html');
    res.send(new Buffer(document.key));
    

    db.close();
    
  });

});

}

};



