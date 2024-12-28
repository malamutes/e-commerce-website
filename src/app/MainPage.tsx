"use client";

import { Key, useEffect, useState } from "react";
import ProductView from "./components/ProductView";
import { Product } from "./Server/tableTypes";
import Image from "next/image";
import WebsiteHeader from "./components/WebsiteHeader";
import LoginPage from "./LoginPage/page";
import { useSession } from "next-auth/react";

export default function MainPage() {


    const { data: session, status } = useSession();

    console.log(session?.user.user_id, session?.user.email, status);


    return (
        <>
            <div className="h-screen bg-gray-200">

            </div>
        </>
    );
}

//<ProductView key={index} title={product.product_name} price={product.product_price} />