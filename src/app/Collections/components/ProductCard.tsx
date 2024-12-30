"use client";
import { Product } from "@/app/ProducerDashboard/components/Products";

interface ProductCard {
    product: Product
}

export default function ProductCard(props: ProductCard) {
    return <>
        <div className="m-5 bg-gray-200">
            <p>
                {props.product["product_name"]}
            </p>
            <p>
                {props.product["product_price"]}
            </p>

            <span>
                {props.product["product_audience"]}
            </span>

            <p>
                {props.product["product_colour"]}
            </p>

            <span>
                {props.product["product_size"]}
            </span>

            <span>
                {props.product["product_sales_category"]}
            </span>

            <span>
                {props.product["product_images"]}
            </span>
        </div>
    </>
}