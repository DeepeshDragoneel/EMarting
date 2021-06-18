import React, { useEffect, useState } from "react";
import "./NavBar.scss";
import shopIcon from "../../assets/icon.png";
import { NavLink } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import Badge from "@material-ui/core/Badge";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useSelector, useDispatch } from "react-redux";
import { decrementCartNotification } from "../../redux/CartNotifications/CartNotificationsActions";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
// import Collapse from "@material-ui/core/Collapse";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import "../../../node_modules/jquery/dist/jquery.min.js";
// import Navbar from "react-bootstrap/Navbar";
// import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../../../node_modules/bootstrap/dist/js/bootstrap.min.js";
import StarBorder from "@material-ui/icons/StarBorder";
import {
    logoutUser,
    loginUser,
} from "../../redux/LoginLogoutFeatues/LoginLogoutFeaturesActions";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText,
} from "reactstrap";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: "0",
        height: "min-content",
        alignSelf: "center",
        backgroundColor: theme.palette.background.paper,
    },
}));

const NavBar = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);
    const [userAuthenticated, setuserAuthenticated] = useState(false);
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    const removeUserToken = async () => {
        try {
            const token = localStorage.getItem("JWT");
            const id = await checkAuthorization(token);
            const result = await axios({
                method: "POST",
                url: `${process.env.REACT_APP_REST_URL}deleteToken/${id}`,
                headers: {
                    "content-type": "application/json",
                    accept: "application/json",
                },
                data: JSON.stringify({
                    token: token,
                }),
            });
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };

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
    const notification = useSelector(
        (state) => state.notifications.notification
    );
    const cartNotificationDispatch = useDispatch();
    const userLoggedIn = useSelector((state) => state.loggedIn.loggedIn);
    const username = useSelector((state) => state.loggedIn.userName);
    const LoginLogoutFeatuesDispatch = useDispatch();
    return (
        <div>
            <Navbar
                fixed="true"
                color="light"
                light
                expand="md"
                style={{ padding: "10px" }}
            >
                <a
                    className="navbar-brand"
                    href="/"
                    style={{
                        paddingTop: "0px",
                        margin: "10px 15px 10px 10px",
                    }}
                >
                    <img
                        src={shopIcon}
                        alt=""
                        width="30"
                        height="24"
                        style={{
                            color: "#0f1213",
                        }}
                    ></img>
                </a>
                <NavbarBrand
                    href="/"
                    style={{
                        fontSize: "1.4rem",
                        alignSelf: "center",
                        margin: "auto",
                    }}
                >
                    EMarting
                </NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                            <NavLink
                                exact
                                activeClassName="linkIsActive"
                                className="nav-link"
                                aria-current="page"
                                to="/"
                            >
                                Home
                            </NavLink>
                        </NavItem>
                        {userLoggedIn === true ? (
                            <>
                                <NavItem>
                                    <NavLink
                                        exact
                                        activeClassName="linkIsActive"
                                        className="nav-link"
                                        aria-current="page"
                                        style={{
                                            whiteSpace: "nowrap",
                                        }}
                                        to="/admin/addProduct"
                                    >
                                        Add Products
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        exact
                                        activeClassName="linkIsActive"
                                        className="nav-link"
                                        aria-current="page"
                                        to="/admin/shop"
                                        style={{
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        Admin Products
                                    </NavLink>
                                </NavItem>
                            </>
                        ) : null}
                        <NavItem>
                            <NavLink
                                exact
                                activeClassName="linkIsActive"
                                className="nav-link"
                                aria-current="page"
                                to="/shop"
                            >
                                Shop
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                exact
                                activeClassName="linkIsActive"
                                className="nav-link"
                                aria-current="page"
                                to="/cart"
                                onClick={() => {
                                    cartNotificationDispatch(
                                        decrementCartNotification()
                                    );
                                }}
                            >
                                <Badge
                                    badgeContent={notification}
                                    color="error"
                                >
                                    <ShoppingCartIcon
                                        style={{
                                            fontSize: "1.8rem",
                                        }}
                                    ></ShoppingCartIcon>
                                </Badge>
                            </NavLink>
                        </NavItem>
                        {userLoggedIn === true ? (
                            <UncontrolledDropdown
                                nav
                                inNavbar
                                style={{
                                    width: "fit-content",
                                    fontWeight: "400",
                                    color: "black",
                                    alignSelf: "center",
                                }}
                            >
                                <DropdownToggle
                                    nav
                                    caret
                                    style={{
                                        color: "black",
                                        alignSelf: "center",
                                        fontSize: "1rem",
                                    }}
                                >
                                    {`Hello ${username}`}
                                </DropdownToggle>
                                <DropdownMenu
                                    right
                                    style={{
                                        position: "absolute",
                                    }}
                                >
                                    <DropdownItem
                                        style={{
                                            padding: "0",
                                        }}
                                    >
                                        <NavLink
                                            to="/orders"
                                            style={{
                                                textAlign: "center",
                                                textDecoration: "none",
                                                color: "black",
                                                width: "100%",
                                                margin:"none",
                                                height: "100%",
                                                padding: "0",
                                            }}
                                        >
                                            <p style={{margin:"0"}}>Orders</p>
                                        </NavLink>
                                    </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem
                                        style={{
                                            fontWeight: "900",
                                            color: "red",
                                            textAlign: "center",
                                        }}
                                        onClick={() => {
                                            removeUserToken();
                                            localStorage.removeItem("JWT");
                                            localStorage.removeItem("username");
                                            LoginLogoutFeatuesDispatch(
                                                logoutUser()
                                            );
                                        }}
                                    >
                                        LogOut
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        ) : (
                            <NavItem>
                                <NavLink
                                    exact
                                    activeClassName="linkIsActive"
                                    className="nav-link"
                                    aria-current="page"
                                    to="/login"
                                >
                                    Login
                                </NavLink>
                            </NavItem>
                        )}
                    </Nav>
                </Collapse>
            </Navbar>
            {/* <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid">
                    <a
                        className="navbar-brand"
                        href="/"
                        style={{
                            paddingTop: "0px",
                            margin: "10px 15px 10px 10px",
                        }}
                    >
                        <img
                            src={shopIcon}
                            alt=""
                            width="30"
                            height="24"
                            style={{
                                color: "#0f1213",
                            }}
                        ></img>
                    </a>
                    <p
                        style={{
                            fontSize: "1.4rem",
                            alignSelf: "center",
                            margin: "auto",
                        }}
                    >
                        EMarting
                    </p>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <NavLink
                                    exact
                                    activeClassName="linkIsActive"
                                    className="nav-link"
                                    aria-current="page"
                                    to="/"
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    exact
                                    activeClassName="linkIsActive"
                                    className="nav-link"
                                    aria-current="page"
                                    to="/admin/addProduct"
                                >
                                    Add Products
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    exact
                                    activeClassName="linkIsActive"
                                    className="nav-link"
                                    aria-current="page"
                                    to="/admin/shop"
                                >
                                    Admin Products
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    exact
                                    activeClassName="linkIsActive"
                                    className="nav-link"
                                    aria-current="page"
                                    to="/shop"
                                >
                                    Shop
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    exact
                                    activeClassName="linkIsActive"
                                    className="nav-link"
                                    aria-current="page"
                                    to="/cart"
                                    onClick={() => {
                                        cartNotificationDispatch(
                                            decrementCartNotification()
                                        );
                                    }}
                                >
                                    <Badge
                                        badgeContent={notification}
                                        color="error"
                                    >
                                        <ShoppingCartIcon
                                            style={{
                                                fontSize: "1.8rem",
                                            }}
                                        ></ShoppingCartIcon>
                                    </Badge>
                                </NavLink>
                            </li>
                            {!userLoggedIn ? (
                                <li className="nav-item">
                                    <NavLink
                                        exact
                                        activeClassName="linkIsActive"
                                        className="nav-link"
                                        aria-current="page"
                                        to="/login"
                                    >
                                        Login
                                    </NavLink>
                                </li>
                            ) : null}
                            {userLoggedIn === true ? (
                                <List
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                    className={classes.root}
                                >
                                    <ListItem button onClick={handleClick}>
                                        <ListItemText
                                            primary={`Hello ${username}`}
                                        />
                                        {open ? <ExpandLess /> : <ExpandMore />}
                                    </ListItem>
                                    <Collapse
                                        in={open}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        <List component="div" disablePadding>
                                            <ListItem
                                                button
                                                className={classes.nested}
                                                style={{
                                                    position: "absolute",
                                                    backgroundColor: "white",
                                                }}
                                            >
                                                <ListItemText>
                                                    <button
                                                        type="button"
                                                        class="btn btn-outline-danger"
                                                        onClick={() => {
                                                            removeUserToken();
                                                            localStorage.removeItem(
                                                                "JWT"
                                                            );
                                                            localStorage.removeItem(
                                                                "username"
                                                            );
                                                            LoginLogoutFeatuesDispatch(
                                                                logoutUser()
                                                            );
                                                        }}
                                                    >
                                                        LOGOUT
                                                    </button>
                                                </ListItemText>
                                            </ListItem>
                                        </List>
                                    </Collapse>
                                </List>
                            ) : null}
                        </ul>
                    </div>
                </div>
            </nav> */}
        </div>
    );
};

export default NavBar;
