"use client";

import Image from "next/image";
import { faUser, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { HeadlineDropdownMap } from "./WebsiteHeaderLarge";
import ShoppingCart from "./ShoppingCart";
import { ShoppingCartContext } from "../Contexts/ShoppingCartContext";
import { GlobalWishlistTrackerContext } from "../Contexts/GlobalWishlistTrackerContext";
import { WebsiteHeaderInterface } from "./WebsiteHeader";
import { DropdownMenu } from "./WebsiteHeader";
import { SearchbarSmall } from "./Searchbar";

const iconSize = "25px";
const iconClass = "xs:mx-1.5 mx-1 cursor-pointer transition-transform duration-250 hover:scale-110";
//const dropDownMenuItemClass = "text-white pl-[50px] pt-[12.5px] pb-[12.5px] font-bold text-sm";


export default function WebsiteHeaderSmall(props: WebsiteHeaderInterface) {

    const [menuOffCanvas, setMenuOffCanvas] = useState(false);
    const [animateOffCanvas, setAnimateOffCanvas] = useState(false);

    useEffect(() => {
        if (menuOffCanvas) {
            setAnimateOffCanvas(true);
        }
        else {
            setAnimateOffCanvas(false);
        }
    }, [menuOffCanvas]);

    const { data: session, status } = useSession();

    const { cartState } = useContext(ShoppingCartContext);

    const { allWishlistedItems } = useContext(GlobalWishlistTrackerContext);


    useEffect(() => {
        if (status === "loading") {
        } else if (status === "authenticated") {
            props.setUserIn(true)
        } else if (status === "unauthenticated") {
            props.setUserIn(false);
        }
    }, [status]);

    return <>

        <div className=" flex flex-row justify-between w-11/12 mx-auto block lg:hidden min-w-[275px]">
            {/* for <div> <link image> <div> both divs have the same width so the image is centered
                    with justify between as parent div*/}

            <div className={`overflow-y-scroll h-screen 
            ${menuOffCanvas ? `fixed transition-all duration-500 ${animateOffCanvas
                    ? `2xs:w-[80vw] w-[85vw] max-w-[500px]` : "w-[0px]"}` : "hidden"} 
                bg-white z-20 top-0 left-0 flex flex-col`}>
                <div className="flex flex-row justify-between">
                    <span className="text-2xl italic p-5">
                        Navigation
                    </span>
                    <FontAwesomeIcon icon={faX}
                        onClick={() => { setMenuOffCanvas(false); props.setSearchQuery(""); props.setSearchQueryProducts([]); props.setNoResultMessage("") }}
                        className="cursor-pointer p-5 text-[25px]" />
                </div>

                <SearchbarSmall
                    searchQuery={props.searchQuery}
                    setSearchQuery={props.setSearchQuery}
                    setNoResultMessage={props.setNoResultMessage}
                    noResultMessage={props.noResultMessage}
                    setSearchQueryProducts={props.setSearchQueryProducts}
                    searchQueryProducts={props.searchQueryProducts}
                    setMenuOffCanvas={setMenuOffCanvas}
                    searchQueryTotalCount={props.searchQueryTotalCount}
                    setSearchQueryTotalCount={props.setSearchQueryTotalCount}
                    showLoadingUI={props.showLoadingUI}
                    setShowLoadingUI={props.setShowLoadingUI}
                />

                <div className="flex flex-col">
                    {props.headers.map((headline, index) => (
                        <DropdownMenu dropdownTitle={headline} key={index}
                            dropdownItems={HeadlineDropdownMap[headline]} />
                    ))}

                </div>
            </div>

            <div className={`fixed h-screen w-screen bg-black 
            ${menuOffCanvas ? "opacity-60" : "hidden"} top-0 left-0`}
                onClick={() => { setMenuOffCanvas(false); props.setSearchQuery(""); props.setSearchQueryProducts([]); props.setNoResultMessage("") }}
                style={{ zIndex: 0 }}>
            </div>

            <div className="flex flex-row items-center justify-start w-1/3">
                <div>
                    <FontAwesomeIcon icon={faBars}
                        style={{ fontSize: iconSize }}
                        className={iconClass}
                        onClick={() => setMenuOffCanvas(true)}
                    />
                </div>

                <div className="lg:hidden block ml-[5px]">
                    <div
                        className="relative"
                        onMouseEnter={() => props.setDisplayUserDrowndown(true)}
                        onMouseLeave={() => props.setDisplayUserDrowndown(false)}
                    >
                        <div className="cursor-pointer" onClick={props.loginSubmit}>
                            <span>
                                <FontAwesomeIcon icon={faUser} style={{ fontSize: iconSize }} />
                            </span>
                        </div>

                        {props.userIn
                            ?
                            (
                                <div
                                    className={`absolute transition-all duration-300
                            ${props.displayUserDropdown ? "block opacity-100 translate-y-0" : "opacity-0 -translate-y-[10px] pointer-events-none"} 
                            left-1/2 -translate-x-1/2 pt-[15px] w-full `}>

                                    <div className="bg-black flex flex-col text-gray-200 pb-[12.5px] min-w-[200px]">

                                        <div className="bg-black font-bold text-white ">
                                            <div className={`bg-blue-500 h-1 transition-all duration-700 
                          rounded-sm mb-2 ${props.displayUserDropdown ? "w-full" : "w-0"} `}></div>

                                            <div className="pl-[20px] text-lg">
                                                <span>
                                                    {session?.user.firstName} {session?.user.lastName}
                                                </span>
                                            </div>

                                            <div className="w-full h-[1px] bg-gray-200 mt-2"></div>
                                        </div>

                                        <div className="pt-[15px] pb-[15px]">
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
                            )
                            :
                            (
                                null
                            )}

                    </div>
                </div>


            </div>

            <Link href={"/"}>
                <Image src={"/Logo.png"} alt="WebsiteLogo"
                    width={115} height={115} />
            </Link>


            <div className="flex flex-row items-center justify-end w-1/3">
                <div className="flex flex-row items-center">
                    <div onClick={props.handleWishlistClick}
                        className={` ${iconClass} flex 2xs:flex-row flex-col items-center w-fit bg-gray-400 pl-[5px] pr-[5px] 
                    pt-[7.5px] pb-[7.5px] rounded-xl`}>
                        <FontAwesomeIcon icon={faBookmark}
                            style={{ fontSize: iconSize }} />
                        <div className="bg-black text-white w-[25px] aspect-square grid 
                                place-items-center rounded-lg 2xs:mt-[0px] mt-[5px] 2xs:ml-[5px] ml-[0px]">
                            {allWishlistedItems.size}
                        </div>
                    </div>



                    <div className={` ${iconClass} flex 2xs:flex-row flex-col items-center w-fit bg-gray-400 pl-[5px] pr-[5px] 
                    pt-[7.5px] pb-[7.5px] rounded-xl`}
                        onClick={() => props.setShowShoppingCart(true)}>
                        <FontAwesomeIcon icon={faShoppingCart}
                            style={{ fontSize: iconSize }}

                        />
                        <div className="bg-black text-white w-[25px] aspect-square grid 
                                place-items-center rounded-lg 2xs:mt-[0px] mt-[5px] 2xs:ml-[5px] ml-[0px]">
                            {Object.keys(cartState).length}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ShoppingCart show={props.showShoppingCart} setShow={props.setShowShoppingCart} />
    </>
}