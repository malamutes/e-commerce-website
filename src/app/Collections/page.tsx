"use client";
import FilterTabLarge, { FilterTabSmall } from "./components/FilterTab";
import DisplayProducts from "./components/DisplayProducts";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ProductCardInterface } from "../DataInterfaces";
import LoadingComponent from "../components/LoadingComponent";
import PaginationComponent from "./components/PaginationComponent";

const NUM_ITEMS_PER_PAGE = 12;

export default function Collections() {
    const pathname = useRef(usePathname()).current;
    const params = useSearchParams();
    const router = useRouter();

    const [currCat, setCurrCat] = useState(params?.get('clothingCategory'));
    const [currFeatured, setCurrFeatured] = useState(params?.get('featuredCategory'));
    const [searchBarQuery, setSearchBarQuery] = useState(params?.get('searchBarQuery') ?? "");
    const [brandQuery, setBrandQuery] = useState(params?.get('brand') ?? "");
    const [categoryProducts, setCategoryProducts] = useState<ProductCardInterface[]>([]);
    const [sexFilter, setSexFilter] = useState<string[]>([]);
    const [colourFilter, setColourFilter] = useState<string[]>([]);
    const [sizeFilter, setSizeFilter] = useState<string[]>([]);
    const [sortingFilter, setSortingFilter] = useState<string>("");
    //0 is no check for sale 1 is check for sale
    const [onSale, setOnSale] = useState("");
    const [clothingFilter, setClothingFilter] = useState<string>(params?.get('clothingCategory') ?? "");
    const [queryUrl, setQueryUrl] = useState<string>("");

    const [numOfPages, setNumOfPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [showLoadingUI, setShowLoadingUI] = useState(true);

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
        const searchQuery = `${searchBarQuery ? `searchBarQuery=${searchBarQuery}&` : ""}`
        let urlBrandQuery = "?";
        if (searchBarQuery === "") {
            urlBrandQuery = `${brandQuery ? `?brand=${brandQuery}&` : "?"}`
        };

        router.replace(`?${brandQuery ? `brand=${brandQuery}&` : ""}${searchBarQuery ? `searchBarQuery=${searchBarQuery}&` : ""}${currFeatured ? `featuredCategory=${currFeatured}&` : ""}clothingCategory=${clothingQuery}${sexQuery}${colQuery}${sizeQuery}${saleQuery}${sortQuery}`);

        //console.log(pathname + "?" + sexQuery);
        setQueryUrl(pathname + urlBrandQuery + searchQuery + featuredQuery + "clothingCategory=" + clothingQuery + sexQuery + colQuery + sizeQuery + saleQuery + sortQuery);
        setCurrentPage(1);

    }, [sexFilter, colourFilter, sizeFilter, clothingFilter, onSale, sortingFilter,
        currFeatured, searchBarQuery, brandQuery]);

    const getFilterResults = async () => {
        setShowLoadingUI(true);
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
            setNumOfPages(Math.ceil(reply[0].total_count / NUM_ITEMS_PER_PAGE) ?? 0);
            setTotalItems(reply[0].total_count);
            console.log(reply);
        }
        else if (response.status === 404) {
            setCategoryProducts([]);
            console.log("NO ITEMS FOUND FOR COLLECTION QUERY!");
            setTotalItems(0);
            setNumOfPages(0);
        }
        else {
            console.log(response.status, response.statusText)
        }
        setShowLoadingUI(false);
    }


    useEffect(() => {
        const clothingCategory = params?.get('clothingCategory');
        const featuredCategory = params?.get('featuredCategory');
        const searchBar = params?.get('searchBarQuery');
        if (clothingCategory) {
            setClothingFilter(clothingCategory);
        }
        if (featuredCategory) {
            setCurrFeatured(featuredCategory)
        }
        if (searchBar) {
            setSearchBarQuery(searchBar);
        }
    }, [params]);

    useEffect(() => {
        if (searchBarQuery !== "") {
            setBrandQuery("");
        }
    }, [searchBarQuery])

    useEffect(() => {
        if (queryUrl !== "") {
            getFilterResults();
        }

    }, [queryUrl, currCat, currentPage]);


    return (
        <div className="flex flex-col gap-5 items-center min-w-[250px] mt-[50px]">
            <div className="flex flex-row justify-center items-center lg:container mx-auto pl-5 pr-5">
                <span className="text-[30px] font-bold text-center">
                    {
                        searchBarQuery
                            ? `Search results for '${searchBarQuery}'`
                            : brandQuery
                                ? `${brandQuery}`
                                : (currFeatured && currFeatured !== 'All')
                                    ? currFeatured
                                    : clothingFilter
                    } {showLoadingUI ? "..." : `(${totalItems})`}
                </span>
            </div>
            <div className="w-full min-w-[290px] lg:max-w-[1024px] xl:max-w-[1280px] 2xl:max-w-[1536px] 
            mx-auto pl-5 pr-5 -mt-[10px]">
                <hr className="border-[0.25px] border-gray-400 bg-gray-400 w-full"></hr>
            </div>

            <div className="flex md:flex-row flex-col lg:container w-full mx-auto pr-5 md:pl-0 pl-5">
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
                    {showLoadingUI ?
                        (
                            <LoadingComponent
                                width="100"
                                height="100"
                                minHeight="min-h-[1000px]"
                            />
                        ) :
                        (
                            <>
                                <DisplayProducts
                                    categoryProducts={categoryProducts}
                                />
                                <PaginationComponent
                                    numOfPages={numOfPages}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                />
                            </>
                        )}
                </div>
            </div>
        </div>
    );
}