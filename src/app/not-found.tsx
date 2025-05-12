"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCardInterface } from "./DataInterfaces";
import MainPageHeader from "./components/MainPageHeader";

export default function GlobalErrorComponent() {
    const [producerProducts, setProducerProducts] = useState<ProductCardInterface[]>([]);

    const getCategoryData = async (category: string) => {
        const response = await fetch(`/api?category=${category}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        const reply = await response.json();

        if (response.ok) {
            setProducerProducts(reply as ProductCardInterface[]);
            console.log(reply);
        } else {
            console.log(response.status, response.statusText);
            return [];  // Return an empty array in case of error
        }
    };

    useEffect(() => {
        try {
            getCategoryData('Producer');
        } catch (error) {
            console.error('Error fetching category data:', error);
        }
    }, []);

    return <>
        <div className="min-h-[500px] flex flex-col items-center p-5 gap-5 mt-[25px] min-w-[280px] text-center">
            <span className="text-3xl font-bold">
                404 | Page Not Found
            </span>
            <p className="font-bold">
                The page you were looking for does not exist.
            </p>

            <Link className="text-white bg-black rounded-full p-3 font-bold block transition-all duration-300
                        hover:ring-[2.5px] hover:ring-black hover:ring-offset-[3px] hover:bg-white hover:text-black" href={"/"}>
                <span className="block w-full text-center">HOME</span>
            </Link>

            <hr className="border-gray-500 w-1/2 border-[0.5px]" />
            <div className="xl:w-2/3 sm:w-3/4 w-full mb-[50px]">
                <MainPageHeader
                    categoryArray={producerProducts}
                    categoryTitle="Popular Brands"
                    brand={true}
                    headerStyle="mt-0"
                />
            </div>


        </div>
    </>
}