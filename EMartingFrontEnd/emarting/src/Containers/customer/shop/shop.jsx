import React, {useState, useEffect} from 'react';
import './shop.scss';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { incrementCartNotification } from '../../../redux/CartNotifications/CartNotificationsActions';

const useStyles = makeStyles({
  root: {
    // width: "100rem !important",
    width: "20rem !important",
},
    media: {
    height: 140,
  },
});

const Shop = () => {
    const [Products, setProducts] = useState([]);

    const classes = useStyles();

    const checkAuthorization = async (token) => {
      try {
        const result = await axios({
          method: "POST",
          url: "http://localhost:8000/auth",
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
    
    const getProducts = async() => {
        try{
            
            const temp = await axios.get(`http://localhost:8000/shop/`);
            console.log(temp.data);
            setProducts(temp.data);
        }
        catch(error){
            console.log(error);
        }
    }

    const addToCartProduct = async(product) => {
        try{
          const token = localStorage.getItem("JWT");
          const id = await checkAuthorization(token);
            const result = await axios({
                method: "post",
                url: `http://localhost:8000/cart/${id}`,
                headers:{
                    "content-type": "application/json",
                    "accept":"application/json",
                },
                data: JSON.stringify({"product": product})
            })
            console.log("Result in addCart shop")
            console.log(result.data);
        }
        catch(e){
            console.log(e);
        }
    }

    useEffect(() => {
        getProducts();
    }, [])

    //cartNotifications Redux
    const cartNotificationDispatch = useDispatch();

    return (
      <>
        <div
          style={{
            padding: "1rem",
          }}
        >
          <h1>Products:</h1>
          <br />
          <br />
          <div
            className="productPlace"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
              alignItems: "flex-start",
              alignContent: "space-between",
            }}
          >
            {Products.length === 0 ? (
              <h1>No products Found</h1>
            ) : (
              Products.map((item, idx) => {
                return (
                  <Card
                    className={classes.root}
                    style={{
                      margin: "2rem 0rem",
                    }}
                  >
                    <NavLink
                      to={`/shop/detailes/${item._id}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        cursor: "pointer !important",
                      }}
                    >
                      <CardActionArea>
                        <CardMedia
                          className={classes.media}
                          image={item.image}
                          title={item.title}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h2">
                            {item.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                            style={{}}
                          >
                            {item.desc}
                          </Typography>
                          <Typography gutterBottom variant="h5" component="h2">
                            ₹{item.price}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </NavLink>
                    <CardActions
                      style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <button
                        type="button"
                        class="btn btn-outline-dark"
                        onClick={() => {
                          addToCartProduct(item);
                          cartNotificationDispatch(incrementCartNotification());
                        }}
                      >
                        Add To Cart 🛒
                      </button>
                      <button type="button" class="btn btn-outline-success">
                        Buy Now
                      </button>
                    </CardActions>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </>
    );
}

export default Shop;
