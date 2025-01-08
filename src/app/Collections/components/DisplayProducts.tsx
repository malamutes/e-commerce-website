"use client";
import { Product } from "@/app/ProducerDashboard/components/Products";
import ProductCard from "./ProductCard";

interface DisplayProductProps {
    categoryProducts: Product[]
}

export default function DisplayProducts(props: DisplayProductProps) {
    return <>
        <div className="grid lg:grid-cols-3 grid-cols-2 gap-y-[15px] 
        gap-x-[15px] w-fit">
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