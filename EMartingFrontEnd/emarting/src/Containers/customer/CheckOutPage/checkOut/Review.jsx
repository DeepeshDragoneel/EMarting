import React, { useState } from 'react';
import {Typography, List, ListItem, ListItemText} from '@material-ui/core';

const Review = ({items, settotalPrice}) => {
    let totalPrice = 0;
    return (
      <div>
        <Typography variant="h6" gutturBottom>
          Order Summary
        </Typography>
        <List disablePadding>
          {items !== null ? (
            items.length === 0 ? (
              <h1>No products</h1>
            ) : (
              <>
                {console.log("items: ", items)}
                {items.map((item) => {
                  totalPrice =
                    totalPrice + item.productId.price * item.quantity;
                  return (
                    <ListItem style={{ padding: "10px 0" }} key={item._id}>
                      <ListItemText
                        primary={item.productId.title}
                        secondary={`Quantity: ${item.quantity}`}
                      ></ListItemText>
                      <Typography variant="body2">
                        ₹{item.productId.price * item.quantity}
                      </Typography>
                    </ListItem>
                  );
                })}
                {settotalPrice(totalPrice)}
                <ListItem style={{ padding: "10px 0" }}>
                  <ListItemText primary="Total"></ListItemText>
                  <Typography type="subtitle1" style={{ fontWeight: 700 }}>
                    ₹{totalPrice}
                  </Typography>
                </ListItem>
              </>
            )
          ) : null}
        </List>
      </div>
    );
}

export default Review;
