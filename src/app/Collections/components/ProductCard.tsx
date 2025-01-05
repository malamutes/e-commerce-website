"use client";
import { Product } from "@/app/ProducerDashboard/components/Products";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faCrown, faTags, IconDefinition, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface ProductCard {
    product: Product,
    style?: React.CSSProperties,
    showTags?: boolean
}

//for now just assume the image aspect ratio is 4:3 and in db it is 800:600px
const productSalesCategoryMap: { [key: string]: string } = {
    'Exclusive': 'gold',
    'Best Sellers': 'green',
    'Sale': 'red',
    'New Arrivals': 'cyan'
}

const productSalesIconMap: { [key: string]: IconDefinition } = {
    'Exclusive': faCrown,
    'Best Sellers': faTrophy,
    'Sale': faTags,
    'New Arrivals': faBoxOpen
}

export default function ProductCard(props: ProductCard) {

    return <>
        <Link
            className="w-fit"
            href={`/Collections/All/Products/?productID=${props.product['product_id']}`}
            style={props.style}>

            <div className="flex flex-col text-center w-fit mx-auto
                max-w-[350px] shadow-lg cursor-pointer bg-gray-300">
                <Image src={props.product['product_images'][0]}
                    alt={props.product['product_images'][0]}
                    width={600}
                    height={600}
                />

                <div className="flex flex-col bg-gray-300 pb-5 ">
                    <span className="mt-2 italic text-sm">
                        {props.product['product_producer']}
                    </span>

                    <span className="font-bold text-sm">
                        {props.product['product_name']}
                    </span>

                    <span className="mb-2 text-sm">
                        ${props.product['product_price']}
                    </span>

                    <div className={`flex sm:flex-row flex-col mx-auto ${props.showTags === false ? "hidden" : ""}`}>
                        {(props.product['product_sales_category'] as string[])
                            .filter(cat => cat !== 'Regular')
                            .map((category, index) => (
                                <div key={index}
                                    className="p-1.5 flex items-center"
                                    style={{
                                        backgroundColor:
                                            `${productSalesCategoryMap[category]}`
                                    }}>

                                    <span className="text-sm">
                                        {category}
                                    </span>


                                    {productSalesIconMap[category]
                                        ? (<FontAwesomeIcon
                                            className="ml-2 text-xs"
                                            icon={productSalesIconMap[category]} />)
                                        : (null)}
                                </div>
                            ))}
                    </div>
                </div>

            </div>
        </Link>

    </>
}