const { check, validationResult } = require("express-validator");

exports.userSignInValidatorFunc = (req, res, next) => {
    let email = req.body.data.email;
    let username = req.body.data.username;
    let pass = req.body.data.pass;
    console.log(`${email} ${username} ${pass}`);
    const result = validationResult(req);
    console.log(req.body.data);
    console.log(result);
    if (!result.isEmpty()) {
        const error = result.errors[0].msg;
        return res.status(422).json({success: "Error", error: error})
    }
    next();
}

exports.userSignInValidator = [
    check("username")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Enter a UserName")
        .isLength({ min: 4 })
        .withMessage("UserName must Contain more than 4 Character's"),
    check("email")
        .trim()
        .isEmpty()
        .withMessage("Enter an Email-Id")
        .isEmail()
        .withMessage("Enter a Valid Email!"),
    check("pass")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Enter a PassWord")
        .not()
        .isLength({ min: 8 })
        .withMessage("UserName must Contain more than 5 Character's"),
];
