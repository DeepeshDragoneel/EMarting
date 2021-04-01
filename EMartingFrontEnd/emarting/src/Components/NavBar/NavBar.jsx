import React from 'react';
import './NavBar.scss'
import shopIcon from '../../assets/icon.png';
import {NavLink} from 'react-router-dom';
import {FaShoppingCart} from 'react-icons/fa';
import Badge from "@material-ui/core/Badge";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useSelector, useDispatch } from "react-redux";
import {decrementCartNotification} from '../../redux/CartNotifications/CartNotificationsActions';


const NavBar = (props) => {
    const notification = useSelector(
      (state) => state.notifications.notification
    );
    const cartNotificationDispatch = useDispatch();
    return (
        <div>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid">
                    <a className="navbar-brand" href="/" style={{
                        paddingTop: "0px",
                        margin: "10px 15px 10px 10px",
                    }}><img src={shopIcon} alt="" width="30" height="24" style={{
                        color: "#0f1213",
                    }}></img></a>
                    <p style={{fontSize: "1.4rem", alignSelf: "center", margin: "auto"}}>EMarting</p>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <NavLink exact activeClassName="linkIsActive" className="nav-link" aria-current="page" to="/">Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink exact activeClassName="linkIsActive" className="nav-link" aria-current="page" to="/admin/addProduct">Add Products</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink exact activeClassName="linkIsActive" className="nav-link" aria-current="page" to="/admin/shop">Admin Products</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink exact activeClassName="linkIsActive" className="nav-link" aria-current="page" to="/shop">Shop</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink exact activeClassName="linkIsActive" className="nav-link" aria-current="page" to="/cart" onClick={()=>{
                                    cartNotificationDispatch(decrementCartNotification());
                                }}>
                                <Badge badgeContent={notification} color="error">
                                    <ShoppingCartIcon style={{
                                    fontSize: "1.8rem"
                                }}></ShoppingCartIcon>
                                </Badge></NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default NavBar;
