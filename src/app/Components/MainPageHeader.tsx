"use client";

import Link from "next/link";
import ProductCard from "../Collections/components/ProductCard";
import { Product } from "../ProducerDashboard/components/Products";
import { useEffect, useState } from "react";

interface MainPageHeaderProps {
    categoryArray: Product[],
    categoryTitle: string,
}

export default function MainPageHeader(props: MainPageHeaderProps) {
    return <>
        <div className="flex flex-col mt-[50px] shadow-xl p-[25px] rounded-[25px]">
            <div className="flex flex-row items-center justify-between">
                <hr className="border-t-2 border-gray-300 w-5/12 " />

                <span className="text-2xl font-[600] text-nowrap w-2/12 text-center">
                    {props.categoryTitle}
                </span>

                <div className="flex flex-row w-5/12 items-center">
                    <hr className="border-t-2 border-gray-300 w-full" />
                </div>
            </div>

            <div className="overflow-hidden">
                <div className="flex flex-row mt-[25px]">
                    {props.categoryArray.map((product, index) => (
                        <ProductCard
                            key={index}
                            product={product}
                            style={{
                                maxWidth: '20%',
                                marginRight: `${index !== props.categoryArray.length - 1 ? "25px" : "0px"}`
                            }}
                            showTags={false}
                        />
                    ))}
                </div>
            </div>

            <Link className="bg-black text-white w-fit p-5 
            rounded-full mx-auto mt-[25px] font-bold"
                href={"/Collections/New Arrivals"}>
                SHOP {(props.categoryTitle).toUpperCase()}</Link>

        </div>

    </>
}


export function MainPageHeaderBrand(props: MainPageHeaderProps) {

    return <>
        <div className="flex flex-col mt-[50px] shadow-xl p-[25px] rounded-[25px]">
            <div className="flex flex-row items-center justify-between">
                <hr className="border-t-2 border-gray-300 w-5/12 " />

                <span className="text-2xl font-[600] text-nowrap w-2/12 text-center">
                    {props.categoryTitle}
                </span>

                <div className="flex flex-row w-5/12 items-center">
                    <hr className="border-t-2 border-gray-300 w-full" />
                </div>



            </div>

            <div className="overflow-hidden">
                <div className="flex flex-row mt-[25px]">
                    {props.categoryArray.map((product, index) => (
                        <Link className="w-full aspect-square bg-gray-300 grid place-items-center m-5" key={index}
                            href={product['product_producer'] ? "/" : `/Collections?clothingCategory=${product['product_type']}`}> {/* TBA To sort stuff out via brands*/}
                            <span>
                                {product['product_producer'] ?? product['product_type']}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            <Link className="bg-black text-white w-fit p-5 
            rounded-full mx-auto mt-[25px] font-bold"
                href={"/Collections/New Arrivals"}>
                SHOP {(props.categoryTitle).toUpperCase()}</Link>

        </div>

    </>
}
