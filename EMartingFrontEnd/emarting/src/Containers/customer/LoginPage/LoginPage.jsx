import React, { useState } from 'react';
import './LoginPage.scss';
import loginBackGround from '../../../assets/loginBackGround.jpg';
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios';
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

const useStyles = makeStyles({
  button: {
    backgroundColor: "#ffb4b4",
    padding: "0.5rem 1.5rem",
    color: "black",
    margin: "3rem 0rem 0rem",
  },
});

const LoginPage = (props) => {
  const [showPass, setshowPass] = useState(false);
    const [errors, seterrors] = useState("");
    const [userInfo, setuserInfo] = useState({
        email: "",
        pass: ""
    });

    const inputFormHandler = (event) => {
        if(event.target.name == "email"){
            setuserInfo({
                ...userInfo,
                email: event.target.value
            })
        }
        else{
            setuserInfo({
                ...userInfo,
                pass: event.target.value
            })
        }
        console.log(userInfo);
    }
    
    const submitLoginDetails = async() => {
        try{
            const result = await axios({
                method: "POST",
                url: "http://localhost:8000/auth/login",
                headers: {
                    "content-type": "application/json",
                    accept: "application/json",
                },
                data: JSON.stringify({ data: userInfo }),
            }); 
            console.log(result);
            if(result.data.code == "ERROR"){
              seterrors("INVALID CREDENTIALS!");
            }
            else{
              seterrors("");
            }
            if(result.data.code=="SUCCESS"){
              console.log("SETTING THE TOKEN!")
              localStorage.setItem("JWT", result.data.token);
            }
            console.log("SENT USER INFO");
        }
        catch(error){
            console.log(error);
        }
    }

    const classes = useStyles(props);
    return (
      <div
        className="loginPageMainDiv"
        style={{
          backgroundImage: `url(${loginBackGround})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          backgroundAttachment: "fixed",
          minHeight: "87vh",
          minWidth: "100vw",
          paddingTop: "2rem",
        }}
      >
        <div className="loginFromDivMain">
          <h1
            style={{
              display: "inline-block",
              marginBottom: "2rem",
            }}
          >
            Login
          </h1>
          <form className="loginForm">
            <div className="form-floating mb-3">
              <input
                autoFocus
                name="email"
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
                onChange={(event) => {
                  inputFormHandler(event);
                }}
              ></input>
              <label for="floatingInput">Email address</label>
            </div>
            <div className="form-floating">
              <input
                name="pass"
                type={showPass ? "text" : "password"}
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                onChange={(event) => {
                  inputFormHandler(event);
                }}
              ></input>
              <div
                style={{
                  display: "inline-block",
                  marginLeft: "auto",
                  position: "absolute",
                  right: "10px",
                  top: "15px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setshowPass(!showPass);
                }}
              >
                {showPass ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </div>
              <label for="floatingPassword">Password</label>
            </div>
            <p
              style={{
                color: "red",
                fontWeight: "700",
                marginTop: "1rem",
              }}
            >
              {errors}
            </p>
            <Button
              variant="contained"
              className={classes.button}
              onClick={() => {
                submitLoginDetails();
              }}
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    );
}

export default LoginPage;
