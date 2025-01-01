"use client";

import Link from "next/link";
import ProductCard from "../Collections/components/ProductCard";
import { Product } from "../ProducerDashboard/components/Products";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight, faArrowAltCircleLeft } from "@fortawesome/free-regular-svg-icons";
import { clampFunc } from "./Carousel";

interface MainPageHeaderProps {
    categoryArray: Product[],
    categoryTitle: string,
    categories?: boolean
    numItemsDisplay: number
}

const urlNavLinkMap: { [key: string]: string } = {
    'New Arrivals': `/Collections/New Arrivals?clothingCategory=All`,
    'Popular Brands': '/Collections/Brands',
    'Exclusive': `/Collections/Exclusive?clothingCategory=All`,
    'Best Sellers': `/Collections/Best Sellers?clothingCategory=All`,
    'On Sale': `/Collections/Sale?clothingCategory=All`,
    'Categories': `/Collections/?clothingCategory=All`,
}

export default function MainPageHeader(props: MainPageHeaderProps) {

    const [distance, setDistance] = useState(0);
    const totalNumItems = props.categoryArray.length;

    return <>
        <div className="flex flex-col mt-[50px] shadow-xl p-[25px] rounded-[25px]">
            <div className="flex flex-row items-center justify-between">
                <hr className="border-t-2 border-gray-300 w-5/12 " />

                <span className="text-2xl font-[600] text-nowrap w-2/12 text-center">
                    {props.categoryTitle}
                </span>

                <div className="flex flex-row w-5/12 items-center ">
                    <hr className="border-t-2 border-gray-300 w-full" />
                    <FontAwesomeIcon icon={faArrowAltCircleLeft}
                        size="2x"
                        className={`pl-[12.5px]  ${distance === 0 ? "text-gray-400" : "cursor-pointer"}`}
                        onClick={() => setDistance(
                            distance => clampFunc(distance + 100, -((1 / (props.numItemsDisplay / totalNumItems)) - 1) * 100, 0)
                        )} />
                    {/* the 10 here is because i hardcoded backend to take 10 items can be dynamic if needed*/}
                    <FontAwesomeIcon icon={faArrowAltCircleRight}
                        size="2x"
                        className={`pl-[12.5px] ${distance === -((1 / (props.numItemsDisplay / totalNumItems)) - 1) * 100 ? "text-gray-400" : "cursor-pointer "}`}
                        onClick={() => setDistance(
                            distance => clampFunc(distance - 100, -((1 / (props.numItemsDisplay / totalNumItems)) - 1) * 100, 0)
                        )} />

                </div>
            </div>

            <div className="overflow-hidden">
                <div className="flex flex-row mt-[25px]"
                    style={{
                        transition: 'transform 1s ease-in-out',
                        transform: `translateX(${distance}%)`
                    }}>
                    {props.categoryArray.map((product, index) => (
                        <div key={index} className="pl-2 pr-2 pt-0 pb-4"
                            style={{
                                minWidth: `${100 / props.numItemsDisplay}%`,
                            }}
                        >
                            {/* we are setting it to 5 items at a time so it will always shift via 50 % we can obv 
                            make it more general by passing in props too but that refractoring can come later when i need to adapt it*/}
                            {props.categories === true ? (
                                <Link className="w-full aspect-square bg-gray-300 grid place-items-center m-5" key={index}
                                    href={product['product_producer'] ? "/" : `/Collections?clothingCategory=${product['product_type']}`}> {/* TBA To sort stuff out via brands*/}
                                    <span>
                                        {product['product_producer'] ?? product['product_type']}
                                    </span>
                                </Link>
                            ) : (
                                <ProductCard
                                    key={index}
                                    product={product}
                                    style={{ boxShadow: 'none' }}
                                    showTags={false}
                                />
                            )}

                        </div>


                    ))}
                </div>
            </div>

            <Link className="bg-black text-white w-fit p-5 
            rounded-full mx-auto mt-[25px] font-bold"
                href={urlNavLinkMap[props.categoryTitle]}>
                SHOP {(props.categoryTitle).toUpperCase()}</Link>

        </div>

    </>
}

