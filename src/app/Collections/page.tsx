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
    const [currFeatured, setCurrFeatured] = useState(params?.get('featuredCategory'));
    const [searchBarQuery, setSearchBarQuery] = useState(params?.get('searchBarQuery'));
    const [categoryProducts, setCategoryProducts] = useState<ProductCardInterface[]>([]);
    const [sexFilter, setSexFilter] = useState<string[]>([]);
    const [colourFilter, setColourFilter] = useState<string[]>([]);
    const [sizeFilter, setSizeFilter] = useState<string[]>([]);
    const [sortingFilter, setSortingFilter] = useState<string>("");
    //0 is no check for sale 1 is check for sale
    const [onSale, setOnSale] = useState("");
    const [clothingFilter, setClothingFilter] = useState<string>(params?.get('clothingCategory') ?? "");
    const [queryUrl, setQueryUrl] = useState<string>("");

    const [totalQueryCount, setTotalQueryCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

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
        const clothingQuery = `${clothingFilter !== "" ? clothingFilter : "All"}`;
        const saleQuery = `${onSale !== "" ? "&saleCheck=" : ""}${onSale}`
        const sortQuery = `${sortingFilter !== "" ? "&sortBy=" : ""}${sortingFilter}`
        const featuredQuery = `${currFeatured ? `featuredCategory=${currFeatured}&` : ""}`
        const searchQuery = `${searchBarQuery ? `?searchBarQuery=${searchBarQuery}&` : "?"}`

        router.replace(`?${searchBarQuery ? `searchBarQuery=${searchBarQuery}&` : ""}${currFeatured ? `featuredCategory=${currFeatured}&` : ""}clothingCategory=${clothingQuery}${sexQuery}${colQuery}${sizeQuery}${saleQuery}${sortQuery}`);

        //console.log(pathname + "?" + sexQuery);
        setQueryUrl(pathname + searchQuery + featuredQuery + "clothingCategory=" + clothingQuery + sexQuery + colQuery + sizeQuery + saleQuery + sortQuery);
        setCurrentPage(1);

    }, [sexFilter, colourFilter, sizeFilter, clothingFilter, onSale, sortingFilter, currFeatured, searchBarQuery]);

    const getFilterResults = async () => {
        const response = await fetch(`
            /api/${queryUrl}&pageFetch=${currentPage}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })

        const reply = await response.json();

        if (response.ok) {
            console.log("Items retrieved successfully!");
            setCategoryProducts(reply);
            setTotalQueryCount(reply[0].total_count ?? 0);
            console.log(reply);
        }
        else if (response.status === 404) {
            setCategoryProducts([]);
            console.log("NO ITEMS FOUND FOR COLLECTION QUERY!");
            setTotalQueryCount(0);
        }
        else {
            console.log(response.status, response.statusText)
        }
    }


    useEffect(() => {
        const clothingCategory = params?.get('clothingCategory');
        const featuredCategory = params?.get('featuredCategory');
        if (clothingCategory) {
            setClothingFilter(clothingCategory);
        }
        if (featuredCategory) {
            setCurrFeatured(featuredCategory)
        }
    }, [params]);


    useEffect(() => {
        if (queryUrl !== "") {
            getFilterResults();
        }

    }, [queryUrl, currCat, currentPage]);

    return (
        <div className="flex flex-col gap-3 items-center  min-w-[250px]">
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

            <div className="flex justify-center items-center lg:w-[650px] md:w-2/3 w-5/6 mt-3 mb-10">
                <div className="flex flex-wrap justify-center gap-3">
                    {Array(Math.ceil(totalQueryCount / 10)).fill(totalQueryCount).map((numOfPage, index) => (
                        <div
                            key={index}
                            className={`p-3 text-center rounded-full border-2 
                            border-black cursor-pointer w-[50px] h-[50px] 
                            ${currentPage === (index + 1) ? "bg-black text-white font-bold" : "hover:bg-gray-300"}`}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}