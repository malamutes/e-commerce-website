"use client";

import Image from "next/image";
import { faChevronDown, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import { useState, useEffect, SetStateAction, useContext } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { clothingCategory, headers, salesCategories } from "../CollectionTypes";
import ShoppingCart from "./ShoppingCart";
import { ShoppingCartContext } from "../(Contexts)/ShoppingCartContext";

export const HeadlineDropwdownMap: { [key: string]: string[] } = {
    'Products': clothingCategory,
    'Featured': salesCategories.filter(cat => cat !== 'Regular'),
    'Upcoming': ["null", "null", "null"],
    'Gifting': ["null", "null", "null"],
}

interface HeadlineDropdownProps {
    headline: string
    show: boolean
    headlineDropdownItems: string[],
    numColumns: Number
}


function HeadlineDropdown(props: HeadlineDropdownProps) {
    return <>

        <div className={`absolute top-[100px] left-0 top-0 w-full
                grid gap-x-4 bg-gray-400 pl-[100px] pr-[100px] 
                pb-[20px] font-bold place-items-center
                ${props.show ? "block" : "hidden"}`}
            style={{ gridTemplateColumns: `repeat(${props.numColumns}, minmax(0, 1fr))` }}>

            {props.headlineDropdownItems.map((item, index) => {
                let dynamicUrl: string = "";
                if (props.headline === 'Products') {
                    dynamicUrl = `/Collections?clothingCategory=${item}`
                }
                else if (props.headline === 'Featured') {
                    dynamicUrl = `/Collections/${item}?clothingCategory=All`
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

export default function WebsiteHeaderLarge() {
    const iconSize = "25px";
    const iconClass = "xs:mx-1.5 mx-1 cursor-pointer transition-transform duration-250 hover:scale-110";
    const dropDownMenuItemClass = "text-white pl-[50px] pt-[12.5px] pb-[12.5px] font-bold text-sm";

    const [userIn, setUserIn] = useState(false);
    const [displayUserDropdown, setDisplayUserDrowndown] = useState(false);

    const [navDropdown, setNavDropdown] = useState(-1);
    const [showShoppingCart, setShowShoppingCart] = useState(false);

    const { data: session, status } = useSession();

    const { cartState } = useContext(ShoppingCartContext)

    useEffect(() => {
        if (status === "loading") {
        } else if (status === "authenticated") {
            setUserIn(true)
        } else if (status === "unauthenticated") {
            setUserIn(false);
        }
    }, [status]);

    const router = useRouter();

    const loginSubmit = async () => {
        if (!userIn) {
            router.push('/LoginPage');
        }
    }

    const handleUserSignOut = async () => {
        try {
            const logoutResult = await signOut({ callbackUrl: '/' });
        }
        catch (error) {
            console.error("Error signing out:", error);
        }

    }

    const handleProducerDashboard = async () => {
        router.push('/ProducerDashboard?tab=Overview');
    }

    const handleAccount = () => {
        router.push('/Account');
    }

    return <>
        <div style={{ zIndex: 20 }}>
            <div className="hidden lg:block max-w-[2000px] mx-auto h-full" >
                <div className=" flex flex-row justify-between xl:w-4/5 w-full xl:pr-[0px] xl:pl-[0px]
                pr-[20px] pl-[20px] mx-auto h-full">
                    <Link href={"/"} >
                        <Image src={"/Logo.png"} alt="WebsiteLogo"
                            width={100} height={100} className="mt-[2.5px] ml-5" />
                    </Link>


                    <div className="flex flex-row ">
                        {headers.map((headline, index) => (
                            <div key={index}
                                className="flex flex-row items-center xl:mx-4 lg:mx-3 font-bold"
                                onClick={() => {
                                    if (navDropdown === -1) {
                                        setNavDropdown(index)
                                    }
                                    else if (navDropdown === index) {
                                        setNavDropdown(-1)
                                    }
                                    else {
                                        setNavDropdown(index)
                                    }
                                }}
                            >
                                <div className="cursor-pointer">
                                    <span >
                                        {headline}
                                    </span>
                                    <FontAwesomeIcon icon={faAngleDown}
                                        size="1x"
                                        className={`${iconClass} ${navDropdown === index ? "rotate-180" : "rotate-0"}`} />
                                </div>

                                <HeadlineDropdown
                                    headline={headline}
                                    show={navDropdown === index}
                                    headlineDropdownItems={HeadlineDropwdownMap[headline]}
                                    numColumns={HeadlineDropwdownMap[headline].length < 6 ?
                                        HeadlineDropwdownMap[headline].length :
                                        Math.floor(HeadlineDropwdownMap[headline].length / 2)} />

                            </div>
                        ))}


                    </div>

                    <div className="flex flex-row items-center">
                        <div className="flex flex-row items-center">
                            <div
                                onMouseEnter={() => {
                                    if (userIn) {
                                        setDisplayUserDrowndown(true);
                                    }
                                }}
                                onMouseLeave={() => setDisplayUserDrowndown(false)}>
                                <div className="border-2 border-black p-2 rounded-full cursor-pointer relative"
                                    onClick={loginSubmit}
                                >
                                    <div className={userIn ? "hidden" : "block"}>
                                        <span>
                                            SIGN IN
                                        </span>
                                    </div>

                                    <div className={userIn ? "block" : "hidden"}>
                                        <span>
                                            {session?.user.email}

                                        </span>
                                        <FontAwesomeIcon icon={faChevronDown}
                                            className={`ml-2 ${displayUserDropdown ? "rotate-180" : "rotate-0"}`} />

                                        <div
                                            className={`absolute ${displayUserDropdown ? "block" : "hidden"} 
                                        left-1/2 transform -translate-x-1/2 pt-[25px] w-full `}>
                                            <div className="bg-gray-500 flex flex-col text-gray-200 pt-[12.5px]">
                                                <span className={`${dropDownMenuItemClass}`}
                                                    onClick={handleAccount}>
                                                    Account
                                                </span>

                                                <span className={`${dropDownMenuItemClass} 
                                                ${session?.user.isUserProducer === true ? "block" : "hidden"}`}
                                                    onClick={handleProducerDashboard}>
                                                    Producer Dashboard
                                                </span>

                                                <span className={`${dropDownMenuItemClass}`}
                                                    onClick={handleUserSignOut}>
                                                    Sign Out
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <FontAwesomeIcon icon={faMagnifyingGlass} style={{ fontSize: iconSize }}
                                className={iconClass} />

                            <FontAwesomeIcon icon={faBookmark}
                                style={{ fontSize: iconSize }}
                                className={iconClass} />

                            <div className={` ${iconClass} flex 2xs:flex-row flex-col items-center w-fit bg-gray-400 p-[7.5px] rounded-xl`}
                                onClick={() => setShowShoppingCart(true)}>
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
            </div>

            <ShoppingCart show={showShoppingCart} setShow={setShowShoppingCart} />
        </div>

    </>
}