"use client";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faCrown, faTags, IconDefinition, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import WishlistBookmark from "@/app/components/WishlistBookmark";
import { ProductCardInterface } from "@/app/DataInterfaces";
import { SetStateAction, useState } from "react";

//for now just assume the image aspect ratio is 4:3 and in db it is 800:600px
const productSalesCategoryMap: { [key: string]: string } = {
    'Exclusive': 'rgba(211, 183, 23, 0.75)',
    'Best Sellers': 'rgba(0, 128, 0, 0.75)',
    'Sale': 'rgba(255, 0, 0, 0.75)',
    'New Arrivals': 'rgba(0, 255, 255, 0.75)'
};

const productSalesIconMap: { [key: string]: IconDefinition } = {
    'Exclusive': faCrown,
    'Best Sellers': faTrophy,
    'Sale': faTags,
    'New Arrivals': faBoxOpen
}

interface ProductCard {
    product: ProductCardInterface,
    style?: React.CSSProperties,
    showTags?: boolean,
    seachBarSetShow?: React.Dispatch<SetStateAction<boolean>>;
    seachBarQuery?: React.Dispatch<SetStateAction<string>>
}

interface ProductCardSalesCategory {
    category: string
}

function ProductCardSalesCategory(props: ProductCardSalesCategory) {

    const [showCategoryName, setShowCategoryName] = useState(false);

    return (
        <div className="relative w-fit"
            onMouseLeave={() => setShowCategoryName(false)}
            onMouseEnter={() => setShowCategoryName(true)}
        >
            <div
                className="p-2 grid place-items-center rounded-full"
                style={{
                    background:
                        `${productSalesCategoryMap[props.category]}`,
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)", // For Safari
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "50%",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)"
                }}>
                {
                    productSalesIconMap[props.category]
                        ? (<FontAwesomeIcon
                            className="3xs:text-[20px] text-[14px]"
                            icon={productSalesIconMap[props.category]} />)
                        : (null)
                }
            </div >
            <div
                className={`absolute top-full left-0 w-fit bg-gray-600 text-white px-2 py-1 rounded left-1/2 -translate-x-1/2
                transition-opacity duration-300 mt-[5px]
                ${showCategoryName ? "opacity-100" : "opacity-0 pointer-events-none"} whitespace-nowrap`}
            >
                {props.category}
            </div>
        </div>
    )
}

export default function ProductCard(props: ProductCard) {

    return <>
        {props.product['product_id'] ? (<div className="relative h-full">
            <div
                className="flex flex-col text-center w-fit mx-auto max-w-[600px] shadow-lg cursor-pointer h-full 
                    transition-all duration-500 bg-gray-400 hover:-translate-y-4 hover:ring-2 
                    hover:ring-black hover:ring-opacity-50 hover:shadow-black/75">
                <Link
                    href={`/Collections/All/Products/?productID=${props.product['product_id']}`}
                    style={props.style}
                    onClick={() => {
                        if (props.seachBarSetShow && props.seachBarQuery) {
                            props.seachBarSetShow(false);
                            props.seachBarQuery("")
                        }
                    }}
                >
                    <div style={{ zIndex: 0 }}>
                        <Image src={(props.product['product_images'])[0]}
                            alt={(props.product['product_images'])[0]}
                            width={600}
                            height={600}
                        />
                    </div>

                    <div
                        className="flex flex-col bg-gray-400 pb-5 gap-1 p-1 flex-grow justify-center">
                        <span className="mt-2 italic text-sm  break-word">
                            {props.product.product_producer}
                        </span>

                        <span className="font-bold text-sm break-word">
                            {props.product.product_name}
                        </span>

                        <span className="mb-2 text-sm">
                            {props.product.product_sale_price > 0 && props.product.product_sales_category.includes('Sale')
                                ?
                                (
                                    <div className="flex flex-col gap-3">
                                        <span>
                                            <span className="text-red-600 font-bold mr-[2.5px]"> SALE ${props.product.product_sale_price}</span> <span className="line-through"> ${props.product.product_price}</span>
                                        </span>
                                    </div>

                                )
                                :
                                (
                                    <span>
                                        ${props.product.product_price}
                                    </span>
                                )}

                        </span>

                        <div
                            className={`2xs:w-full flex flex-row justify-center justify-items-center
                             mx-auto 3xs:gap-2 gap-1.5`}>
                            {(props.product.product_sales_category ?? [])
                                .filter(cat => cat !== 'Regular')
                                .map((category, index) => (
                                    <ProductCardSalesCategory
                                        category={category}
                                        key={index}
                                    />
                                ))}
                        </div>
                    </div>
                </Link>

                <div
                    className="absolute top-0 right-0 m-2">
                    <WishlistBookmark
                        currentItemBrand={props.product.product_producer ?? "NO CURRENT ITEM BRAND FOUND"}
                        currentItemImage={(props.product.product_images)[0] ?? "NO CURRENT ITEM IMAGE FOUND"}
                        currentItemName={props.product.product_name ?? "NO CURRENT ITEM NAME FOUND"}
                        currentItemID={props.product.product_id ?? "NO CURRENT ITEM ID FOUND"}
                    />
                </div>
            </div>



        </div>) : (null)}


    </>
}