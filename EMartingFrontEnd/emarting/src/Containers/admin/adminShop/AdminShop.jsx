import React, { useState, useEffect } from "react";
import './AdminShop.scss';
import NavBar from '../../../Components/NavBar/NavBar';
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import { AiFillDelete, AiTwotoneEdit } from "react-icons/ai";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    // width: "100rem !important",
    width: "20rem !important",
  },
  media: {
    height: 140,
  },
});


const AdminShop = () => {
    const [deleteProduct, setdeleteProduct] = useState(false);
    const [Products, setProducts] = useState([]);

    const classes = useStyles();

    const getProducts = async () => {
      try {
        const temp = await axios.get("http://localhost:8000/shop");
        console.log(temp.data);
        setProducts(temp.data);
      } catch (error) {
        console.log(error);
      }
    };

    const sendDeleteItem = async(item) => {
      try{
        const result = await axios({
          method: "POST",
          url: "http://localhost:8000/admin/editProduct/delete",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
          data: JSON.stringify({ data: item }),
        });
        console.log(result);
        setdeleteProduct((p)=>{
          return !p;
        });
        console.log(deleteProduct);
      }
      catch(error){
        console.log(error);
      }
    }

    useEffect(() => {
      getProducts();
    }, [deleteProduct]);

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
                          image={item.imageURL}
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
                      <button type="button" class="btn btn-outline-success">
                        <NavLink
                          to={`/admin/editProduct/${item._id}`}
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                          }}
                        >
                          Edit <AiTwotoneEdit />
                        </NavLink>
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-danger"
                        onClick={() => {
                          sendDeleteItem(item);
                        }}
                      >
                        Delete <AiFillDelete />
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

export default AdminShop;
