const fs = require('fs');
module.exports = (req, res, next) => {
    console.log("validator");
    console.log(req.body);
    console.log(req.file);
    console.log("validator");
    if(typeof(req.body.file) === undefined ||typeof(req.body) === undefined){
        return res.status(400).send({
            errors: "ERROR WHILE SENDING DATA"
        })
    }
    //console.log(req.file);
    console.log(req.body);
    console.log(req.file);
    let name = req.body.title;
    let image = req.file.path;

    if(!(req.file.mimetype).includes('jpeg')&&!(req.file.mimetype).includes('png')&&!(req.file.mimetype).includes('jpg')){
        fs.unlinkSync(image);
        return res.json({
            errors: "FILE TYPE NOT SUPPORTED"
        })
    }

    //size 5mb
    if(req.file.size > (1024*1024*5)){
        fs.unlinkSync(image);
        return res.json({
            errors: "FILE SIZE MUST BE LESS THAN 5MB",
        });
    }

    if(!name || !image){
        return res.json({
            erros: "PLEASE INSERT THE IMAGE"
        })
    }

    next();
}