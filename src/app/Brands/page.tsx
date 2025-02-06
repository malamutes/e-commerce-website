"use client";

import { useEffect, useState } from "react";
import LoadingComponent from "../components/LoadingComponent";
import { useRouter } from "next/navigation";

export default function BrandListPage() {

    const [allBrands, setAllBrands] = useState<{ [product_producer: string]: string }[]>([]);
    const [showLoadingUI, setShowLoadingUI] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const getAllBrands = async () => {
            const relatedResponse = await fetch('/api/Brands', {
                method: "GET",
                headers: {
                    'accept': 'application/json',
                },
            });

            if (relatedResponse.ok) {
                const reply = await relatedResponse.json();
                console.log(reply);
                setAllBrands(reply);
                setShowLoadingUI(false)
            }
            else {
                alert("NO brands found!")
                console.log(relatedResponse.status, relatedResponse.statusText);
            }
        }

        getAllBrands();
    }, [])

    return <>
        {showLoadingUI
            ?
            (
                <LoadingComponent
                    width="100"
                    height="100"
                    minHeight="min-h-[500px]"
                />
            )
            :
            (
                <>
                    <span className="text-center text-3xl font-bold w-full block mt-[25px]">
                        All Brands ({allBrands.length})
                    </span>
                    <div className="lg:max-w-[900px] md:w-5/6 w-full p-5 mx-auto grid lg:grid-cols-4 
                    md:grid-cols-3 2xs:grid-cols-2 grid-cols-1 gap-5 min-h-[500px] m-5 min-w-[280px]">
                        {allBrands.map((brand, index) => (
                            <div key={index} className="p-5 grid place-items-center 
                        2xs:aspect-square border-2 border-black border-opacity-0
                        hover:border-opacity-100 cursor-pointer bg-gray-300"
                                onClick={() => { router.push(`/Collections?brand=${brand.product_producer}`) }}
                            >
                                {brand.product_producer} <br />
                                ※ Brand Logo Here
                            </div>
                        ))}
                    </div>
                </>


            )
        }
    </>
}