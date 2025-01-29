"use client";

import { clothingCategory, salesCategories } from "./CollectionTypes";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Carousel from "./components/Carousel";
import MainPageHeader from "./components/MainPageHeader";
import { useEffect, useState } from "react";
import { useMatchMediaQuery } from "./MatchMediaQuery";
import WishlistBookmark from "./components/WishlistBookmark";
import { ProductCardInterface } from "./DataInterfaces";


export default function MainPage() {
    const { data: session, status } = useSession();

    console.log(session?.user.user_id, session?.user.email, status);

    const [exclusiveProducts, setExclusiveProducts] = useState<ProductCardInterface[]>([]);
    const [bestSellersProducts, setBestSellersProducts] = useState<ProductCardInterface[]>([]);
    const [saleProducts, setSaleProducts] = useState<ProductCardInterface[]>([]);
    const [newArrivalsProducts, setNewArrivalsProducts] = useState<ProductCardInterface[]>([]);
    const [clothingProducts, setClothingProducts] = useState<ProductCardInterface[]>([]);
    const [producerProducts, setProducerProducts] = useState<ProductCardInterface[]>([]);

    //3 cases, large screen more than 1024 pixels, then from 768 to 1024 and then finally anythting below
    // NEED TO COME BACK TO THIS SINCE IT IS A CUSTOM HOOK

    const getCategoryData = async (category: string) => {
        const response = await fetch(`/api?category=${category}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        const reply = await response.json();

        if (response.ok) {
            if (category === 'Exclusive') {
                setExclusiveProducts(reply as ProductCardInterface[]);
            } else if (category === 'Best Sellers') {
                setBestSellersProducts(reply as ProductCardInterface[]);
            } else if (category === 'Sale') {
                setSaleProducts(reply as ProductCardInterface[]);
            } else if (category === 'New Arrivals') {
                setNewArrivalsProducts(reply as ProductCardInterface[]);
            } else if (category === 'Clothing') {
                setClothingProducts(reply as ProductCardInterface[]);
            } else if (category === 'Producer') {
                setProducerProducts(reply as ProductCardInterface[]);
            }
            console.log(reply);
        } else {
            console.log(response.status, response.statusText);
            return [];  // Return an empty array in case of error
        }
    };

    const getAllCategories = async () => {
        try {
            // Call getCategoryData for each category
            getCategoryData('Exclusive');
            getCategoryData('Best Sellers');
            getCategoryData('Sale');
            getCategoryData('New Arrivals');
            getCategoryData('Clothing');
            getCategoryData('Producer');
        } catch (error) {
            console.error('Error fetching category data:', error);
        }
    };


    useEffect(() => {
        getAllCategories();
    }, []);

    return (
        <>
            <div className="container mx-auto" >
                <div className="w-11/12 xl:w-5/6 mx-auto flex flex-col ">
                    {exclusiveProducts.length === 0 ? (
                        <div>Loading Exclusive...</div>
                    ) : (
                        <MainPageHeader
                            categoryArray={exclusiveProducts}
                            categoryTitle="Exclusive"
                        />
                    )}

                    {bestSellersProducts.length === 0 ? (
                        <div>Loading Best Sellers...</div>
                    ) : (
                        <MainPageHeader
                            categoryArray={bestSellersProducts}
                            categoryTitle="Best Sellers"
                        />
                    )}

                    {saleProducts.length === 0 ? (
                        <div>Loading Sale...</div>
                    ) : (
                        <MainPageHeader
                            categoryArray={saleProducts}
                            categoryTitle="On Sale"
                        />
                    )}

                    {newArrivalsProducts.length === 0 ? (
                        <div>Loading New Arrivals...</div>
                    ) : (
                        <MainPageHeader
                            categoryArray={newArrivalsProducts}
                            categoryTitle="New Arrivals"
                        />
                    )}

                    {clothingProducts.length === 0 ? (
                        <div>Loading Categories...</div>
                    ) : (
                        <MainPageHeader
                            categoryArray={clothingProducts}
                            categoryTitle="Categories"
                            categories={true}
                        />
                    )}

                    {producerProducts.length === 0 ? (
                        <div>Loading Popular Brands...</div>
                    ) : (
                        <MainPageHeader
                            categoryArray={producerProducts}
                            categoryTitle="Popular Brands"
                            categories={true}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

//<ProductView key={index} title={product.product_name} price={product.product_price} />