'use client';

import Link from "next/link";
import { useParams, useSearchParams, usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react";
import { Product } from "@/app/ProducerDashboard/components/Products";
import { clothingCategory, clothingColours, clothingSizes, sexCategory } from "@/app/CollectionTypes";
import { useRouter } from "next/navigation";

export default function CollectionCategory() {
    const params = useParams();
    const router = useRouter();
    const pathname = useRef(usePathname()).current;

    const saleCategory: string = decodeURIComponent((params!['SaleCategory'] as string)) ?? "";
    const [saleProducts, setSaleProducts] = useState<Product[]>([]);
    const [queryUrl, setQueryUrl] = useState<string>("");
    const [sexFilter, setSexFilter] = useState<string[]>([]);
    const [colourFilter, setColourFitler] = useState<string[]>([]);
    const [sizeFilter, setSizeFilter] = useState<string[]>([]);
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

    const [clothingFilter, setClothingFilter] = useState<string>("All");
    //redo sales category neon db to a json file to fit more than 1 category

    const handleSexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const justSelectedSex = e.target.value;
        setSexFilter((sexFilter) => {

            if (sexFilter.includes(justSelectedSex)) {
                return sexFilter.filter(sex => sex !== justSelectedSex);
            }

            return [...sexFilter, justSelectedSex];
        });
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const justSelectedColor = e.target.value;
        setColourFitler((colourFilter) => {

            if (colourFilter.includes(justSelectedColor)) {
                return colourFilter.filter(colour => colour !== justSelectedColor);
            }

            return [...colourFilter, justSelectedColor];
        });
    };

    const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const justSelectedSize = e.target.value;
        setSizeFilter((sizeFilter) => {

            if (sizeFilter.includes(justSelectedSize)) {
                return sizeFilter.filter(size => size !== justSelectedSize);
            }

            return [...sizeFilter, justSelectedSize];
        });
    };

    useEffect(() => {

        const clothingQuery = `${clothingFilter}`;
        const sexQuery = sexFilter.map((sex) => `&sex=${sex}`).join("");
        const colQuery = colourFilter.map((colour) => `&colour=${colour}`).join("");
        const sizeQuery = sizeFilter.map((size) => `&size=${size}`).join("");

        router.replace(`?clothingCategory=${clothingQuery}${sexQuery}${colQuery}${sizeQuery}`);

        //console.log(pathname + "?" + sexQuery);

        setQueryUrl(pathname + "?clothingCategory=" + clothingQuery + sexQuery + colQuery + sizeQuery);
    }, [clothingFilter, sexFilter, colourFilter, sizeFilter]);

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
            setSaleProducts(reply);
            console.log(reply);
        }
        else {
            console.log(response.status, response.statusText)
        }
    }

    useEffect(() => {
        if (queryUrl !== "") {
            getFilterResults();
        }

    }, [queryUrl]);


    return <>
        {saleCategory}

        <div className="flex flex-col bg-gray-400 w-fit">
            {clothingCategory.map((clothing) => (

                <span key={clothing} onClick={() => {
                    if (clothingFilter !== clothing) {
                        setClothingFilter(clothing);
                    }
                    else {
                        setClothingFilter("All");
                    }

                }}
                    className={`${clothingFilter === clothing ? "font-black font-lg" : "font-medium font-md"} cursor-pointer`}
                >
                    {clothing}
                </span>
            ))}
        </div>

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

        <div className="flex flex-col bg-gray-500 w-fit mt-5">
            {clothingColours.map((colour) => (
                <span key={colour}>
                    <input
                        type="checkbox"
                        id={colour}
                        value={colour}
                        checked={colourFilter.includes(colour)}
                        onChange={handleColorChange}
                        className="mr-2"
                    />
                    <label htmlFor={colour}>{colour}</label>
                </span>
            ))}
        </div>

        <div className="flex flex-col bg-gray-500 w-fit mt-5">
            {clothingSizes.map((size) => (
                <span key={size}>
                    <input
                        type="checkbox"
                        id={size}
                        value={size}
                        checked={sizeFilter.includes(size)}
                        onChange={handleSizeChange}
                        className="mr-2"
                    />
                    <label htmlFor={size}>{size}</label>
                </span>
            ))}
        </div>

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