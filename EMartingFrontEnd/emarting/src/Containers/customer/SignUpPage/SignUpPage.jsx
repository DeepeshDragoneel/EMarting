import React, { useState, useEffect } from "react";
import "./SignUpPage.scss";
import signInBackground from "../../../assets/signInBackground.jpg";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { NavLink, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    logoutUser,
    loginUser,
} from "../../../redux/LoginLogoutFeatues/LoginLogoutFeaturesActions";
import { GoogleLogin } from "react-google-login";
import Icon from "./icon";

const useStyles = makeStyles({
    button: {
        backgroundColor: "#ffb4b4",
        padding: "0.5rem 1.5rem",
        color: "black",
        margin: "1rem 0rem 0rem",
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

const SignUpPage = (props) => {
    const [showPass, setshowPass] = useState(false);
    const [verification, setverification] = useState("");
    const [userInfo, setuserInfo] = useState({
        username: "",
        email: "",
        pass: "",
    });

    const [errors, seterrors] = useState("");

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
        // console.log(userInfo);
    };
    const history = useHistory();
    const routeChange = () => {
        let path = `../shop`;
        history.push(path);
    };

    const googleSuccess = async (res) => {
        /* const result = res?.profileObj;
        const token = res?.tokenId;
        console.log(result);
        console.log(token); 
        console.log(res);*/
        /* try {
            const result = await axios({
                method: "POST",
                url: `${process.env.REACT_APP_REST_URL}auth/googleSignUp`,
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
                    "GOOGLE AUTHENTICATION FAILED!\n(you might have already registered try login in!)"
                );
            }
        } catch (error) {
            console.log(error);
        } */
    };
    const googleFailure = () => {
        console.log("Error Connecting to Google");
    };

    const submitLoginDetails = async () => {
        try {
            const result = await axios({
                method: "POST",
                url: `${process.env.REACT_APP_REST_URL}auth/signUp`,
                headers: {
                    "content-type": "application/json",
                    accept: "application/json",
                },
                data: JSON.stringify({ data: userInfo }),
            });
            console.log("Result: ", result);
            if (result.data.status === "error") {
                console.log("ERROR ENCOUNTERED!");
                setverification("");
                if (result.data.error === "Enter a valid Email!") {
                    console.log("enter a valid email!");
                    seterrors("Enter a valid Email!");
                } else if (result.data.error === "UserName must be atleast 4 character's long!") {
                    seterrors("UserName must be atleast 4 character's long!");
                }
                else if (
                    result.data.error ===
                    "Password must be atleast 4 character's long!"
                ) {
                    seterrors("Password must be atleast 4 character's long!");
                }
            }
            else if (result.data == "res Username is already taken") {
                seterrors("Username Taken!");
                setverification("");
            } else if (result.data == "res email is already taken") {
                seterrors("Email Taken!");
                setverification("");
            } else {
                seterrors("");
                setverification("Please Verify Your EMail using the invitation link sent to your mail!");
            }
            /* if (result.data.token != undefined) {
                localStorage.setItem("JWT", result.data.token);
                localStorage.setItem(
                    "username",
                    result.data.username.split(" ")[0]
                );
                LoginLogoutFeatuesDispatch(loginUser());
                // routeChange();
            } */
            console.log("SENT USER INFO");
            console.log(errors);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {}, [errors]);

    const LoginLogoutFeatuesDispatch = useDispatch();

    const classes = useStyles(props);
    return (
        <div
            className="loginPageMainDiv"
            style={{
                backgroundImage: `url(${signInBackground})`,
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
                        marginBottom: "3rem",
                        marginBottom: "0.5rem",
                        color: "white",
                    }}
                >
                    SignUp
                </h1>
                <p
                    style={{
                        marginBotton: "1.5rem !important",
                        color: "white",
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
                            {showPass ? (
                                <VisibilityIcon />
                            ) : (
                                <VisibilityOffIcon />
                            )}
                        </div>
                        <label for="floatingPassword">Password</label>
                    </div>
                    <GoogleLogin
                        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
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
                    <ul
                        style={{
                            justifyContent: "center",
                            marginTop: "1.4rem",
                            color: "white",
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
                    {errors === "" ? null : (
                        <p
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
                        </p>
                    )}
                    {verification === "" ? null : (
                        <p
                            style={{
                                backgroundColor: "white",
                                color: "black",
                                padding: "1rem",
                            }}
                        >
                            {verification}
                        </p>
                    )}
                    <Button
                        variant="contained"
                        className={classes.button}
                        onClick={async () => {
                            await submitLoginDetails();
                        }}
                    >
                        SignUp
                    </Button>
                    <li
                        className="nav-item"
                        style={{
                            listStyleType: "none",
                            color: "blue",
                        }}
                    >
                        <NavLink
                            exact
                            aria-current="page"
                            to="/login"
                            style={{
                                color: "blue !important",
                            }}
                        >
                            Already a Member?
                        </NavLink>
                    </li>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
