"use client";

import { clothingCategory, salesCategories } from "./CollectionTypes";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Carousel from "./components/Carousel";
import MainPageHeader from "./components/MainPageHeader";
import { useEffect, useState } from "react";
import { Product } from "./ProducerDashboard/components/Products";
import { MainPageHeaderBrand } from "./components/MainPageHeader";


export default function MainPage() {
    const { data: session, status } = useSession();

    console.log(session?.user.user_id, session?.user.email, status);

    const [mainPageProducts, setMainPageProducts] = useState<Product[][] | null>(null);

    useEffect(() => {
        const getMainPageProducts = async () => {
            const response = await fetch('/api/', {
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                }
            })

            const reply = await response.json()

            if (response.ok) {
                console.log(reply)
                setMainPageProducts(reply);
            }
            else {
                console.log(response.status, response.statusText)
            }
        }

        getMainPageProducts();

    }, []);

    useEffect(() => {
        if (mainPageProducts) {
            console.log(mainPageProducts[1])
        }
    }, [mainPageProducts])
    return (
        <>
            <div className="container mx-auto" >
                <div className="w-5/6 mx-auto flex flex-col">
                    <MainPageHeader categoryArray={mainPageProducts?.[0] ?? []} categoryTitle="New Arrivals" />
                    <MainPageHeaderBrand categoryArray={mainPageProducts?.[1] ?? []} categoryTitle="Popular Brands" />
                    <MainPageHeader categoryArray={mainPageProducts?.[2] ?? []} categoryTitle="Exclusive" />
                    <MainPageHeader categoryArray={mainPageProducts?.[3] ?? []} categoryTitle="Best Sellers" />
                    <MainPageHeader categoryArray={mainPageProducts?.[4] ?? []} categoryTitle="On Sale" />
                    <MainPageHeaderBrand categoryArray={mainPageProducts?.[5] ?? []} categoryTitle="Categories" />
                </div>

            </div>


        </>
    );
}

//<ProductView key={index} title={product.product_name} price={product.product_price} />