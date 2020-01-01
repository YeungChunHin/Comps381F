const assert = require("assert");

const run = (req, res) => {
	
	res.render("leafMap.ejs", {
		lat:req.query.lat,
		lon:req.query.lon,
				
	});



	res.end();
	
};
 

module.exports = run;
