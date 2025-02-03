"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight, faArrowAltCircleLeft } from "@fortawesome/free-regular-svg-icons";
import { clampFunc } from "./Carousel";
import { ProductCardInterface } from "../DataInterfaces";
import ProductCard from "../Collections/components/ProductCard";
import { useMatchMediaQuery } from "../MatchMediaQuery";
import LoadingComponent from "./LoadingComponent";

interface MainPageHeaderProps {
    categoryArray: ProductCardInterface[],
    categoryTitle: string,
    categories?: boolean,
    showButton?: boolean,
    headerStyle?: string
}

const urlNavLinkMap: { [key: string]: string } = {
    'New Arrivals': `/Collections?featuredCategory=New%20Arrivals&clothingCategory=All`,
    'Popular Brands': '/Collections/TBA FEATURE',
    'Exclusive': `/Collections?featuredCategory=Exclusive&clothingCategory=All`,
    'Best Sellers': `/Collections?featuredCategory=Best%20Sellers&clothingCategory=All`,
    'On Sale': `/Collections?featuredCategory=Sale&clothingCategory=All`,
    'Categories': `/Collections/?clothingCategory=All`,
}

export default function MainPageHeader(props: MainPageHeaderProps) {

    const [distance, setDistance] = useState(0);
    const totalNumItems = props.categoryArray.length;


    const [numItemsDisplay, setNumItemsDisplay] = useState(5);
    const more1024px = useMatchMediaQuery({ size: 1024 });
    const more640px = useMatchMediaQuery({ size: 640 });

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


    return <>
        <div className={`flex flex-col mt-[50px] shadow-xl p-[25px] rounded-[25px] ${props.headerStyle} min-w-[250px]`}>
            <div className="flex 2xs:flex-row flex-col items-center justify-between">
                <div className="w-full p-[25px] sm:block hidden">
                    <hr className="border-t-2 border-gray-300" />
                </div>


                <span className="text-2xl font-[600] text-nowrap text-center">
                    {props.categoryTitle}
                </span>

                <div className="flex flex-row w-full items-center 2xs:pl-[25px] 2xs:justify-end justify-center ">
                    <hr className="border-t-2 border-gray-300 w-full sm:block hidden" />
                    <FontAwesomeIcon icon={faArrowAltCircleLeft}
                        className={`2xs:pl-[12.5px] mt-[10px] 2xs:mt-[0px] ${distance === 0 ? "text-gray-400" : "cursor-pointer"}
                            md:text-4xl text-3xl`}
                        onClick={() => setDistance(
                            distance => clampFunc(distance + 100, -((1 / (numItemsDisplay / totalNumItems)) - 1) * 100, 0)
                        )} />
                    {/* the 10 here is because i hardcoded backend to take 10 items can be dynamic if needed*/}

                    <FontAwesomeIcon icon={faArrowAltCircleRight}
                        className={`pl-[12.5px] mt-[10px] 2xs:mt-[0px] ${distance === -((1 / (numItemsDisplay / totalNumItems)) - 1) * 100 ? "text-gray-400" : "cursor-pointer"}
                            md:text-4xl text-3xl`}
                        onClick={() => setDistance(
                            distance => clampFunc(distance - 100, -((1 / (numItemsDisplay / totalNumItems)) - 1) * 100, 0)
                        )} />

                </div>
            </div>

            <div className="overflow-hidden">
                <div className="flex flex-row mt-[25px]"
                    style={{
                        transition: 'transform 1s ease-in-out',
                        transform: `translateX(${distance}%)`
                    }}>
                    {props.categoryArray.length !== 0 ? (
                        props.categoryArray.map((product, index) =>
                        (
                            <div key={index} className="pl-2 pr-2 pt-0 pb-4"
                                style={{
                                    minWidth: `${100 / numItemsDisplay}%`,
                                }}
                            >
                                {/* we are setting it to 5 items at a time so it will always shift via 50 % we can obv 
                                make it more general by passing in props too but that refractoring can come later when i need to adapt it*/}
                                {props.categories === true ? (
                                    <Link className="w-full aspect-square bg-gray-300 grid place-items-center" key={index}
                                        href={product.product_producer ? "/" : `/Collections?clothingCategory=${product.product_type}`}> {/* TBA To sort stuff out via brands*/}
                                        <span>
                                            {product.product_producer ?? product.product_type}
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


                        ))
                    ) :
                        (
                            <LoadingComponent
                                width="100"
                                height="200"
                                minHeight="min-h-[275px]"
                            />
                        )}
                </div>
            </div>

            {props.showButton === false ? (null) : (
                <Link className="bg-black text-white w-fit p-5 
            rounded-full mx-auto mt-[5px] font-bold text-center"
                    href={urlNavLinkMap[props.categoryTitle]}>
                    SHOP {(props.categoryTitle).toUpperCase()}</Link>
            )}

        </div>
    </>
}

