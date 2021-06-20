const User = require("../models/user");
const UserGoogle = require("../models/userGoogle");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const sgMail = require("@sendgrid/mail");
const validator = require("validator");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const transporter = nodemailer.createTransport(
    sendGridTransport({
        auth: {
            api_key: process.env.SENDGRID_API,
        },
    })
);

sgMail.setApiKey(process.env.SENDGRID_API);

exports.checkAuthorization = async (req, res, next) => {
    try {
        const token = req.body.token;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        
        // console.log("In auth: ", req.body);
        // console.log("Verify user: ", verifyUser);
        let user;
        if (verifyUser.googleId != undefined) {
            user = await UserGoogle.findOne({
                email: verifyUser.email,
            });
        }
        else {
            user = await User.findOne({
                email: verifyUser.email,
            });
        }
        // console.log(user);
        res.json(user);

    } catch (error) {
        res.send("ERROR");
    }
};

exports.postGoogleLoginIn = async (req, res, next) => {
    try {
        // console.log(req.body.data.tokenId);
        const ticket = await client.verifyIdToken({
            idToken: req.body.data.tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        // console.log(payload);
        const userGoogle = await UserGoogle.findOne({ username: payload.name });
        if (userGoogle === null || userGoogle === undefined) {
            console.log("USER DOESN'T EXIST!");
            res.send("error");
            return;
        }
        console.log("userGoogle: ",userGoogle);
        const token = jwt.sign(
            {
                userid: userGoogle._id.toString(),
                email: userGoogle.email.toString(),
                username: userGoogle.username.toString(),
                googleId: userGoogle.googleId.toString(),
            },
            process.env.SECRET_KEY
        );
        const googleToken = jwt.verify(token, process.env.SECRET_KEY);
        console.log("------------------------------");
        console.log("Google User logged in (ID): ", googleToken.userid);
        console.log("------------------------------");
        userGoogle.tokens.push({
            token: token,
        });
        await userGoogle.save();
        res.json({
            username: userGoogle.username,
            token: token,
        });
    } catch (error) {
        console.log(error);
        res.send("error");
    }
}

exports.postGoogleSignUp = async (req, res, next) => {
    try {
        // console.log(req.body.data.tokenId);
        const ticket = await client.verifyIdToken({
            idToken: req.body.data.tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        console.log(payload);
        const ug = await UserGoogle.findOne({ username: payload.name });
        console.log("userGoogle: ", ug);
        if (ug !== null) {
            console.log("USER ALREADY EXISTS!");
            res.send("error");
            return;
        }
        const userGoogle = new UserGoogle({
            username: payload.name.toString(),
            email: payload.email.toString(),
            googleId: req.body.data.profileObj.googleId.toString(),
        });
        const token = jwt.sign(
            {
                userid: userGoogle._id.toString(),
                email: req.body.data.profileObj.email.toString(),
                username: req.body.data.profileObj.name.toString(),
                googleId: req.body.data.profileObj.googleId.toString(),
            },
            process.env.SECRET_KEY
        );
        const tokenUser = await jwt.verify(token, process.env.SECRET_KEY);
        console.log("------------------------------")
        console.log("USER SIGNED IN AS (ID): ", tokenUser.userid);
        console.log("------------------------------")
        userGoogle.tokens.push({
            token: token,
        });
        console.log(userGoogle);
        await userGoogle.save();
        res.json({
            username: userGoogle.username,
            token: token
        });

    }
    catch (error) {
        console.log(error);
        res.send("error");
    }
};

exports.postSignUp = async (req, res, next) => {
    console.log(req.body.data);
    try {
        let { email, username, pass } = req.body.data;
        email = email.trim();
        username = username.trim();
        pass = pass.trim();
        if (!validator.isEmail(email)) {
            console.log("Enter a valid Email!");
            return res.send({ status: "error", error: "Enter a valid Email!" });
        }
        if (username.length < 4) {
            console.log("UserName must be atleast 4 character's long!");
            return res.status(200).send({
                status: "error",
                error: "UserName must be atleast 4 character's long!",
            });
        }
        if (pass.length < 4) {
            console.log("Password must be atleast 4 character's long!");
            return res.status(200).send({
                status: "error",
                error: "Password must be atleast 4 character's long!",
            });
        }
        const existingUserName = await User.findOne({
            username: req.body.data.username.trim(),
        });
        const existingEmailName = await User.findOne({
            email: req.body.data.email.trim(),
        });
        //console.log(existingUserName);
        if (existingUserName) {
            console.log(" post Username is already taken");
            res.send("res Username is already taken");
        }
        //console.log(existingUserName);
        else if (existingEmailName) {
            console.log(" post Username is already taken");
            res.send("res email is already taken");
        } else {
            console.log(req.body.data.pass);
            const userToken = jwt.sign(
                {
                    email: req.body.data.email.trim().toString(),
                    username: req.body.data.username.trim().toString(),
                    password: req.body.data.pass.trim().toString(),
                },
                process.env.SECRET_KEY
            );
            console.log("SENDING EMAIL TO: ", req.body.data.email.trim());
            try {
                const res = await sgMail.send({
                    to: req.body.data.email.trim(),
                    from: "emarting248@gmail.com",
                    subject: "Verify your account!",
                    html: `<div><h1>Please Verify you Account!</h1><p>Click the Below link to verify your account</p><br/><br/><br/><a href=http://${process.env.Baseurl}/auth/verifySignUp/${userToken}>Verifiy Your Email</a></div>`,
                });
                console.log("Email res: ", res);
            } catch (error) {
                console.log(error);
            }
            res.json({
                token: userToken,
                username: req.body.data.username.trim(),
            });
        }
    } catch (error) {
        console.log(error);
    }
    /* const user = new User({
        username: req.body.data.username,
        email: req.body.data.email,
        password: req.body.data.pass
    })
    user.save(); */
    res.status(202).send("GOT USER DATA");
};

exports.verifySignUp = async (req, res, next) => {
    console.log("VERIFING USER!");
    console.log(req.params.token);
    const verify = jwt.verify(req.params.token, process.env.SECRET_KEY);
    const { email, password, username } = verify;
    console.log(`${email} ${password} ${username}`);
    console.log(verify);
    if (verify) {
        try {
            const user = new User({
                username: username.trim(),
                email: email.trim(),
                password: password.trim(),
            });
            console.log("this preSave: ", user);
            user.password = await bcrypt.hash(user.password, 10);
            console.log("this.password: ", user.password);
            const token = await user.authTokenGeneration();
            const userToken = await jwt.verify(token, process.env.SECRET_KEY);
            console.log("user SingedUp with ID: ", userToken.userid);
            await user.save();
            res.send(
                `<div><a href=${BASE_URL}login>Login with you Credentials!</a></div>`
            );
        }
        catch(error){
            console.log(error);
        }
    } else {
        res.send("<h1>Error!</h1>");
    }
};

exports.verifedSingUp = (req, res, next) => {
    res.send(`<div><a href=${REACT_APP_BASE_URL}login>Login with you Credentials!</a></div>`);
};

exports.postLogin = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.data.email });
        console.log(user);
        console.log(req.body);
        if (user) {
            const passMatch = await bcrypt.compare(
                req.body.data.pass,
                user.password
            );
            console.log(passMatch);
            if (passMatch) {
                const token = await user.authTokenGeneration();
                console.log("User LoggedIn with Token: ", token);
                res.json({
                    code: "SUCCESS",
                    token: token,
                    username: user.username,
                });
            } else {
                res.json({
                    code: "ERROR",
                });
            }
        } else {
            res.json({
                code: "ERROR",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

exports.removeAuthorization = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        const newTokens = user.tokens.filter((t) => t.token !== req.body.token);
        user.tokens = newTokens;
        user.save();
        res.send(`User ${req.params.id} Token ${req.body.token} is removed`);
    } catch (error) {
        res.send("ERROR REMOVING USER");
        console.log(error);
    }
};
