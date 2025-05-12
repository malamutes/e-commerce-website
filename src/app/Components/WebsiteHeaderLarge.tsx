"use client";

import Image from "next/image";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import { useEffect, useContext, useState, useRef } from "react";
import { clothingCategory, headers, salesCategories } from "../CollectionTypes";
import ShoppingCart from "./ShoppingCart";
import { ShoppingCartContext } from "../Contexts/ShoppingCartContext";
import { GlobalWishlistTrackerContext } from "../Contexts/GlobalWishlistTrackerContext";
import { WebsiteHeaderInterface } from "./WebsiteHeader";
import Searchbar from "./Searchbar";
import Lottie from "lottie-react";
import Bookmark from "@/assets/Bookmark.json"
import { LottieRefCurrentProps } from 'lottie-react';

export const HeadlineDropdownMap: { [key: string]: string[] } = {
    'Products': clothingCategory,
    'Featured': salesCategories.filter(cat => cat !== 'Regular'),
    'Upcoming': ["null", "null", "null"]
}

interface HeadlineDropdownProps {
    headline: string
    show: boolean
    headlineDropdownItems: string[],
    numColumns: number
}

function HeadlineDropdown(props: HeadlineDropdownProps) {
    return <>

        <div className={`absolute top-[100px] left-0 top-0 w-full
                flex flex-row justify-between bg-gray-400 pl-[100px] pr-[100px] 
                pb-[20px] font-bold place-items-center transition-all duration-300
                ${props.show ? "block opacity-100" : "opacity-0 pointer-events-none"}`}>

            {props.headlineDropdownItems.map((item, index) => {
                let dynamicUrl: string = "";
                if (props.headline === 'Products') {
                    dynamicUrl = `/Collections?featuredCategory=All&clothingCategory=${item}`
                }
                else if (props.headline === 'Featured') {
                    dynamicUrl = `/Collections?featuredCategory=${item}&clothingCategory=All`
                }
                else {
                    dynamicUrl = ""
                }

                return (
                    <Link key={index} href={dynamicUrl} className="hover:shadow-lg 
                    p-1.5 rounded-lg 
                    cursor-pointer mt-[25px] 
                    hover:bg-gray-300 w-fit">
                        <span >
                            {item}
                        </span>
                    </Link>
                );
            })}

        </div>

    </>
}


export default function WebsiteHeaderLarge(props: WebsiteHeaderInterface) {

    const { data: session, status } = useSession();

    const { cartState } = useContext(ShoppingCartContext);

    const { allWishlistedItems } = useContext(GlobalWishlistTrackerContext);

    const [showSearchbar, setShowSearchbar] = useState(false);
    const [hoverBookmark, setHoverBookmark] = useState(false);

    const lottieRef = useRef<LottieRefCurrentProps | null>(null);

    useEffect(() => {
        if (hoverBookmark) {
            lottieRef.current?.play();
        }
        else {
            lottieRef.current?.goToAndStop(30, true);
        }
    }, [hoverBookmark]);

    useEffect(() => {
        if (status === "loading") {
        } else if (status === "authenticated") {
            props.setUserIn(true)
        } else if (status === "unauthenticated") {
            props.setUserIn(false);
        }
    }, [status]);


    return <>
        <div style={{ zIndex: 20 }}>
            <div className="hidden lg:block max-w-[2000px] mx-auto h-full" >
                <div className=" flex flex-row justify-between xl:w-4/5 w-11/12 xl:pr-[0px] xl:pl-[0px]
                 mx-auto h-full">
                    <Link href={"/"} >
                        <Image src={"/Logo.png"} alt="WebsiteLogo"
                            width={100} height={100} className="mt-[2.5px] ml-5 scale-90
                            transition-transform hover:scale-105" />
                    </Link>


                    <div className="flex flex-row ">
                        {headers.map((headline, index) => (
                            <div key={index}
                                className="flex flex-row items-center xl:mx-4 lg:mx-3 font-bold"
                                onClick={() => {
                                    if (props.navDropdown === -1) {
                                        props.setNavDropdown(index)
                                    }
                                    else if (props.navDropdown === index) {
                                        props.setNavDropdown(-1)
                                    }
                                    else {
                                        props.setNavDropdown(index)
                                    }
                                }}
                            >
                                <div className="cursor-pointer">
                                    <span >
                                        {headline}
                                    </span>
                                    <FontAwesomeIcon icon={faAngleDown}
                                        size="1x"
                                        className={`${props.iconClass} ${props.navDropdown === index ? "rotate-180" : "rotate-0"}`} />
                                </div>

                                <HeadlineDropdown
                                    headline={headline}
                                    show={props.navDropdown === index}
                                    headlineDropdownItems={HeadlineDropdownMap[headline]}
                                    numColumns={4} />

                            </div>
                        ))}


                    </div>

                    <div className="flex flex-row items-center">
                        <div className="flex flex-row items-center">
                            <div>
                                <div className="border-2 border-black p-2 rounded-xl relative"
                                    onClick={props.loginSubmit}
                                    onMouseLeave={() => props.setDisplayUserDrowndown(false)}
                                    onMouseEnter={() => {
                                        if (props.userIn) {
                                            props.setDisplayUserDrowndown(true);
                                        }
                                    }}
                                >
                                    <div className={props.userIn ? "hidden" : "block"}>
                                        <span>
                                            SIGN IN
                                        </span>
                                    </div>

                                    <div className={props.userIn ? "block " : "hidden"}>
                                        <span >
                                            {session?.user.email}

                                        </span>
                                        <FontAwesomeIcon icon={faChevronDown}
                                            className={`ml-2 transition-transform duration-300 ${props.displayUserDropdown ? "rotate-180" : "rotate-0"}`} />

                                        <div
                                            className={`absolute transition-all mt-[5px] duration-300
                                                ${props.displayUserDropdown ? "block opacity-100 translate-y-0" : "opacity-0 -translate-y-[10px] pointer-events-none"} 
                                                left-1/2 -translate-x-1/2 pt-[15px] w-full `}>

                                            <div className="bg-black font-bold text-white">
                                                <div className={`bg-blue-500 h-1 transition-all duration-700 
                                                    rounded-sm mb-2 ${props.displayUserDropdown ? "w-full" : "w-0"} `}></div>

                                                <div className="pl-[20px] text-lg">
                                                    <span>
                                                        {session?.user.firstName} {session?.user.lastName}
                                                    </span>
                                                </div>


                                                <div className="w-full h-[1px] bg-gray-200 mt-2"></div>
                                            </div>

                                            <div className="bg-black flex flex-col text-gray-200 pb-[12.5px] min-w-[200px] pt-[12.5px]">

                                                <span className={`${props.dropDownMenuItemClass}`}
                                                    onClick={props.handleAccount}>
                                                    Account
                                                </span>

                                                <span className={`${props.dropDownMenuItemClass} 
                                                ${session?.user.isUserProducer === true ? "block" : "hidden"}`}
                                                    onClick={props.handleProducerDashboard}>
                                                    Producer Dashboard
                                                </span>

                                                <span className={`${props.dropDownMenuItemClass}`}
                                                    onClick={props.handleUserSignOut}>
                                                    Sign Out
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <FontAwesomeIcon icon={faMagnifyingGlass} style={{ fontSize: props.iconSize }}
                                className={props.iconClass} onClick={() => setShowSearchbar(true)} />

                            <div onClick={props.handleWishlistClick}
                                onMouseEnter={() => setHoverBookmark(true)} onMouseLeave={() => setHoverBookmark(false)}
                                className={` ${props.iconClass} flex 2xs:flex-row flex-col items-center w-fit bg-gray-400 p-[7.5px] rounded-xl overflow-hidden`}>
                                <Lottie animationData={Bookmark} className="w-[25px] h-[25px] scale-[3]" lottieRef={lottieRef} />

                                <div className="bg-black text-white w-[25px] aspect-square grid 
                                                            place-items-center rounded-lg 2xs:mt-[0px] mt-[5px] 2xs:ml-[5px] ml-[0px]">
                                    {allWishlistedItems.size}
                                </div>
                            </div>


                            <div className={` ${props.iconClass} flex 2xs:flex-row flex-col items-center w-fit bg-gray-400 p-[7.5px] rounded-xl`}
                                onClick={() => props.setShowShoppingCart(true)}>
                                <FontAwesomeIcon icon={faShoppingCart}
                                    style={{ fontSize: props.iconSize }}
                                />
                                <div className="bg-black text-white w-[25px] aspect-square grid 
                                                            place-items-center rounded-lg 2xs:mt-[0px] mt-[5px] 2xs:ml-[5px] ml-[0px]">
                                    {Object.keys(cartState).length}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <ShoppingCart show={props.showShoppingCart} setShow={props.setShowShoppingCart} />
        </div>

        <Searchbar
            show={showSearchbar}
            setShow={setShowSearchbar}
            searchQuery={props.searchQuery}
            setSearchQuery={props.setSearchQuery}
            setNoResultMessage={props.setNoResultMessage}
            noResultMessage={props.noResultMessage}
            setSearchQueryProducts={props.setSearchQueryProducts}
            searchQueryProducts={props.searchQueryProducts}
            searchQueryTotalCount={props.searchQueryTotalCount}
            setSearchQueryTotalCount={props.setSearchQueryTotalCount}
            showLoadingUI={props.showLoadingUI}
            setShowLoadingUI={props.setShowLoadingUI}
        />
    </>
}