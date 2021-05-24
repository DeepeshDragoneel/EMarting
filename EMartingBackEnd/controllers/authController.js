const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.checkAuthorization = async(req,res,next) => {
    try{
        console.log("In auth: ",req.body);
        const token = req.body.token;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);
        res.json(verifyUser);
    }
    catch(error){
        res.send("ERROR");
    }
}

exports.postSignUp = async(req, res, next) => {
    console.log(req.body.data);
    try{
        const existingUserName = await User.findOne({username: req.body.data.username.trim()})
        const existingEmailName = await User.findOne({
          email: req.body.data.email.trim(),
        });
        //console.log(existingUserName);
        if(existingUserName) {
          console.log(" post Username is already taken");
          res.send("res Username is already taken");
        }
        //console.log(existingUserName);
        else if (existingEmailName) {
          console.log(" post Username is already taken");
          res.send("res email is already taken");
        }
        else{
            console.log(req.body.data.pass);
            const user = new User({
              username: req.body.data.username.trim(),
              email: req.body.data.email.trim(),
              password: req.body.data.pass.trim(),
            });
            console.log("this preSave: ", user);
            user.password = await bcrypt.hash(user.password, 10);
            console.log("this.password: ", user.password);
            const token = await user.authTokenGeneration();
            console.log("user SingedUp with Token: ",token);
            /* localStorage.setItem("JWT", token); */
            await user.save();
            console.log("SENDING EMAIL TO: ",user.email);
            transporter.sendMail({
              to: user.email,
              from: "deepeshash444@gmail.com",
              subject: "SignUp Successfull",
              html:
                "<div><h1>SignUp successfull <br/>Happy shopping</h1><br/><br/><br/><hr/>EMarting</div>"
            }).then((res)=>{
                console.log(res);
            }).catch(error=>console.log(error));
            res.json({
              token: token,
              username: req.body.data.username.trim()
            });
        }
    }
    catch(error){
        console.log(error);
    }
    /* const user = new User({
        username: req.body.data.username,
        email: req.body.data.email,
        password: req.body.data.pass
    })
    user.save(); */
    res.status(202).send("GOT USER DATA");
}

exports.postLogin = async (req, res, next) => {
    try{
        const user = await User.findOne({email: req.body.data.email});
        console.log(user);
        console.log(req.body);
        if(user){
            const passMatch = await bcrypt.compare(req.body.data.pass, user.password);
            console.log(passMatch);
            if(passMatch){
                const token = await user.authTokenGeneration();
                console.log("User LoggedIn with Token: ", token);
                res.json({
                  code: "SUCCESS",
                  token: token,
                  username: user.username
                });
            }
            else{
                res.json({
                  code: "ERROR"
                });
            }
        }
        else{
            res.json({
              code: "ERROR",
            });
        }
    }
    catch(error){
        console.log(error);
    }
}

exports.removeAuthorization = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        const newTokens = user.tokens.filter((t) => t.token !== req.body.token);
        user.tokens = newTokens;
        user.save();
        res.send(`User ${req.params.id} Token ${req.body.token} is removed`);
    }
    catch (error) {
        res.send("ERROR REMOVING USER");
        console.log(error);
    }
}