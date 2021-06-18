import React, { useState, useEffect} from "react";
import "./HomePage.scss";
import NavBar from "../../../Components/NavBar/NavBar";
import shopping_img from "../../../assets/shopping_image.svg";
import { Link } from "react-router-dom";
import homePageBackground from "../../../assets/homePageBackground.jpg";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
    logoutUser,
    loginUser,
} from "../../../redux/LoginLogoutFeatues/LoginLogoutFeaturesActions";

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
        },
    },
    homePageShopButtonOutline: {
        color: "white",
        border: "1px solid #000000",
        padding: "0",
        fontSize: "1.2rem",
        fontWeight: "600",
        "&:hover": {
            border: "1px solid #000000",
            backgroundColor: "#E4D04E",
            color: "#000000",
        },
    },
    homePageShopButtonContained: {
        color: "white",
        fontSize: "1.2rem",
        fontWeight: "600",
        backgroundColor: "#6874E8",
        padding: "0",
        "&:hover": {
            backgroundColor: "#E8F0FF",
            color: "#000000",
        },
    },
}));

const HomePage = () => {
    const classes = useStyles();
    const [userAuthenticated, setuserAuthenticated] = useState(false);
    const userLoggedIn = useSelector((state) => state.loggedIn.loggedIn);
    const username = useSelector((state) => state.loggedIn.userName);
    const LoginLogoutFeatuesDispatch = useDispatch();
    const checkAuthorization = async (token) => {
        try {
            const result = await axios({
                method: "POST",
                url: `${process.env.REACT_APP_REST_URL}auth`,
                headers: {
                    "content-type": "application/json",
                    accept: "application/json",
                },
                data: JSON.stringify({
                    token: token,
                }),
            });
            console.log(result.data._id);
            return result.data._id;
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (localStorage.getItem("JWT") === null) {
            setuserAuthenticated(false);
            console.log("No user Logged in!");
        } else {
            const logOut = async () => {
                const token = localStorage.getItem("JWT");
                const id = await checkAuthorization(token);
                if (id !== undefined) {
                    LoginLogoutFeatuesDispatch(loginUser());
                    setuserAuthenticated(true);
                }
            };
            logOut();
        }
    }, [userAuthenticated]);
    return (
        <div
            className="welcomePageBody"
            style={{
                backgroundImage: `url(${homePageBackground})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div>
                <h1 className="welcomePageHeading">Welcome to EMarting!</h1>
                <p className="welcomePageTagLine">
                    Choose Your Favorite Books from biggest Collection!
                </p>
            </div>
            <div className="homePageButtons">
                {userLoggedIn === false ? (
                    <Button
                        variant="outlined"
                        color="secondary"
                        className={classes.homePageShopButtonOutline}
                    >
                        <Link
                            to="/login"
                            style={{
                                textDecoration: "none",
                                color: "inherit",
                                height: "100%",
                                width: "100%",
                                padding: "0.5rem 1rem",
                            }}
                        >
                            LogIn
                        </Link>
                    </Button>
                ) : null}
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.homePageShopButtonContained}
                >
                    <Link
                        to="/shop"
                        style={{
                            textDecoration: "none",
                            color: "inherit",
                            height: "100%",
                            width: "100%",
                            padding: "0.5rem 1rem",
                        }}
                    >
                        Shop 🛒
                    </Link>
                </Button>
            </div>
            {/* <div
                style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    flexWrap: "wrap",
                }}
            >
                <button
                    type="button"
                    class="btn btn-outline-light shopButtonHomePage"
                    style={{
                        textAlign: "center",
                        padding: "20px",
                        minWidth: "20%",
                    }}
                >
                    <Link
                        to="/shop"
                        style={{
                            textDecoration: "none",
                            color: "inherit",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "5rem",
                            }}
                        >
                            🛒
                        </span>
                        <br></br>
                        <span
                            style={{
                                fontSize: "2rem",
                            }}
                        >
                            Shop
                        </span>
                    </Link>
                </button>
                <img
                    className="welcomePageIllustration"
                    src={shopping_img}
                ></img>
            </div> */}
        </div>
    );
};

export default HomePage;
