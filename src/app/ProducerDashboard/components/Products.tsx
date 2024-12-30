"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

export interface Product {
    [key: string]: string | string[]
}

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
        <div className="flex flex-col w-screen">
            Products
            <Link href={`/ProducerDashboard?tab=AddProduct`}>
                <span className="border-2 border-black rounded-md w-fit h-fit 
        hover:bg-gray-400"
                >ADD PRODUCTS</span>
            </Link>

            <div className="grid grid-cols-3 gap-4 bg-gray-300 w-3/4 mx-auto">
                {currentProducts.map((product, index) => (
                    <div key={index} className="flex flex-col border-2 border-black w-full
                    text-center">
                        <span className="bg-gray-400 
                        flex flex-row justify-between items-center">
                            <div>

                            </div>

                            <span className="text-xl font-semibold ">
                                {product['product_name']} ---
                                <span className="italic"> {product['product_id']}</span>
                            </span>

                            <div className="relative"
                                onClick={() => {
                                    if (currentProductEllipsisMenu === index) {
                                        setCurrentProductEllipsisMenu(-1);
                                    }
                                    else {
                                        setCurrentProductEllipsisMenu(index);
                                    }
                                }
                                }>
                                <FontAwesomeIcon icon={faEllipsisVertical}
                                    size="2x"
                                    className="cursor-pointer"

                                />

                                <div className={`absolute ${currentProductEllipsisMenu === index
                                    ? "flex" : "hidden"}
                                    left-1/2 transform -translate-x-1/2 pt-[15px] w-fit bg-gray-100
                                    flex flex-col text-nowrap p-1
                                    `}>
                                    <Link className={productEllipsisMenuItemClass}
                                        href={`/Collections/All/Products/?productID=${product['product_id']}`}>
                                        <span >
                                            View Product
                                        </span>

                                    </Link>

                                    <span className={productEllipsisMenuItemClass}>
                                        TBA
                                    </span>

                                    <span className={productEllipsisMenuItemClass}>
                                        TBA
                                    </span>
                                </div>
                            </div>

                        </span>

                        {Object.keys(product)
                            .filter(pField => !['product_id', 'product_colour', 'product_name']
                                .includes(pField)).map((productField) => (
                                    <span className="mb-3" key={productField} >
                                        {productField} <br />
                                        {product[productField]}
                                    </span>
                                ))}

                        <div className="flex flex-col">
                            <p>Product Colours: </p>
                            <div className="flex flex-row justify-center">
                                {(product['product_colour'] as string[]).map((colour) => (
                                    <div className={`w-[50px] rounded-full aspect-square `}
                                        style={{ backgroundColor: `${colour.toLowerCase()}` }}
                                        key={colour}>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div >
        </div >
    </>
}