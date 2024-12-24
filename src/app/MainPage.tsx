"use client";

import { Key, useEffect, useState } from "react";
import ProductView from "./components/ProductView";
import { Product } from "./Server/tableTypes";
import AddProduct from "./AddProduct";
import Image from "next/image";
import WebsiteHeader from "./components/WebsiteHeader";
import LoginPage from "./LoginPage/page";

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
        <></>
    );
}

//<ProductView key={index} title={product.product_name} price={product.product_price} />