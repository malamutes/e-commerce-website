"use client"

import { faMagnifyingGlass, faSquareXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { SetStateAction, useEffect, useRef, useState } from "react"
import { ProductCardInterface } from "../DataInterfaces"
import ProductCard from "../Collections/components/ProductCard"
import Image from "next/image"
import Link from "next/link"
import LoadingComponent from "./LoadingComponent"

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
    showLoadingUI: boolean;
    setShowLoadingUI: React.Dispatch<React.SetStateAction<boolean>>;
}

const handleSearch = async (searchQuery: string,
    setSearchBarQueryProducts: React.Dispatch<SetStateAction<ProductCardInterface[]>>,
    setNoResultMessage: React.Dispatch<SetStateAction<string>>,
    setSearchQueryTotalCount: React.Dispatch<SetStateAction<number>>,
    setShowLoadingUI: React.Dispatch<React.SetStateAction<boolean>>) => {
    setShowLoadingUI(true);
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
    setShowLoadingUI(false);
}

const handleEnterSearch = (event: React.KeyboardEvent, searchQuery: string,
    setSearchBarQueryProducts: React.Dispatch<SetStateAction<ProductCardInterface[]>>,
    setNoResultMessage: React.Dispatch<SetStateAction<string>>,
    setSearchQueryTotalCount: React.Dispatch<SetStateAction<number>>,
    setShowLoadingUI: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (event.key === "Enter") {
        event.preventDefault()
        handleSearch(searchQuery, setSearchBarQueryProducts, setNoResultMessage, setSearchQueryTotalCount, setShowLoadingUI);
    }
}

export default function Searchbar(props: SearchbarProps) {
    const backdropRef = useRef(null);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (props.show) {
            setAnimate(true);
        }
        else {
            setAnimate(false)
        }
    }, [props.show]);

    return <>
        {props.show && (
            <div className={`w-screen fixed h-screen top-0 left-0 bg-black bg-opacity-50
            ${props.show ? "lg:block hidden" : "hidden"} `}
                onClick={() => { props.setShow(false); props.setSearchQuery(""); props.setSearchQueryProducts([]); props.setNoResultMessage("") }}
                ref={backdropRef}>

                <div className={`h-fit pb-3 bg-white flex flex-col transition-all duration-500 ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"}`}
                    onClick={(event: React.MouseEvent<HTMLDivElement>) => event.stopPropagation()}>

                    <div className={`bg-gray-200 w-full transition-all duration-1000 ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"}`}>

                        <div className="w-1/2 flex flex-row mx-auto p-5 gap-5 justify-center items-center">
                            <div className={`relative w-5/6 transition-all delay-300 duration-500 ${animate ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"}`}>
                                <input
                                    type="text"
                                    className="w-full p-3 pl-5 rounded-lg border-[1px] border-black border-opacity-25"
                                    placeholder="Search products or brands"
                                    value={props.searchQuery}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setSearchQuery(event.target.value)}
                                    style={{ boxShadow: "2.5px 2.5px 5px rgba(0,0,0,0.1)" }}
                                    onKeyDown={(event: React.KeyboardEvent) => handleEnterSearch(event, props.searchQuery, props.setSearchQueryProducts, props.setNoResultMessage,
                                        props.setSearchQueryTotalCount, props.setShowLoadingUI)}
                                />
                                <FontAwesomeIcon
                                    icon={faMagnifyingGlass}
                                    className="absolute right-5 top-1/2 transform -translate-y-1/2 text-[18px]
                            text-gray-500 cursor-pointer hover:scale-125 ease-in-out duration-500"
                                    onClick={() => handleSearch(props.searchQuery, props.setSearchQueryProducts, props.setNoResultMessage, props.setSearchQueryTotalCount,
                                        props.setShowLoadingUI
                                    )}
                                />
                            </div>
                            <FontAwesomeIcon icon={faSquareXmark} className={`text-[40px] cursor-pointer transition-all delay-300 duration-1000 
                            ${animate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"}`}
                                onClick={() => { props.setShow(false); props.setSearchQuery(""); props.setSearchQueryProducts([]); props.setNoResultMessage("") }} />
                        </div>
                    </div>
                    <div className="font-bold text-xl mx-auto xl:w-[1000px] w-[900px] mt-[15px] pl-2">
                        {(props.noResultMessage === "FOUND" && props.showLoadingUI === false) ? "TOP SEARCH RESULTS" : ""}
                    </div>
                    <div className="xl:max-w-[1000px] max-w-[900px] p-2 flex flex-row gap-10 justify-center mx-auto mt-[20px] mb-[20px]">
                        {
                            (props.showLoadingUI ?
                                (
                                    <LoadingComponent
                                        width="100"
                                        height="100"
                                        minHeight="min-h-[300px]"
                                    />
                                )
                                :
                                (
                                    (props.searchQueryProducts && props.searchQueryProducts.length !== 0) ? props.searchQueryProducts.map((product) => (
                                        <div key={product.product_id}>
                                            <ProductCard
                                                product={product}
                                                style={{ boxShadow: 'none' }}
                                                showTags={false}
                                                seachBarSetShow={props.setShow}
                                                seachBarQuery={props.setSearchQuery}
                                            />
                                        </div>

                                    ))
                                        :
                                        (
                                            < div className="italic text-gray-600 text-lg">
                                                {(props.noResultMessage === "" || props.noResultMessage === "FOUND") ? "Make a search now!" : props.noResultMessage}
                                            </div>
                                        )
                                )
                            )}
                    </div>
                    {(props.searchQueryProducts && props.searchQueryProducts.length !== 0 && props.showLoadingUI === false) ? (
                        <div className="mb-3 text-center">
                            <Link className="text-white bg-black rounded-full p-3 font-bold block w-fit mx-auto transition-all duration-300
                        hover:ring-[2.5px] hover:ring-black hover:ring-offset-[3px] hover:bg-white hover:text-black"
                                href={`/Collections?searchBarQuery=${props.searchQuery}`}
                                onClick={() => { props.setShow(false); props.setSearchQuery(""); props.setSearchQueryProducts([]); props.setNoResultMessage("") }}>
                                VIEW ALL SEARCH RESULTS ({props.searchQueryTotalCount})
                            </Link>
                        </div>
                    ) :
                        (
                            null
                        )}
                </div>
            </div >
        )}

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
    showLoadingUI: boolean;
    setShowLoadingUI: React.Dispatch<React.SetStateAction<boolean>>;
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
                                onKeyDown={(event: React.KeyboardEvent) => handleEnterSearch(event, props.searchQuery, props.setSearchQueryProducts, props.setNoResultMessage,
                                    props.setSearchQueryTotalCount, props.setShowLoadingUI)}
                            />
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-[18px]
                            text-gray-500 cursor-pointer hover:scale-125 ease-in-out duration-500"
                                onClick={() => handleSearch(props.searchQuery, props.setSearchQueryProducts, props.setNoResultMessage,
                                    props.setSearchQueryTotalCount, props.setShowLoadingUI)}
                            />
                        </div>
                    </div>
                    <div className="font-bold text-lg mx-auto w-full flex justify-center items-center">
                        {(props.noResultMessage === "FOUND" && props.showLoadingUI === false) ? "TOP SEARCH RESULTS" : ""}
                    </div>
                    <div className="w-full p-5 flex flex-col gap-5 justify-center mx-auto">
                        {props.showLoadingUI ? (
                            <LoadingComponent
                                width="100"
                                height="100"
                                minHeight="min-h-[150px]"
                            />
                        ) : (
                            (props.searchQueryProducts && props.searchQueryProducts.length !== 0) ? (
                                props.searchQueryProducts.map((product) => (
                                    <Link
                                        className="flex 2xs:flex-row flex-col gap-3 items-center transition-all duration-500 bg-gray-100 
                                        hover:-translate-y-4 hover:ring-2 hover:ring-black hover:ring-opacity-50 hover:shadow-black/75 p-2"
                                        key={product.product_id}
                                        href={`/Collections/All/Products/?productID=${product.product_id}`}
                                        onClick={() => {
                                            props.setSearchQueryProducts([]);
                                            props.setSearchQuery("");
                                            props.setNoResultMessage("");
                                            props.setMenuOffCanvas(false);
                                        }}
                                    >
                                        <div className="3xs:w-1/4 2xs:w-1/3 w-full">
                                            <Image src={product.product_images[0]} alt={product.product_images[0]} width={600} height={600} />
                                        </div>

                                        <div className="flex flex-col 3xs:w-3/4 2xs:w-2/3 w-full 2xs:text-start text-center">
                                            <span className="font-bold 2xs:truncate">{product.product_name}</span>
                                            <span className="2xs:truncate">
                                                <span className="text-gray-600">{product.product_producer}</span> - <i>{product.product_type}</i>
                                            </span>
                                            <span>${product.product_price}</span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="italic text-gray-600 text-lg">
                                    {(props.noResultMessage === "" || props.noResultMessage === "FOUND") ? "Make a search now!" : props.noResultMessage}
                                </div>
                            )
                        )}

                        {(props.searchQueryProducts && props.searchQueryProducts.length !== 0 && props.showLoadingUI === false) ? (
                            <Link
                                className="text-white bg-black rounded-full p-3 font-bold block w-fit mx-auto transition-all duration-300
                        hover:ring-[2.5px] hover:ring-black hover:ring-offset-[3px] hover:bg-white hover:text-black"
                                href={`/Collections?searchBarQuery=${props.searchQuery}`}
                                onClick={() => {
                                    props.setMenuOffCanvas(false);
                                    props.setSearchQuery("");
                                    props.setSearchQueryProducts([]);
                                    props.setNoResultMessage("");
                                }}
                            >
                                VIEW ALL SEARCH RESULTS ({props.searchQueryTotalCount})
                            </Link>
                        ) : null}
                    </div>


                </div>

            </div>
        </div>
    </>
}