require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const multer = require('multer');
const morgan = require('morgan');
const fileUpload = require("express-fileupload");

const adminData = require('./routes/admin');
const customerRoutes = require('./routes/customers');
const productController = require('./controllers/productController');
const database = require('./util/database');
const User = require('./models/user');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded( {extended: true} ))
app.use(bodyParser.json())
app.use(express.json())
app.use(fileUpload());
app.use("/uploads", express.static("./uploads"));
app.use("/UserAuth",(req, res, next) => {
    console.log("User:")
    console.log(req.body);
    User.findById(req.body.userId)
      .then((user) => {
        console.log(user);
        req.body.user = user;
        console.log("USERAUTH: ",req.body);
        next();
      })
      .catch((error) => {
        console.log(error);
      });
})
app.use('/admin', adminData.routes);

app.use(customerRoutes);

app.use(productController.getErrorPage);


const port = process.env.port || 8000;

mongoose
  .connect(
    `mongodb+srv://DeepeshDragoneel:${process.env.DB_PASS}@deepeshdragoneel.prwnu.mongodb.net/EMarting?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    }
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        console.log("Creating User!");
        const userModel = new User({
          username: "Deepesh Dragoneel",
          email: "deepeshash444@gmail.com",
          password: "deepesh",
          cart: {
            items: [],
          },
        });
        userModel.save();
      }
    });
    app.listen(port, (e) => {
      if (e) {
        console.log(e);
      } else {
        console.log("CONNECTION TO EXPRESS ESTABLISHED");
      }
    });
  })
  .catch((error) => {
    console.log(error);
  });

/* database.mongoConnect(()=>{
    app.listen(port, (e)=>{
        if(e){
            console.log(e);
        }
        else{
            console.log("CONNECTION TO EXPRESS ESTABLISHED");
        }
    })
}) */
