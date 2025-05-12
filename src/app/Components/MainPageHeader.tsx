"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight, faArrowAltCircleLeft } from "@fortawesome/free-regular-svg-icons";
import { clampFunc } from "./Carousel";
import { ProductCardInterface } from "../DataInterfaces";
import ProductCard from "../Collections/components/ProductCard";
import { useMatchMediaQuery } from "../MatchMediaQuery";
import LoadingComponent from "./LoadingComponent";
import ObserverIntersectionUseEffect from "@/app/ObserverUseEffect";

interface MainPageHeaderProps {
    categoryArray: ProductCardInterface[],
    categoryTitle: string,
    categories?: boolean,
    showButton?: boolean,
    headerStyle?: string,
    brand?: boolean
}

const urlNavLinkMap: { [key: string]: string } = {
    'New Arrivals': `/Collections?featuredCategory=New%20Arrivals&clothingCategory=All`,
    'Popular Brands': `/Brands`,
    'Exclusive': `/Collections?featuredCategory=Exclusive&clothingCategory=All`,
    'Best Sellers': `/Collections?featuredCategory=Best%20Sellers&clothingCategory=All`,
    'On Sale': `/Collections?featuredCategory=Sale&clothingCategory=All`,
    'Categories': `/Collections/?clothingCategory=All`,
}

export default function MainPageHeader(props: MainPageHeaderProps) {

    const [distance, setDistance] = useState(0);
    const totalNumItems = props.categoryArray.length;

    const [scrollPast, setScrollPast] = useState(false);

    const ComponentRef = useRef<HTMLDivElement>(null);

    const checkScrollPast = ObserverIntersectionUseEffect({
        scrollPast: scrollPast, setScrollPast: setScrollPast,
        compRef: ComponentRef, threshold: 0.1
    }) // eslint-disable-line @typescript-eslint/no-unused-vars

    if (checkScrollPast) {

    }

    //console.log(checkScrollPast);
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
        <div className={`flex flex-col mt-[50px] shadow-xl p-[25px] rounded-[25px] 
        ${props.headerStyle} min-w-[250px] transition-all duration-1000 ${scrollPast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1/2"}`}
            ref={ComponentRef}>
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
                        className={`2xs:pl-[12.5px] mt-[10px] 2xs:mt-[0px] ${distance === 0 ? "text-gray-400" : "cursor-pointer hover:scale-110"}
                            md:text-4xl text-3xl transition-all duration-300 `}
                        onClick={() => setDistance(
                            distance => clampFunc(distance + 100, -((1 / (numItemsDisplay / totalNumItems)) - 1) * 100, 0)
                        )} />
                    {/* the 10 here is because i hardcoded backend to take 10 items can be dynamic if needed*/}

                    <FontAwesomeIcon icon={faArrowAltCircleRight}
                        className={`pl-[12.5px] mt-[10px] 2xs:mt-[0px] ${distance === -((1 / (numItemsDisplay / totalNumItems)) - 1) * 100 ? "text-gray-400" : "cursor-pointer hover:scale-110"}
                            md:text-4xl text-3xl transition-all duration-300`}
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
                            <div key={index} className="pl-2 pr-2 pt-1 pb-4 flex flex-grow"
                                style={{
                                    minWidth: `${100 / numItemsDisplay}%`,
                                }}
                            >
                                {/* we are setting it to 5 items at a time so it will always shift via 50 % we can obv 
                                make it more general by passing in props too but that refractoring can come later when i need to adapt it*/}
                                {props.categories === true ? (
                                    <Link className="w-full aspect-square bg-gray-300 grid place-items-center" key={index}
                                        href={`/Collections?clothingCategory=${product.product_producer}`}> {/* TBA To sort stuff out via brands*/}
                                        <span>
                                            {product.product_producer}
                                        </span>
                                    </Link>
                                )
                                    :
                                    (
                                        props.brand ? (
                                            <Link className="w-full aspect-square bg-gray-300 grid place-items-center" key={index}
                                                href={`/Collections?brand=${product.product_producer}`}> {/* TBA To sort stuff out via brands*/}
                                                <span>
                                                    {product.product_producer}
                                                </span>
                                            </Link>
                                        )
                                            :
                                            (
                                                <ProductCard
                                                    key={index}
                                                    product={product}
                                                    style={{ boxShadow: 'none' }}
                                                    showTags={false}
                                                />
                                            )

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
                <Link className="bg-black text-white w-fit p-4
           rounded-full mx-auto mt-[5px] font-bold text-center
           transition-all duration-300
           hover:ring-[2.5px] hover:ring-black hover:ring-offset-[5px] hover:bg-white hover:text-black"
                    href={urlNavLinkMap[props.categoryTitle]}>
                    SHOP {(props.categoryTitle).toUpperCase()}</Link>
            )}

        </div>
    </>
}

