'use client';

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react";
import { Product } from "@/app/ProducerDashboard/components/Products";
import { clothingColours, clothingSizes, sexCategory } from "@/app/CollectionTypes";

export default function CollectionCategory() {
    const params = useParams();

    const saleCategory: string = decodeURIComponent((params!['SaleCategory'] as string)) ?? "";
    const [saleProducts, setSaleProducts] = useState<Product[]>([]);
    console.log(saleCategory);

    useEffect(() => {
        const getSaleCategoryProducts = async () => {
            const response = await fetch(`/api/Collections/${saleCategory}`, {
                method: "GET",
                headers: {
                    'Accept': 'application/json'
                }
            })

            const reply = await response.json();

            if (response.ok) {
                console.log(reply);
                setSaleProducts(reply);
            }
            else {
                console.log(response.status, response.statusText);
            }
        }

        getSaleCategoryProducts();
    }, [])

    return <>
        {saleCategory}
        <div className="grid grid-cols-4">
            {saleProducts.map((product, index) => (
                <div key={index} className="bg-gray-200 m-5">
                    <p>
                        {product['product_name']}
                    </p>

                    <p>
                        {product['product_audience']}
                    </p>

                    <p>
                        {product['product_colour']}
                    </p>

                    <p>
                        {product['product_producer']}
                    </p>

                    <p>
                        {product['product_sales_category']}
                    </p>

                    <p>
                        {product['product_type']}
                    </p>

                    <p>
                        {product['product_size']}
                    </p>

                    <p>
                        {product['product_price']}
                    </p>
                </div>
            ))}
        </div>


    </>
}