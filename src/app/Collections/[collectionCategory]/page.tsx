'use client';

import Link from "next/link";
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react";
import { Product } from "@/app/ProducerDashboard/components/Products";
import { clothingColours, sexCategory } from "@/app/CollectionTypes";
import { useRouter, usePathname, } from "next/navigation";


export default function CollectionCategory() {

    const pathname = useRef(usePathname()).current;

    const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
    const [sexFilter, setSexFilter] = useState<string[]>([]);
    const [queryUrl, setQueryUrl] = useState<string>("");

    const router = useRouter();

    const getFilterResults = async () => {
        const response = await fetch(`
            /api/${queryUrl}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })

        const reply = await response.json();

        if (response.ok) {
            console.log("Items retrieved successfully!");
            setCategoryProducts(reply);
        }
        else {
            console.log(response.status, response.statusText)
        }
    }

    const handleSexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const justSelectedSex = e.target.value;
        setSexFilter((sexFilter) => {

            if (sexFilter.includes(justSelectedSex)) {
                return sexFilter.filter(sex => sex !== justSelectedSex);
            }

            return [...sexFilter, justSelectedSex];
        });
    };

    useEffect(() => {
        const sexQuery = sexFilter.map((sex) => `sex=${sex}`).join('&');

        router.push(`?${sexQuery}`);
        //console.log(pathname + "?" + sexQuery);
        setQueryUrl(pathname + "?" + sexQuery);

    }, [sexFilter]);

    useEffect(() => {
        console.log(queryUrl);
        if (queryUrl !== "") {
            getFilterResults();
        }

    }, [queryUrl]);

    return <>
        COLLECTION CATEGORY
        <div className="flex flex-col bg-gray-400 w-fit">
            {sexCategory.map((sex) => (
                <span key={sex}>
                    <input
                        type="checkbox"
                        id={sex}
                        value={sex}
                        checked={sexFilter.includes(sex)}
                        onChange={handleSexChange}
                        className="mr-2"
                    />
                    <label htmlFor={sex}>{sex}</label>
                </span>
            ))}
        </div>
        <div className="grid grid-cols-3">
            {(categoryProducts).map((product, index) => (
                <div key={index}>
                    <p>
                        {product["product_name"]}
                    </p>
                    <p>
                        {product["product_price"]}
                    </p>

                    <span>
                        {product["product_audience"]}
                    </span>
                </div>
            ))}

        </div>

    </>
}