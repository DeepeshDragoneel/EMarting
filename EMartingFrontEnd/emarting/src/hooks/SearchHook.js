import {useEffect, useState} from 'react'
import axios from 'axios';

export default function SearchHook(query, pageNumber) {
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    const [Products, setProducts] = useState([]);
    const [hasMore, sethasMore] = useState(false);
    useEffect(() => {
        setProducts([]);
    }, [query]);

    useEffect(() => {
        setloading(true);
        seterror(false);
        axios({
            method: "GET",
            url: "http://localhost:8000/shop",
            params: { query: query, pageNumber: pageNumber }
            
        }).then((res) => {
            console.log("Hook: ", res.data.products);
            setProducts((products) => {
                return [...products].concat(res.data.products);
            });
            console.log("SETPRODUCTS: ", Products);
            sethasMore(res.data.count);
            setloading(false);
        }).catch(error => console.log(error));
    }, [query, pageNumber])

    return { loading, error, hasMore, Products };
}

