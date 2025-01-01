"use client";

import { clothingCategory, salesCategories } from "./CollectionTypes";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Carousel from "./components/Carousel";
import MainPageHeader from "./components/MainPageHeader";
import { useEffect, useState } from "react";
import { Product } from "./ProducerDashboard/components/Products";
import { useMatchMediaQuery } from "./MatchMediaQuery";


export default function MainPage() {
    const { data: session, status } = useSession();

    console.log(session?.user.user_id, session?.user.email, status);

    const [mainPageProducts, setMainPageProducts] = useState<Product[][] | null>(null);
    const [numItemsDisplay, setNumItemsDisplay] = useState(5);

    //3 cases, large screen more than 1024 pixels, then from 768 to 1024 and then finally anythting below
    // NEED TO COME BACK TO THIS SINCE IT IS A CUSTOM HOOK
    const more1024px = useMatchMediaQuery({ size: 1024 });
    const more640px = useMatchMediaQuery({ size: 640 });

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

    // NEED TO COME BACK TO THIS SINCE IT IS A CUSTOM HOOK
    useEffect(() => {
        if (more1024px) {
            setNumItemsDisplay(5);
        } else if (more640px) {
            setNumItemsDisplay(3);
        } else {
            setNumItemsDisplay(1);
        }
    }, [more640px, more1024px]);

    return (
        <>
            <div className="container mx-auto" >
                <div className="w-11/12 xl:w-5/6 mx-auto flex flex-col ">
                    <MainPageHeader categoryArray={mainPageProducts?.[0] ?? []}
                        categoryTitle="New Arrivals"
                        numItemsDisplay={numItemsDisplay}
                    />
                    <MainPageHeader categoryArray={mainPageProducts?.[1] ?? []}
                        categoryTitle="Popular Brands" categories={true}
                        numItemsDisplay={numItemsDisplay}
                    />
                    <MainPageHeader categoryArray={mainPageProducts?.[2] ?? []}
                        categoryTitle="Exclusive"
                        numItemsDisplay={numItemsDisplay}
                    />
                    <MainPageHeader categoryArray={mainPageProducts?.[3] ?? []}
                        categoryTitle="Best Sellers"
                        numItemsDisplay={numItemsDisplay}
                    />
                    <MainPageHeader categoryArray={mainPageProducts?.[4] ?? []}
                        categoryTitle="On Sale"
                        numItemsDisplay={numItemsDisplay}
                    />
                    <MainPageHeader categoryArray={mainPageProducts?.[5] ?? []}
                        categoryTitle="Categories" categories={true}
                        numItemsDisplay={numItemsDisplay}
                    />
                </div>

            </div>


        </>
    );
}

//<ProductView key={index} title={product.product_name} price={product.product_price} />