"use client";

import { Key, useEffect, useState } from "react";
import ProductView from "../Components/ProductView";
import { Product } from "../Server/tableTypes";
import AddProduct from "./AddProduct";

export default function MainPage() {
    const [products, setProducts] = useState<any>([]);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/api/products');
            const data = await response.json();
            setProducts(data);
        }
        fetchData();

    }, []);

    useEffect(() => {
        console.log(products)
        console.log(typeof products)
    }, [products])
    //fetch data on mount

    return (
        <div className="grid grid-cols-4 gap-y-10">
            <AddProduct />
        </div>
    );
}

//<ProductView key={index} title={product.product_name} price={product.product_price} />