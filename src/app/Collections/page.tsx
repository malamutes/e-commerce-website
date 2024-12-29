"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Product } from "../ProducerDashboard/components/Products";
import { clothingCategory, clothingColours, clothingSizes, salesCategories, sexCategory, sortFeatureCategory } from "../CollectionTypes";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Collections() {
    const pathname = useRef(usePathname()).current;
    const params = useSearchParams();
    const router = useRouter();

    console.log(params);

    const [currCat, setCurrCat] = useState(params?.get('clothingCategory'));
    const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
    const [sexFilter, setSexFilter] = useState<string[]>([]);
    const [colourFilter, setColourFitler] = useState<string[]>([]);
    const [sizeFilter, setSizeFilter] = useState<string[]>([]);
    const [sortingFilter, setSortingFilter] = useState<string>("");
    //0 is no check for sale 1 is check for sale
    const [onSale, setOnSale] = useState(0);
    const [clothingFilter, setClothingFilter] = useState<string>(params?.get('clothingCategory') ?? "");
    const [queryUrl, setQueryUrl] = useState<string>("");


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
        const sexQuery = sexFilter.map((sex) => `&sex=${sex}`).join("");
        const colQuery = colourFilter.map((colour) => `&colour=${colour}`).join("");
        const sizeQuery = sizeFilter.map((size) => `&size=${size}`).join("");
        const clothingQuery = `${clothingFilter}`;
        const saleQuery = `&${onSale === 0 ? "saleCheck=false" : "saleCheck=true"}`
        const sortQuery = `&sortBy=${sortingFilter}`

        router.push(`?clothingCategory=${clothingQuery}${sexQuery}${colQuery}${sizeQuery}${saleQuery}${sortQuery}`);

        //console.log(pathname + "?" + sexQuery);
        setQueryUrl(pathname + "?clothingCategory=" + clothingQuery + sexQuery + colQuery + sizeQuery + saleQuery + sortQuery);

    }, [sexFilter, colourFilter, sizeFilter, clothingFilter, onSale, sortingFilter]);

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
            console.log(reply);
        }
        else {
            console.log(response.status, response.statusText)
        }
    }


    useEffect(() => {
        const clothingCategory = params?.get('clothingCategory');
        if (clothingCategory) {
            setClothingFilter(clothingCategory);
        }
    }, [params]);


    useEffect(() => {
        getFilterResults();

    }, [queryUrl, currCat]);

    return <>
        COLLECTIONS
        <div className="grid grid-cols-2">
            <div className="flex flex-col bg-gray-400 w-fit">
                {clothingCategory.map((clothing) => (
                    <span key={clothing} onClick={() => {
                        if (clothingFilter !== clothing) {
                            setClothingFilter(clothing);
                        }
                        else {
                            setClothingFilter("");
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

            <div className="flex flex-col bg-gray-400 w-fit">
                <span key={"onSaleCheck"}>
                    <input
                        type="checkbox"
                        id={"onSaleCheck"}
                        value={"Sale"}
                        checked={onSale === 1}
                        onChange={() => {
                            if (onSale === 1) {
                                setOnSale(0)
                            }
                            else if (onSale === 0) {
                                setOnSale(1);
                            }
                        }}
                        className="mr-2"
                    />
                    <label htmlFor={"onSaleCheck"}>{"Sale"}</label>
                </span>
            </div>
        </div>

        <div className="flex flex-col bg-gray-400 w-fit">
            {sortFeatureCategory.map((sorting) => (
                <span key={sorting} onClick={() => {
                    if (sortingFilter !== sorting) {
                        setSortingFilter(sorting);
                    }
                    else {
                        setSortingFilter("");
                    }

                }}
                    className={`${sortingFilter === sorting ? "font-black font-lg" : "font-medium font-md"} cursor-pointer`}
                >
                    {sorting}
                </span>
            ))}
        </div>

        <div className="grid grid-cols-3">
            {(categoryProducts).map((product, index) => (
                <div key={index} className="m-5 bg-gray-200">
                    <p>
                        {product["product_name"]}
                    </p>
                    <p>
                        {product["product_price"]}
                    </p>

                    <span>
                        {product["product_audience"]}
                    </span>

                    <p>
                        {product["product_colour"]}
                    </p>

                    <span>
                        {product["product_size"]}
                    </span>

                    <span>
                        {product["product_sales_category"]}
                    </span>


                </div>
            ))}

        </div>
    </>
}