import React from 'react';
import './HomePage.scss';
import NavBar from '../../../Components/NavBar/NavBar';
import shopping_img from '../../../assets/shopping_image.svg';
import {Link} from 'react-router-dom';

const HomePage = () => {
    return (
      <div className="welcomePageBody">
        <div>
          <h1 className="welcomePageHeading">Welcome to EMarting!</h1>
          <p className="welcomePageTagLine">Enjoy Your Shopping 🛒</p>
        </div>
        <div
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
          <img className="welcomePageIllustration" src={shopping_img}></img>
        </div>
      </div>
    );
}

export default HomePage;
