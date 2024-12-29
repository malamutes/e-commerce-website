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

    //redo sales category neon db to a json file to fit more than 1 category
    return <>
        {saleCategory}

        <div className="grid grid-cols-4">
            {saleProducts.map((product, index) => (
                <div key={index} className="bg-gray-200 m-5">
                    {Object.keys(product).map((field) => (
                        <p key={field}>
                            {product[field]}
                        </p>

                    ))}
                </div>
            ))}
        </div>


    </>
}