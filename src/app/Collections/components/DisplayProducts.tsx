"use client";

import ProductCard from "./ProductCard";
import { ProductCardType } from "@/app/DataInterfaces";

interface DisplayProductProps {
    categoryProducts: ProductCardType[]
}

export default function DisplayProducts(props: DisplayProductProps) {
    return <>
        <div className="grid lg:grid-cols-3 grid-cols-2 gap-5 w-fit">
            {props.categoryProducts.length === 0
                ? (<span>
                    NO ITEMS FOUND!
                </span>)
                : (props.categoryProducts).map((product, index) => (
                    <ProductCard key={index}
                        product={product}
                    />
                ))}
        </div>
    </>

}