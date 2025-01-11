"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";

export interface Product {
    [key: string]: string | string[] | {}
}

export default function Products() {
    const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
    const [showProductEllipsisMenu, setShowProductEllipsisMenu] = useState(-1);
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
            <div className="p-[25px] flex md:flex-row flex-col md:justify-between ">
                <span className="text-xl font-bold md:pl-[25px]">
                    Your Current Products
                </span>
                <Link href={`/ProducerDashboard?tab=AddProduct`}
                    className="md:mt-[0px] mt-[25px]">
                    <span className=" rounded-md w-fit h-fit p-2.5 
                    hover:bg-gray-400"
                    >Add A Product</span>
                </Link>

            </div>

            <div className="flex flex-col gap-4 w-5/6 min-w-[725px] ml-[50px]">
                <table >
                    <caption className="text-start mb-[25px] 
                    italic font-bold">
                        Current Products Oustanding in Store</caption>
                    <thead className="font-bold bg-gray-500 ">
                        <tr >
                            <td className="pb-5 pt-5 border-x border-black text-center">ID</td>
                            <td className="pb-5 pt-5 border-x border-black text-center">Name</td>
                            <td className="pb-5 pt-5 border-x border-black text-center">Price</td>
                            <td className="pb-5 pt-5 border-x border-black text-center">Type</td>
                            <td className="pb-5 pt-5 border-x border-black text-center">Inventory</td>
                            <td className="pb-5 pt-5 border-x border-black text-center">Units Sold</td>
                            <td className="pb-5 pt-5 border-x border-black text-center">Total Revenue</td>
                            <td className="pb-5 pt-5 border-x border-black text-center">More</td>
                        </tr>

                    </thead>
                    <tbody >
                        {currentProducts.map((product, index) => (
                            <tr key={index} className={`${index % 2 === 0 ? "bg-gray-400" : "bg-gray-300"}`}>
                                <td className="pt-2.5 pb-2.5 border-x border-black text-center">{product['product_id'] as string}</td>
                                <td className="pt-2.5 pb-2.5 border-x border-black text-center">{product['product_name'] as string}</td>
                                <td className="pt-2.5 pb-2.5 border-x border-black text-center">{product['product_price'] as string}</td>
                                <td className="pt-2.5 pb-2.5 border-x border-black text-center">{product['product_type'] as string}</td>
                                <td className="pt-2.5 pb-2.5 border-x border-black text-center">{product['product_stock_count'] as string}</td>
                                <td className="pt-2.5 pb-2.5 border-x border-black text-center">0</td>
                                <td className="pt-2.5 pb-2.5 border-x border-black text-center">0</td>
                                <td className="pt-2.5 pb-2.5 border-x border-black text-center"><div className="relative flex items-center justify-center"
                                    onMouseEnter={() => setShowProductEllipsisMenu(index)}
                                    onMouseLeave={() => setShowProductEllipsisMenu(-1)}>
                                    <FontAwesomeIcon icon={faEllipsisH}
                                        size="2x"
                                        className="cursor-pointer"

                                    />

                                    <div className={`absolute ${showProductEllipsisMenu === index
                                        ? "flex" : "hidden"}
                                    left-1/2 transform -translate-x-1/2 pt-[15px] w-fit bg-gray-300 p-2 rounded-lg
                                    flex flex-col text-nowrap p-1 z-10
                                    `}>
                                        <Link className={productEllipsisMenuItemClass}
                                            href={`/Collections/All/Products/?productID=${product['product_id']}`}>
                                            <span >
                                                View Product
                                            </span>

                                        </Link>

                                        <span className={productEllipsisMenuItemClass}>
                                            Update Product
                                        </span>

                                        <span className={productEllipsisMenuItemClass}>
                                            Recall Product
                                        </span>
                                    </div>
                                </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div >
        </div >
    </>
}
