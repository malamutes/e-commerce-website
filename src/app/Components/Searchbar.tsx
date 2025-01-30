"use client"

import { faMagnifyingGlass, faSquareXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { SetStateAction, useEffect, useState } from "react"
import { ProductCardInterface } from "../DataInterfaces"
import ProductCard from "../Collections/components/ProductCard"
import Image from "next/image"
import Link from "next/link"

interface SearchbarProps {
    show: boolean,
    setShow: React.Dispatch<SetStateAction<boolean>>;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    searchQueryProducts: ProductCardInterface[];
    setSearchQueryProducts: React.Dispatch<React.SetStateAction<ProductCardInterface[]>>;
    noResultMessage: string;
    setNoResultMessage: React.Dispatch<React.SetStateAction<string>>;
    searchQueryTotalCount: number;
    setSearchQueryTotalCount: React.Dispatch<React.SetStateAction<number>>;
}

const handleSearch = async (searchQuery: string,
    setSearchBarQueryProducts: React.Dispatch<SetStateAction<ProductCardInterface[]>>,
    setNoResultMessage: React.Dispatch<SetStateAction<string>>,
    setSearchQueryTotalCount: React.Dispatch<SetStateAction<number>>) => {
    const response = await fetch(`/api/SearchQuery?searchBarQuery=${searchQuery}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json'
        }
    })

    if (response.ok) {
        const reply = await response.json();
        setSearchBarQueryProducts(reply.queryData);
        setSearchQueryTotalCount(reply.totalCount);
        console.log(reply);
        if (reply.queryData.length === 0) {
            setNoResultMessage("No search results found!");
        }
        else {
            setNoResultMessage("FOUND");
        }

    }
    else {
        console.log(response.statusText, "SEARCH BAR QUERY ERROR CHECK LOGS")
    }
}

const handleEnterSearch = (event: React.KeyboardEvent, searchQuery: string,
    setSearchBarQueryProducts: React.Dispatch<SetStateAction<ProductCardInterface[]>>,
    setNoResultMessage: React.Dispatch<SetStateAction<string>>,
    setSearchQueryTotalCount: React.Dispatch<SetStateAction<number>>) => {
    if (event.key === "Enter") {
        event.preventDefault()
        handleSearch(searchQuery, setSearchBarQueryProducts, setNoResultMessage, setSearchQueryTotalCount);
    }
}

export default function Searchbar(props: SearchbarProps) {
    return <>
        <div className={`w-screen fixed h-screen top-0 left-0 bg-black bg-opacity-50
            ${props.show ? "lg:block hidden" : "hidden"} `}
            onClick={() => { props.setShow(false); props.setSearchQuery(""); props.setSearchQueryProducts([]); props.setNoResultMessage("") }}>
            <div className="h-[51vh] bg-white flex flex-col"
                onClick={(event: React.MouseEvent<HTMLDivElement>) => event.stopPropagation()}>
                <div className="bg-gray-200 w-full">
                    <div className="w-1/2 flex flex-row mx-auto p-5 gap-5 justify-center items-center">
                        <div className="relative w-5/6">
                            <input
                                type="text"
                                className="w-full p-3 pl-5 rounded-lg border-[1px] border-black border-opacity-25"
                                placeholder="Search products or brands"
                                value={props.searchQuery}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setSearchQuery(event.target.value)}
                                style={{ boxShadow: "2.5px 2.5px 5px rgba(0,0,0,0.1)" }}
                                onKeyDown={(event: React.KeyboardEvent) => handleEnterSearch(event, props.searchQuery, props.setSearchQueryProducts, props.setNoResultMessage, props.setSearchQueryTotalCount)}
                            />
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-[18px]
                            text-gray-500 cursor-pointer hover:scale-125 ease-in-out duration-500"
                                onClick={() => handleSearch(props.searchQuery, props.setSearchQueryProducts, props.setNoResultMessage, props.setSearchQueryTotalCount)}
                            />
                        </div>
                        <FontAwesomeIcon icon={faSquareXmark} className="text-[40px] cursor-pointer"
                            onClick={() => { props.setShow(false); props.setSearchQuery(""); props.setSearchQueryProducts([]); props.setNoResultMessage("") }} />
                    </div>
                </div>
                <div className="font-bold text-xl mx-auto xl:w-[1000px] w-[900px] mt-[15px] pl-2">
                    {props.noResultMessage === "FOUND" ? "TOP SEARCH RESULTS" : ""}
                </div>
                <div className="xl:w-[1000px] w-[900px] p-2 flex flex-row gap-10 justify-center mx-auto">
                    {(props.searchQueryProducts && props.searchQueryProducts.length !== 0) ? props.searchQueryProducts.map((product) => (
                        <ProductCard
                            key={product.product_id}
                            product={product}
                            style={{ boxShadow: 'none' }}
                            showTags={false}
                            seachBarSetShow={props.setShow}
                            seachBarQuery={props.setSearchQuery}
                        />
                    )) : (
                        <div className="italic text-gray-600 text-lg">
                            {(props.noResultMessage === "" || props.noResultMessage === "FOUND") ? "Make a search now!" : props.noResultMessage}
                        </div>
                    )}
                </div>
                {(props.searchQueryProducts && props.searchQueryProducts.length !== 0) ? (
                    <div className="mt-3 text-center">
                        <Link className="font-bold text-lg hover:underline"
                            href={`/Collections?searchBarQuery=${props.searchQuery}`}
                            onClick={() => { props.setShow(false); props.setSearchQuery(""); props.setSearchQueryProducts([]); props.setNoResultMessage("") }}>
                            VIEW ALL SEARCH RESULTS ({props.searchQueryTotalCount})
                        </Link>
                    </div>
                ) : (null)}
            </div>
        </div>
    </>
}

interface SearchBarSmallProps {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    searchQueryProducts: ProductCardInterface[];
    setSearchQueryProducts: React.Dispatch<React.SetStateAction<ProductCardInterface[]>>;
    noResultMessage: string;
    setNoResultMessage: React.Dispatch<React.SetStateAction<string>>;
    setMenuOffCanvas: React.Dispatch<React.SetStateAction<boolean>>;
    searchQueryTotalCount: number;
    setSearchQueryTotalCount: React.Dispatch<React.SetStateAction<number>>;
}

export function SearchbarSmall(props: SearchBarSmallProps) {

    return <>
        <div className={`lg:hidden block`}>
            <div className="flex items-center"
                onClick={(event: React.MouseEvent<HTMLDivElement>) => event.stopPropagation()}>
                <div className="flex flex-col w-full ">
                    <div className="w-full flex flex-row mx-auto p-5 gap-5 
                    justify-center items-center ">
                        <div className="relative w-full">
                            <input
                                type="text"
                                className="w-full p-3 pl-5 rounded-lg border-[1px] border-black border-opacity-25"
                                placeholder="Search products or brands"
                                value={props.searchQuery}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setSearchQuery(event.target.value)}
                                style={{ boxShadow: "2.5px 2.5px 5px rgba(0,0,0,0.1)" }}
                                onKeyDown={(event: React.KeyboardEvent) => handleEnterSearch(event, props.searchQuery, props.setSearchQueryProducts, props.setNoResultMessage, props.setSearchQueryTotalCount)}
                            />
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-[18px]
                            text-gray-500 cursor-pointer hover:scale-125 ease-in-out duration-500"
                                onClick={() => handleSearch(props.searchQuery, props.setSearchQueryProducts, props.setNoResultMessage, props.setSearchQueryTotalCount)}
                            />
                        </div>
                    </div>
                    <div className="font-bold text-lg mx-auto w-full pl-2">
                        {props.noResultMessage === "FOUND" ? "TOP SEARCH RESULTS" : ""}
                    </div>
                    <div className="w-full p-5 flex flex-col gap-5 justify-center mx-auto">
                        {(props.searchQueryProducts && props.searchQueryProducts.length !== 0) ? props.searchQueryProducts.map((product) => (
                            <Link className="flex 2xs:flex-row flex-col gap-3 items-center" key={product.product_id}
                                href={`/Collections/All/Products/?productID=${product.product_id}`}
                                onClick={() => {
                                    props.setSearchQueryProducts([]);
                                    props.setSearchQuery("");
                                    props.setNoResultMessage("");
                                    props.setMenuOffCanvas(false)
                                }}
                            >
                                <div className="3xs:w-1/4 2xs:w-1/3 w-full">
                                    <Image src={product.product_images[0]} alt={product.product_images[0]} width={600} height={600} />
                                </div>

                                <div className="flex flex-col 3xs:w-3/4 2xs:w-2/3 w-full 2xs:text-start text-center">
                                    <span className="font-bold 2xs:truncate">{product.product_name}</span>
                                    <span className="2xs:truncate"><span className="text-gray-600">{product.product_producer}</span> - <i>{product.product_type}</i></span>
                                    <span>${product.product_price}</span>
                                </div>
                            </Link>
                        )) : (
                            <div className="italic text-gray-600 text-lg">
                                {(props.noResultMessage === "" || props.noResultMessage === "FOUND") ? "Make a search now!" : props.noResultMessage}
                            </div>
                        )}
                        {(props.searchQueryProducts && props.searchQueryProducts.length !== 0) ? (
                            <Link className="font-bold text-lg hover:underline"
                                href={`/Collections?searchBarQuery=${props.searchQuery}`}
                                onClick={() => { props.setMenuOffCanvas(false); props.setSearchQuery(""); props.setSearchQueryProducts([]); props.setNoResultMessage("") }}>
                                VIEW ALL SEARCH RESULTS ({props.searchQueryTotalCount})
                            </Link>
                        ) : (null)}
                    </div>

                </div>

            </div>
        </div>
    </>
}