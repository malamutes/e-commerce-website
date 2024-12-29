"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Product } from "@/app/ProducerDashboard/components/Products";

export default function ProductPage() {

    const [currentProduct, setCurrentProduct] = useState<Product[]>([]);
    const searchParams = useSearchParams();

    useEffect(() => {
        const productID = searchParams?.get("productID") ?? "";

        const getProduct = async () => {
            const response = await fetch(`/api/Collections/Products?productID=${productID}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const reply = await response.json();

            if (response.ok) {
                console.log(reply);
                setCurrentProduct(reply);
            }
            else {
                alert("NO item found!")
                console.log(response.status, response.statusText);
            }
        };

        getProduct();


    }, [searchParams]);

    return <>
        PRODUCT VIEW
        <div className="flex flex-col">
            {Object.keys(currentProduct[0] ?? []).map((productField) => (
                <div key={productField}>
                    <span>
                        {productField} -- {currentProduct[0][productField]}
                    </span>
                </div>
            ))}
        </div>

    </>
}