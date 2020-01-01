const run = (req, res) => {
    
    const action = req.body.action;
    let messageBody = {
        message: "",
        buttonLink: "",
        buttonText: "",
    };
 
    res.render("message.ejs", messageBody);
    res.end();

};

module.exports = run;