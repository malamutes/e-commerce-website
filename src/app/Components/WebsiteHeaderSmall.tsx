"use client";

import Image from "next/image";
import { faAngleDown, faUser, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { headers } from "../CollectionTypes";
import { HeadlineDropwdownMap } from "./WebsiteHeaderLarge";


const iconSize = "25px";
const iconClass = "xs:mx-1.5 mx-1 cursor-pointer transition-transform duration-250 hover:scale-110";
const dropDownMenuItemClass = "text-white pl-[50px] pt-[12.5px] pb-[12.5px] font-bold text-sm";

interface DropdownMenu {
    dropdownItems: string[],
    dropdownTitle: string
}

function DropdownMenu(props: DropdownMenu) {
    const [closeMenu, setCloseMenu] = useState(true);

    return <>
        <div className="flex flex-col p-5">
            <div
                className="flex flex-row items-center xl:mx-4 lg:mx-3 font-bold pb-2.5">
                <div className="cursor-pointer" onClick={() => setCloseMenu(closeMenu => !closeMenu)}>
                    <span >
                        {props.dropdownTitle}
                    </span>
                    <FontAwesomeIcon icon={faAngleDown}
                        size="1x"
                        className={`${iconClass} ${false ? "rotate-180" : "rotate-0"}`} />
                </div>

            </div>

            <div className={`flex flex-col ${closeMenu ? "hidden" : "block"}`}>
                {props.dropdownItems.map((item, index) => {
                    let dynamicUrl: string = "";
                    if (props.dropdownTitle === 'Products') {
                        dynamicUrl = `/Collections?clothingCategory=${item}`
                    }
                    else if (props.dropdownTitle === 'Featured') {
                        dynamicUrl = `/Collections/${item}?clothingCategory=All`
                    }
                    else {
                        dynamicUrl = ""
                    }

                    return (
                        <Link key={index} href={dynamicUrl} className="hover:shadow-lg  rounded-lg 
                            cursor-pointer p-[5px]
                            hover:bg-gray-300 w-fit">
                            <span >
                                {item}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>

    </>
}

export default function WebsiteHeaderSmall() {

    const [userIn, setUserIn] = useState(false);
    const [displayUserDropdown, setDisplayUserDrowndown] = useState(false);

    const [menuOffCanvas, setMenuOffCanvas] = useState(false);

    const { data: session, status } = useSession();

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

    return <>

        <div className=" flex flex-row justify-between w-11/12 mx-auto block lg:hidden">
            {/* for <div> <link image> <div> both divs have the same width so the image is centered
                    with justify between as parent div*/}

            <div className={`w-[80vw] overflow-y-scroll max-w-[500px] h-screen ${menuOffCanvas ? "fixed" : "hidden"} 
                bg-white z-20 top-0 left-0 flex flex-col`}>
                <div className="flex flex-row justify-between">
                    <span className="text-2xl italic p-5">
                        Navigation
                    </span>
                    <FontAwesomeIcon icon={faX} size="2x"
                        onClick={() => setMenuOffCanvas(false)}
                        className="cursor-pointer p-5" />
                </div>
                <div className="flex flex-col">
                    {headers.map((headline, index) => (
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
                        if (userIn) {
                            setDisplayUserDrowndown(true);
                        }
                    }}
                    onMouseLeave={() => setDisplayUserDrowndown(false)}>
                    <div className=" cursor-pointer relative"
                        onClick={loginSubmit}

                    >
                        <span >
                            <FontAwesomeIcon icon={faUser}
                                style={{ fontSize: iconSize }} />
                        </span>

                        <div

                            className={`fixed ${displayUserDropdown ? "block" : "hidden"} 
                                        pt-[25px] w-[90vw] left-[5vw]`}>

                            <div className="bg-gray-500 flex flex-col text-gray-600 pb-[12.5px]">
                                <span className={`font-bold pl-[25px] pt-[15px] mb-[12.5px] text-lg text-white`}>
                                    Hello {session?.user.name}
                                </span>

                                <hr></hr>

                                <span className={dropDownMenuItemClass}>
                                    Account
                                </span>

                                <span className={dropDownMenuItemClass}>
                                    Orders
                                </span>

                                <span className={dropDownMenuItemClass}>
                                    Addresses
                                </span>

                                <span className={`${dropDownMenuItemClass}`}
                                    onClick={handleUserSignOut}>
                                    Sign Out
                                </span>

                                <span className={`${dropDownMenuItemClass} 
                                                ${session?.user.isUserProducer === true ? "block" : "hidden"}`}
                                    onClick={handleProducerDashboard}>
                                    Producer Dashboard
                                </span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <Link href={"/"}>
                <Image src={"/Logo.png"} alt="WebsiteLogo"
                    width={100} height={100} className="min-w-[100px]" />
            </Link>


            <div className="flex flex-row items-center justify-end w-1/3">
                <div className="flex flex-row items-center">

                    <FontAwesomeIcon icon={faMagnifyingGlass}
                        style={{ fontSize: iconSize }}
                        className={iconClass} />

                    <FontAwesomeIcon icon={faBookmark}
                        style={{ fontSize: iconSize }}
                        className={iconClass} />

                    <FontAwesomeIcon icon={faShoppingCart}
                        style={{ fontSize: iconSize }}
                        className={iconClass} />
                </div>
            </div>
        </div>

    </>
}