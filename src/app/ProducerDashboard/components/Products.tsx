"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingComponent from "@/app/components/LoadingComponent";

export interface Product {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    [key: string]: string | string[] | object
}

export default function Products() {
    const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
    const gridTableLinkClass = "pt-4 pb-4 grid place-items-center rounded-xl text-white font-bold text-sm w-full "
    const [showLoadingUI, setShowLoadingUI] = useState(true);

    useEffect(() => {
        const getCurrentProducts = async () => {
            setShowLoadingUI(true);
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
            setShowLoadingUI(false);
        };

        getCurrentProducts();
    }, []);

    return <>
        <div className="flex flex-col bg-gray-100 pb-[25px] pt-[25px]">
            <div className="pr-5 pt-5 lg:pb-5 pl-5">
                <div className="flex md:flex-row flex-col md:justify-between ">
                    <span className="text-xl font-bold ">
                        Your Current Products
                    </span>
                    <Link href={`/ProducerDashboard?tab=AddProduct`}
                        className="md:mt-[0px] mt-[10px]">
                        <span className=" rounded-md w-fit h-fit p-2.5 bg-gray-600 
                        font-bold text-sm text-white hover:bg-gray-900"
                        >Add A Product</span>
                    </Link>

                </div>
                <span className="font-bold italic md:mt-[15px] mt-[25px] block">
                    Current Products Oustanding in Store
                </span>
            </div>

            <div>
                <div className="pr-5 lg:pt-5 pb-5 pl-5">
                    <div className="lg:grid hidden grid-cols-11 gap-5 font-bold text-lg p-5 bg-gray-300">
                        <span className="col-span-2">
                            Product ID
                        </span>

                        <span className="col-span-2">
                            Unit Price
                        </span>

                        <span className="col-span-2">
                            Total Sales
                        </span>

                        <span className="col-span-2">
                            Inventory
                        </span>

                        <span className="col-span-3">
                            More
                        </span>
                    </div>

                    <div className="flex flex-col gap-5 mt-5">
                        {currentProducts.length === 0 ?
                            (
                                showLoadingUI ?
                                    (
                                        <LoadingComponent
                                            width="100"
                                            height="100"
                                            minHeight="min-h-[500px]" />)
                                    :
                                    (
                                        <div className="text-center text-gray-500">No outstanding products here
                                        </div>
                                    )
                            )
                            :
                            (
                                currentProducts.map((product, index) => (
                                    <div className="grid lg:grid-cols-11 
                            3xs:grid-cols-4 grid-cols-2 lg:gap-5 gap-x-[50px] gap-y-[20px] shadow-lg p-5" key={index}>
                                        <div className="flex flex-col col-span-2 gap-2">
                                            <span className="lg:hidden inline-block font-bold underline">
                                                Product ID
                                            </span>
                                            <span>
                                                <span className="font-bold">ID: {product['product_id'] as string}</span> <br />
                                                <span className="text-gray-600 font-bold break-auto pr-5">{product['product_name'] as string}</span> <br />
                                                <span className="text-gray-800 italic"> - {product['product_type'] as string}</span>
                                            </span>
                                        </div>

                                        <span className="col-span-2 flex flex-col gap-2">
                                            <span className="lg:hidden inline-block font-bold underline">
                                                Unit Price
                                            </span>
                                            ${product['product_price'] as string}
                                        </span>

                                        <div className="flex flex-col gap-2 col-span-2">
                                            <span className="lg:hidden inline font-bold underline">
                                                Total Sales
                                            </span>
                                            <span>
                                                Units Sold: <br /> TBA
                                            </span>

                                            <span>
                                                Total Revenue: <br /> TBA
                                            </span>
                                        </div>


                                        <span className="col-span-2 flex flex-col gap-2">
                                            <span className="lg:hidden inline font-bold underline">
                                                Inventory <br />
                                            </span>
                                            {product['product_stock_count'] as string} in stock
                                        </span>

                                        <div className="col-span-3">
                                            <span className="lg:hidden inline-block font-bold underline mb-[15px]">
                                                More About Product
                                            </span>
                                            <div className="grid grid-cols-2 gap-5 col-span-3 w-full">
                                                <Link
                                                    className={`bg-blue-800 hover:bg-blue-600 text-white ${gridTableLinkClass}`}
                                                    href={`/Collections/All/Products/?productID=${product['product_id']}`}
                                                >
                                                    <span>View</span>
                                                </Link>

                                                <Link
                                                    className={`bg-yellow-600 hover:bg-orange-600 text-white ${gridTableLinkClass}`}
                                                    href={``}
                                                >
                                                    <span>Update</span>
                                                </Link>

                                                <Link
                                                    className={`bg-green-800 hover:bg-green-600 text-white ${gridTableLinkClass}`}
                                                    href={`TBA`}
                                                >
                                                    <span>Restock</span>
                                                </Link>

                                                <Link
                                                    className={`bg-red-800 hover:bg-red-600 text-white ${gridTableLinkClass}`}
                                                    href={`TBA`}
                                                >
                                                    <span>Recall</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )))}
                    </div>
                </div>
            </div>
        </div >
    </>
}
