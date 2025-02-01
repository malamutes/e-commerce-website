"use client";

import ProductCard from "./ProductCard";
import { ProductCardInterface } from "@/app/DataInterfaces";

interface DisplayProductProps {
    categoryProducts: ProductCardInterface[]
}

export default function DisplayProducts(props: DisplayProductProps) {
    return <>
        <div className="grid lg:grid-cols-3 grid-cols-2 gap-5 w-fit min-w-[250px]">
            {props.categoryProducts.length === 0
                ? (<span >
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