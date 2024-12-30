"use client";
import { Product } from "@/app/ProducerDashboard/components/Products";
import ProductCard from "./ProductCard";

interface DisplayProductProps {
    categoryProducts: Product[]
}

export default function DisplayProducts(props: DisplayProductProps) {
    return <>
        <div className="grid grid-cols-3 pl-5">
            {(props.categoryProducts).map((product, index) => (
                <ProductCard key={index}
                    product={product}
                />
            ))}
        </div>
    </>

}