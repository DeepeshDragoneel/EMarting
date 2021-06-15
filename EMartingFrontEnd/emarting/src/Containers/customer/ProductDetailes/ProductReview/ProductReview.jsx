import React, { useEffect, useState } from "react";
import "./ProductReview.scss";
import Rating from "@material-ui/lab/Rating";
import axios from "axios";

const ProductReview = ({ closeBackDrop, product, userId }) => {
    const [rating, setrating] = useState(1);
    const [heading, setheading] = useState("");
    const [desc, setdesc] = useState("");
    const [errorOpen, seterrorOpen] = useState(false);
    /* let rating;
    useEffect(() => {
        setrating(r => {
            rating = r;
            return r;
        })
    },[]) */
    const submitReview = async () => {
        const review = {
            rating: rating,
            heading: heading.trim(),
            desc: desc.trim(),
            userId: userId,
            productId: product._id,
        };
        console.log(review);
        const result = await axios({
            method: "POST",
            url: "http://localhost:8000/comment",
            headers: {
                "content-type": "application/json",
                accept: "application/json",
            },
            data: review
        });
        console.log(result);
        if (result.data === "SUCCESS") {
            closeBackDrop((i) => !i);
        }
        else {
            seterrorOpen((i) => !i);
        }
    };
    return (
        <div
            className="productReviewBackdrop"
            onClick={() => {
                closeBackDrop((i) => !i);
            }}
        >
            <div
                className="productReviewMain"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className="productReviewMainHeader">
                    <h1 style={{ fontSize: "1.7rem" }} className="mr-auto mt-2">
                        Create Review:
                    </h1>
                    <h1
                        onClick={() => {
                            closeBackDrop((i) => !i);
                        }}
                        style={{
                            cursor: "pointer",
                        }}
                    >
                        x
                    </h1>
                </div>
                <hr />
                <h1 style={{ fontSize: "1.5rem" }}>OverAll Rating: </h1>
                <Rating
                    name="simple-controlled"
                    value={rating}
                    onChange={(event, newValue) => {
                        setrating(newValue);
                    }}
                    style={{
                        marginBottom: "2rem",
                    }}
                />
                <h1 style={{ fontSize: "1.5rem" }}>Add a headline: </h1>
                <input
                    type="text"
                    class="form-control mb-3"
                    id=""
                    value={heading}
                    onChange={(e) => {
                        setheading(e.target.value);
                    }}
                    required
                    placeholder="Heading"
                ></input>
                <h1 style={{ fontSize: "1.5rem" }}>Add a written review: </h1>
                <textarea
                    type="text"
                    class="form-control mb-2"
                    id=""
                    rows="3"
                    value={desc}
                    style={{
                        resize: "none",
                    }}
                    onChange={(e) => {
                        setdesc(e.target.value);
                    }}
                    required
                    placeholder="Describe you experions!"
                ></textarea>
                {errorOpen?<div class="alert alert-danger" role="alert">
                    Error
                </div>:null}
                <button
                    type="button"
                    class="btn btn-outline-success"
                    style={{
                        alignSelf: "center",
                    }}
                    onClick={() => {
                        submitReview();
                    }}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default ProductReview;
