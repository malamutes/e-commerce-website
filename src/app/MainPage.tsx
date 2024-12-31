"use client";

import { clothingCategory, salesCategories } from "./CollectionTypes";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Carousel from "./components/Carousel";

export default function MainPage() {


    const { data: session, status } = useSession();

    console.log(session?.user.user_id, session?.user.email, status);


    return (
        <>
            <div className="bg-gray-200 grid grid-cols-2">
                <div className="flex flex-col">
                    {clothingCategory.map((category) => (
                        <Link key={category} href={`/Collections?clothingCategory=${category}`}
                            className="border-2 border-black w-fit hover:bg-gray-400 p-2 rounded-md"
                        >
                            <span >
                                {category}
                            </span>
                        </Link>

                    ))}
                </div>

                <div className="flex flex-col mt-5">
                    {salesCategories.filter(cat => cat != 'Regular').map((saleCategory) => (
                        <Link key={saleCategory} href={`/Collections/${saleCategory}`}
                            className="border-2 border-black w-fit hover:bg-gray-400 p-2 rounded-md"
                        >
                            <span >
                                {saleCategory}
                            </span>
                        </Link>

                    ))}
                </div>
            </div>
        </>
    );
}

//<ProductView key={index} title={product.product_name} price={product.product_price} />