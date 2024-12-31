"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import DashBoardProductCard from "./DashboardProductCard";

export interface Product {
    [key: string]: string | string[]
}

const gridLayout = '0.25fr 2fr 0.75fr 0.75fr 0.75fr 0.75fr 0.75fr 1fr ';

export default function Products() {
    const [currentProducts, setCurrentProducts] = useState<Product[]>([]);

    const [currentProductEllipsisMenu, setCurrentProductEllipsisMenu] = useState(-1);

    const productEllipsisMenuItemClass = "cursor-pointer hover:bg-gray-300";

    useEffect(() => {
        const getCurrentProduct = async () => {
            const response = await fetch('/api/Collections/Products', {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })

            const reply = await response.json();

            if (response.ok) {
                setCurrentProducts(reply);
                console.log(reply);
            }
            else {
                console.log(response.status, response.statusText);
            }
        };

        getCurrentProduct();
    }, []);


    return <>
        <div className="flex flex-col bg-gray-100 pb-[25px] pt-[25px]">
            <div className="p-[25px] flex flex-row justify-between">
                <span className="text-xl font-bold pl-[25px]">
                    Your Current Products
                </span>
                <Link href={`/ProducerDashboard?tab=AddProduct`}>
                    <span className=" rounded-md w-fit h-fit p-2.5
        hover:bg-gray-400"
                    >Add A Product</span>
                </Link>

            </div>

            <div className="flex flex-col gap-4 w-5/6 mx-auto ">
                <div className="grid border-2 border-black w-full p-2.5 "
                    style={{ gridTemplateColumns: `${gridLayout} 0fr` }}
                >
                    <span className="text-center">
                        ID
                    </span>

                    <span className="text-center">
                        Name
                    </span>

                    <span className="text-center">
                        Price
                    </span>

                    <span className="text-center">
                        Type
                    </span>

                    <span className="text-center">
                        Size
                    </span>

                    <span className="text-center">
                        Inventory
                    </span>

                    <span className="text-center">
                        Units Sold
                    </span>

                    <span className="text-center">
                        Total Revenue
                    </span>

                    More
                </div>

                {currentProducts.map((product, index) => (
                    <div className="flex flex-row" key={index}>
                        <DashBoardProductCard product={product} />
                    </div>
                ))}

            </div >


        </div >
    </>
}

export { gridLayout };