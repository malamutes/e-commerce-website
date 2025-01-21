"use client";

import Image from "next/image";
import { faAngleDown, faUser, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { HeadlineDropwdownMap } from "./WebsiteHeaderLarge";
import ShoppingCart from "./ShoppingCart";
import { ShoppingCartContext } from "../(Contexts)/ShoppingCartContext";
import { GlobalWishlistTrackerContext } from "../(Contexts)/GlobalWishlistTrackerContext";
import { WebsiteHeaderInterface } from "./WebsiteHeader";
import { DropdownMenu } from "./WebsiteHeader";
import { SearchbarSmall } from "./Searchbar";

const iconSize = "25px";
const iconClass = "xs:mx-1.5 mx-1 cursor-pointer transition-transform duration-250 hover:scale-110";
const dropDownMenuItemClass = "text-white pl-[50px] pt-[12.5px] pb-[12.5px] font-bold text-sm";


export default function WebsiteHeaderSmall(props: WebsiteHeaderInterface) {

    const [menuOffCanvas, setMenuOffCanvas] = useState(false);

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

            <div className={`2xs:w-[80vw] w-[85vw] min-w-[250px] overflow-y-scroll max-w-[500px] h-screen ${menuOffCanvas ? "fixed" : "hidden"} 
                bg-white z-20 top-0 left-0 flex flex-col`}>
                <div className="flex flex-row justify-between">
                    <span className="text-2xl italic p-5">
                        Navigation
                    </span>
                    <FontAwesomeIcon icon={faX} size="2x"
                        onClick={() => setMenuOffCanvas(false)}
                        className="cursor-pointer p-5" />
                </div>

                <SearchbarSmall />

                <div className="flex flex-col">
                    {props.headers.map((headline, index) => (
                        <DropdownMenu dropdownTitle={headline} key={index}
                            dropdownItems={HeadlineDropwdownMap[headline]} />
                    ))}

                </div>
            </div>

            <div className={`fixed h-screen w-screen bg-black 
            ${menuOffCanvas ? "opacity-60" : "hidden"} top-0 left-0`}
                onClick={() => setMenuOffCanvas(false)}
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

                <div className="lg:hidden block ml-[5px] "
                    onMouseEnter={() => {
                        if (props.userIn) {
                            props.setDisplayUserDrowndown(true);
                        }
                    }}
                    onMouseLeave={() => props.setDisplayUserDrowndown(false)}>
                    <div className=" cursor-pointer relative"
                        onClick={props.loginSubmit}

                    >
                        <span >
                            <FontAwesomeIcon icon={faUser}
                                style={{ fontSize: iconSize }} />
                        </span>

                        <div className={`fixed ${props.displayUserDropdown ? "block" : "hidden"} 
                                        pt-[25px] w-[90vw] left-[5vw]`}>

                            <div className="bg-gray-500 flex flex-col text-gray-600 pb-[12.5px] w-[250px]">
                                <span className={`font-bold pl-[25px] pt-[15px] mb-[12.5px] text-lg text-white`}>
                                    Hello {session?.user.firstName}
                                </span>

                                <hr></hr>

                                <span className={dropDownMenuItemClass}
                                    onClick={props.handleAccount}>
                                    Account
                                </span>

                                <span className={`${dropDownMenuItemClass} 
                                                ${session?.user.isUserProducer === true ? "block" : "hidden"}`}
                                    onClick={props.handleProducerDashboard}>
                                    Producer Dashboard
                                </span>

                                <span className={`${dropDownMenuItemClass}`}
                                    onClick={props.handleUserSignOut}>
                                    Sign Out
                                </span>
                            </div>
                        </div>
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