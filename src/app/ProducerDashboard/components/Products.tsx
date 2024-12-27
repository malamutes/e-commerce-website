"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
    [key: string]: string
}

export default function Products() {
    const [currentProducts, setCurrentProducts] = useState<Product[]>([]);

    useEffect(() => {
        const getCurrentProduct = async () => {
            const response = await fetch('/api/producerProducts', {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })

            const reply = await response.json();

            if (response.ok) {
                setCurrentProducts(reply);
                console.log(reply);
            }
            else {
                console.log(response.status, response.statusText);
            }
        };

        getCurrentProduct();
    }, []);


    return <>
        <div className="flex flex-col">
            Products
            <Link href={`/ProducerDashboard?tab=AddProduct`}>
                <span className="border-2 border-black rounded-md w-fit h-fit 
        hover:bg-gray-400"
                >ADD PRODUCTS</span>
            </Link>

            <div className="flex flex-col">
                {currentProducts.map((product, index) => (
                    <div key={index} className="flex flex-row">
                        {[Object.keys(product).map((productField) => (
                            <span key={productField} className="m-5">
                                {`${productField} : ${product[productField]}`}
                            </span>
                        ))]}
                    </div>
                ))}
            </div>
        </div>



    </>
}