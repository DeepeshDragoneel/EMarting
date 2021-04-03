import React, { useState } from "react";
import "./SignUpPage.scss";
import loginBackGround from "../../../assets/loginBackGround.jpg";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles({
  button: {
    backgroundColor: "#ffb4b4",
    padding: "0.5rem 1.5rem",
    color: "black",
    margin: "1rem 0rem 0rem",
  },
});

const SignUpPage = (props) => {
  const [showPass, setshowPass] = useState(false);
  const [userInfo, setuserInfo] = useState({
        username: "",
        email: "",
        pass: "",
  });

    const [errors, seterrors] = useState({
        username: "",
        email: ""
    })

  const inputFormHandler = (event) => {
    if (event.target.name == "email") {
      setuserInfo({
        ...userInfo,
        email: event.target.value,
      });
    } else if (event.target.name == "username") {
      setuserInfo({
        ...userInfo,
        username: event.target.value,
      });
    } else {
      setuserInfo({
        ...userInfo,
        pass: event.target.value,
      });
    }
    console.log(userInfo);
  };

  const submitLoginDetails = async () => {
    try {
      const result = await axios({
        method: "POST",
        url: "http://localhost:8000/auth/signUp",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        data: JSON.stringify({ data: userInfo }),
      });
      console.log(result);
      if (result.data == "res Username is already taken") {
          seterrors({
              username: "Username Taken!"
          })
        }    
      else if (result.data == "res email is already taken") {
          seterrors({
              username: "",
              email: "Email Taken!"
          })
      }
      else{
          seterrors({
              username: "",
              email: ""
          })
      }
      if(result.data.token!=undefined){
        localStorage.setItem("JWT", result.data.token);
      }
      console.log("SENT USER INFO");
      console.log(errors);
    } catch (error) {
      console.log(error);
    }
  };

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
            marginBottom: "0.5rem",
          }}
        >
          SignUp
        </h1>
        <p
          style={{
            marginBotton: "1.5rem !important",
          }}
        >
          Hello User! SignUp to join Us!
        </p>
        <form className="loginForm">
          <div className="form-floating mb-3">
            <input
              autoFocus
              name="username"
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              onChange={(event) => {
                inputFormHandler(event);
              }}
            ></input>
            <label for="floatingInput">UserName</label>
          </div>
          <div className="form-floating mb-3">
            <input
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
              {showPass ? <VisibilityIcon /> : <VisibilityOffIcon/>}
            </div>
            <label for="floatingPassword">Password</label>
          </div>
          <ul
            style={{
              justifyContent: "center",
              marginTop: "1.4rem",
            }}
          >
            <li
              style={{
                textAlign: "start",
              }}
            >
              Min length of UserName - 4
            </li>
          </ul>
          <p
            style={{
              color: "red",
            }}
          >
            {errors.username}
          </p>
          <p
            style={{
              color: "red",
            }}
          >
            {errors.email}
          </p>
          <Button
            variant="contained"
            className={classes.button}
            onClick={() => {
              submitLoginDetails();
            }}
          >
            SignUp
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
