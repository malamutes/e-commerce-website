"use client";
import FilterTabLarge, { FilterTabSmall } from "./components/FilterTab";
import DisplayProducts from "./components/DisplayProducts";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Product } from "../ProducerDashboard/components/Products";
import { ProductCardInterface } from "../DataInterfaces";

export default function Collections() {
    const pathname = useRef(usePathname()).current;
    const params = useSearchParams();
    const router = useRouter();

    const [currCat, setCurrCat] = useState(params?.get('clothingCategory'));
    const [categoryProducts, setCategoryProducts] = useState<ProductCardInterface[]>([]);
    const [sexFilter, setSexFilter] = useState<string[]>([]);
    const [colourFilter, setColourFilter] = useState<string[]>([]);
    const [sizeFilter, setSizeFilter] = useState<string[]>([]);
    const [sortingFilter, setSortingFilter] = useState<string>("");
    //0 is no check for sale 1 is check for sale
    const [onSale, setOnSale] = useState("");
    const [clothingFilter, setClothingFilter] = useState<string>(params?.get('clothingCategory') ?? "");
    const [queryUrl, setQueryUrl] = useState<string>("");

    useEffect(() => {
        console.log(params?.getAll("size"));
        if (params?.get("saleCheck")) {
            setOnSale(params?.get("saleCheck") ?? "")
        }
        if (params?.get("sortBy")) {
            setSortingFilter(params?.get("sortBy") ?? "")
        }
        if (params?.getAll("size")) {
            setSizeFilter(params?.getAll("size"))
        }
        if (params?.getAll("sex")) {
            setSexFilter(params?.getAll("sex"))
        }
        if (params?.getAll("colour")) {
            setColourFilter(params?.getAll("colour"))
        }
    }, [])

    useEffect(() => {
        const sexQuery = sexFilter.map((sex) => `&sex=${sex}`).join("");
        const colQuery = colourFilter.map((colour) => `&colour=${colour}`).join("");
        const sizeQuery = sizeFilter.map((size) => `&size=${size}`).join("");
        const clothingQuery = `${clothingFilter}`;
        const saleQuery = `${onSale !== "" ? "&saleCheck=" : ""}${onSale}`
        const sortQuery = `${sortingFilter !== "" ? "&sortBy=" : ""}${sortingFilter}`

        router.replace(`?clothingCategory=${clothingQuery}${sexQuery}${colQuery}${sizeQuery}${saleQuery}${sortQuery}`);

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
        else if (response.status === 404) {
            setCategoryProducts([]);
            console.log("NO ITEMS FOUND FOR COLLECTION QUERY!");
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
        if (queryUrl !== "") {
            getFilterResults();
        }

    }, [queryUrl, currCat]);

    return (
        <div className="flex md:flex-row flex-col mt-[50px] lg:container mx-auto p-5">
            <div className="w-1/5 mr-[30px] md:block hidden">
                <FilterTabLarge
                    sexFilter={sexFilter}
                    setSexFilter={setSexFilter}
                    colourFilter={colourFilter}
                    setColourFilter={setColourFilter}
                    sizeFilter={sizeFilter}
                    setSizeFilter={setSizeFilter}
                    sortingFilter={sortingFilter}
                    setSortingFilter={setSortingFilter}
                    onSale={onSale}
                    setOnSale={setOnSale}
                    clothingFilter={clothingFilter}
                    setClothingFilter={setClothingFilter}
                />
            </div>

            <div className="w-full mr-[30px] md:hidden block">
                <FilterTabSmall
                    sexFilter={sexFilter}
                    setSexFilter={setSexFilter}
                    colourFilter={colourFilter}
                    setColourFilter={setColourFilter}
                    sizeFilter={sizeFilter}
                    setSizeFilter={setSizeFilter}
                    sortingFilter={sortingFilter}
                    setSortingFilter={setSortingFilter}
                    onSale={onSale}
                    setOnSale={setOnSale}
                    clothingFilter={clothingFilter}
                    setClothingFilter={setClothingFilter}
                />
            </div>

            <div className="md:w-4/5">
                <DisplayProducts
                    categoryProducts={categoryProducts}
                />
            </div>

        </div>
    );
}