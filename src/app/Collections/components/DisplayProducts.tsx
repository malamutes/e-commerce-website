"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProductCard from "./ProductCard";
import { ProductCardInterface } from "@/app/DataInterfaces";
import { faWarning } from "@fortawesome/free-solid-svg-icons";

interface DisplayProductProps {
    categoryProducts: ProductCardInterface[]
}

export default function DisplayProducts(props: DisplayProductProps) {
    return <>
        <div className="grid lg:grid-cols-3 grid-cols-2 gap-5 w-fit min-w-[250px]">
            {props.categoryProducts.length === 0
                ? (<span className="font-bold text-xl p-5">
                    <FontAwesomeIcon icon={faWarning} /> NO ITEMS FOUND!
                </span>)
                : (props.categoryProducts).map((product, index) => (
                    <ProductCard key={index}
                        product={product}
                    />
                ))}
        </div>
    </>

}