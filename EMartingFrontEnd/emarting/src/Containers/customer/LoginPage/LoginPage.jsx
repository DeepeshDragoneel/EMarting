import React, { useState } from 'react';
import './LoginPage.scss';
import loginPageBackground from "../../../assets/loginPageBackground.jpg";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios';
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { useSelector, useDispatch } from "react-redux";
import {logoutUser, loginUser} from "../../../redux/LoginLogoutFeatues/LoginLogoutFeaturesActions";
import { NavLink } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import Icon from "./icon";

const useStyles = makeStyles({
    button: {
        backgroundColor: "#FFD919",
        padding: "0.5rem 1.5rem",
        color: "black",
        margin: "1rem 0rem 1rem",
    },
    googleAuthButton: {
        color: "white",
        backgroundColor: "#662C91",
        marginTop: "1rem",
        "&:hover": {
            backgroundColor: "#FFD919",
            color: "black",
        },
    },
});

const LoginPage = (props) => {
  const [showPass, setshowPass] = useState(false);
    const [errors, seterrors] = useState("");
    const [userInfo, setuserInfo] = useState({
      email: "",
      pass: ""
    });
    const history = useHistory();
    const routeChange = () => {
      let path = `../`;
      history.push(path);
    };
    const userLoggedIn = useSelector((state) => state.loggedIn.loggedIn);
    const LoginLogoutFeatuesDispatch = useDispatch();

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
                url: `${process.env.REACT_APP_REST_URL}auth/login`,
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
              console.log(result.data.username.split(" ")[0]);
              localStorage.setItem(
                "username",
                result.data.username.split(" ")[0]
                );
                LoginLogoutFeatuesDispatch(loginUser());
                routeChange();
            }
            console.log("SENT USER INFO");
        }
        catch(error){
            console.log(error);
        }
    }

    const googleSuccess = async(res) => {
        seterrors("");
        /* const result = res?.profileObj;
        const token = res?.tokenId;
        console.log(result);
        console.log(token); */
        try {
            const result = await axios({
                method: "POST",
                url: `${process.env.REACT_APP_REST_URL}auth/googleLogIn`,
                headers: {
                    "content-type": "application/json",
                    accept: "application/json",
                },
                data: JSON.stringify({ data: res }),
            });
            console.log("SENT USER INFO");
            console.log(result);
            if (result.data !== "error") {
                localStorage.setItem("JWT", result.data.token);
                localStorage.setItem(
                    "username",
                    result.data.username.split(" ")[0]
                );
                LoginLogoutFeatuesDispatch(loginUser());
                routeChange();
            } else {
                seterrors(
                    "GOOGLE AUTHENTICATION FAILED!\n(you might need to registered First!)"
                );
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const googleFailure = () => {
        seterrors("Google AUthentication Error!");
    }

    const classes = useStyles(props);
    return (
        <div
            className="loginPageMainDiv"
            style={{
                backgroundImage: `url(${loginPageBackground})`,
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
                        color: "white",
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
                            {showPass ? (
                                <VisibilityIcon />
                            ) : (
                                <VisibilityOffIcon />
                            )}
                        </div>
                        <label for="floatingPassword">Password</label>
                    </div>
                    {errors===""?null:<p
                        style={{
                            color: "white",
                            fontWeight: "700",
                            marginTop: "1rem",
                            padding: "1rem",
                            background: "rgb(236,54,27)",
                            background:
                                "linear-gradient(0deg, rgba(236,54,27,1) 0%, rgba(230,59,13,1) 30%, rgba(244,2,2,1) 100%)",
                        }}
                    >
                        {errors}
                    </p>}
                    <Button
                        variant="contained"
                        className={classes.button}
                        onClick={async () => {
                            await submitLoginDetails();
                        }}
                    >
                        Login
                    </Button>
                    <GoogleLogin
                        clientId="932722578967-3qbrmborj9dd6nevja1a2fqnksbjhedf.apps.googleusercontent.com"
                        render={(renderprops) => (
                            <Button
                                className={classes.googleAuthButton}
                                fullWidth
                                onClick={renderprops.onClick}
                                disabled={renderprops.disabled}
                                startIcon={<Icon />}
                                variant="container"
                            >
                                Google SignIn
                            </Button>
                        )}
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy="single_host_origin"
                    />
                    <li
                        className="nav-item"
                        style={{
                            listStyleType: "none",
                        }}
                    >
                        <NavLink
                            exact
                            activeClassName="linkIsActive"
                            className="nav-link"
                            aria-current="page"
                            to="/signUp"
                        >
                            New to Emarting?
                        </NavLink>
                    </li>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
