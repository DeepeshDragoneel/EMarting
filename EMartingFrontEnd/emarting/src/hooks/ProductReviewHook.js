import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductReviewHook(productId, pageNumber) {
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    const [Reviews, setReviews] = useState([]);
    const [hasMore, sethasMore] = useState(false);
    useEffect(() => {
        console.log("Changed ProductID")
        setReviews([]);
    }, [productId]);

    useEffect(() => {
        setloading(true);
        seterror(false);
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_REST_URL}review`,
            params: { productId:productId, pageNumber: pageNumber },
        })
            .then((res) => {
                console.log("Hook: ", res.data.review);
                setReviews((review) => {
                    console.log(
                        "In setting : ",
                        [...review].concat(res.data.review)
                    );
                    return [...review].concat(res.data.review);
                });
                console.log("SETREVIEWS: ", Reviews);
                sethasMore(res.data.count);
                setloading(false);
            })
            .catch((error) => console.log(error));
    }, [productId, pageNumber]);

    return { loading, error, hasMore, Reviews };
}
