const assert = require("assert");
const MongoClient = require("mongodb").MongoClient;
const fs = require("fs"); //require file system
const formidable = require("formidable");
var ExifImage = require('exif').ExifImage

const run = (req, res) => {

	const dbLink = "mongodb+srv://hin:Aa147896325@cluster0-1ljrx.mongodb.net/test?retryWrites=true&w=majority";

	const dbName = "test";
	const client = new MongoClient(dbLink);

	let form = new formidable.IncomingForm();
    const DataofExif ={};
    let photoField = {};
    let directionOfLat="";
    let directionOfLon="";

	const insertPhoto = (db, photoField, callback) => {
		db.collection("EXAM").insertOne(photoField, (err, result) => {
			assert.equal(err, null);

			console.log("insert was successful!");
			console.log(JSON.stringify(result));
			callback();
		});
	}

	// const getPhotoId= (db, callback) => {
	// 	db.collection("EXAM").count((error, result) => {
	// 		assert.equal(error, null);
	// 		callback(result);
	// 	})
    // }

	form.parse(req, (err, fields, files) => {
		assert.equal(err, null);
		console.log("Fields", fields);
		let photo = files.photo;
		console.log(photo);
		let filename = photo.path;
		if (photo.size === 0) {
			console.log("No file");
			res.render("message.ejs", {
				message: "No file uploaded!",
				buttonLink: "Back",
				buttonText: "Back"
			});
			res.end();
			return;
		}
       
		if (photo.type) {
			//check upload file is image
			if (!photo.type.match(/^image/)) {
				res.render("message.ejs", {
					message: "Upload file is not image!",
					buttonLink: "Back",
					buttonText: "Back"
				});
				res.end();
				return;
			}
			photoField["photo_mimetype"] = photo.type;
		}
    
		fs.readFile(filename, (err, data) => {
			assert.equal(err, null);
			photoField["photo"] = new Buffer.from(data).toString("base64");
          
			client.connect((err) => {

				try {
                    assert.equal(err, null);
                    
				} catch (err) {
					res.render("message.ejs", {
						message: "MongoClient connect() failed!",
						buttonLink: "Back",
						buttonText: "Back"
					});
                    res.end();
                
					return;
				}
               
                try {
               
                    new ExifImage({ image:filename }, function (error, exifData) {
                        if (error){
                            console.log('Error: '+error.message);
                        }
                        else{
                            
                            console.log("abcdefghijk");
                          
                   
                            const db = client.db(dbName);
                            console.log("xxxxxxxxxxxxxxxxxx")
                            console.log(exifData);
                            
                            photoField["title"] = fields.title;
                            photoField["description"] = fields.description;
                            photoField["make"] = exifData.image.Make;
                            photoField["model"] = exifData.image.Model;
                            photoField['date'] = exifData.exif.CreateDate;
                            photoField['lat'] = exifData.gps.GPSLatitude;
                            photoField['lon'] = exifData.gps.GPSLongitude;
                            
                            console.log(photoField['lat']);
                            console.log(photoField['lon']);


                            directionOfLat = exifData.gps.GPSLatitudeRef;
                            directionOfLon = exifData.gps.GPSLongitudeRef;

                            photoField['lat'] = (parseFloat(photoField['lat'][0]) + ((photoField['lat'][1])/60.00) + ((photoField['lat'][2])/3600.00));
                            photoField['lon'] = (parseFloat(photoField['lon'][0]) + ((photoField['lon'][1])/60.00) + ((photoField['lon'][2])/3600.00));


                            if(directionOfLat == 'W' || directionOfLat == 'S'){

                                photoField['lat'] = - photoField['lat'];
                            }
                            console.log(photoField['lat'][0]);
                            
                            if(directionOfLon == 'W' || directionOfLon == 'S'){

                                photoField['lot']= - photoField['lot'];
                            }


                            
                            insertPhoto(db, photoField, () => {
                                res.render("displayItem.ejs", {
                                 title : photoField["title"],
                                 description : photoField["description"],
                                 make : photoField["make"],
                                 model : photoField["model"],
                                 date : photoField["date"],
                                 photo : photoField["photo"],
                                 mimetype : photoField["photo_mimetype"],
                                 showMap : "/gmap?lat="+photoField['lat']+"&lon="+photoField['lon']

                                });
                                res.end();
                                client.close();
            
                            });
                          

                        }
                    });
                } catch (error) {
                    console.log("hihi");
                    console.log('Error: ' + error.message);
                }

  
				
			})
		});

	});

}


module.exports = run;
