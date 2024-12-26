'use client';

import Image from "next/image";
import { faChevronDown, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function WebsiteHeader() {
    const iconSize = "25px";
    const iconClass = "xs:mx-1.5 mx-1 cursor-pointer transition-transform duration-250 hover:scale-110";
    const headers = ['Products', 'Trending', 'Best Sellers', 'New'];
    const dropDownMenuItemClass = "border-2 border-black p-5";

    const [userIn, setUserIn] = useState(false);
    const [displayUserDropdown, setDisplayUserDrowndown] = useState(false);

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
        router.push('/ProducerDashboard');
    }

    return <>
        <div className="fixed bg-gray-300 w-screen pt-1.5 pb-1.5 h-[100px] ">
            {/* hardcode website top nav to be 100px for now since im using it to sort out padding
            in main body content*/}
            <div className="hidden lg:block max-w-[2000px] mx-auto h-full">
                <div className=" flex flex-row justify-between xl:w-4/5 lg:w-11/12 mx-auto h-full">
                    <Link href={"/"} >
                        <Image src={"/Logo.png"} alt="WebsiteLogo"
                            width={100} height={100} className="mt-[2.5px] ml-5" />
                    </Link>


                    <div className="flex flex-row ">
                        {headers.map((headline, index) => (
                            <div key={index} className="flex flex-row items-center xl:mx-4 lg:mx-3 cursor-pointer">
                                <span >
                                    {headline}
                                </span>
                                <FontAwesomeIcon icon={faAngleDown}
                                    size="1x"
                                    className={iconClass} />
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
                                            <FontAwesomeIcon icon={faChevronDown}
                                                className={`ml-2 ${displayUserDropdown ? "rotate-180" : "rotate-0"}`} />
                                        </span>

                                        <div
                                            className={`absolute ${displayUserDropdown ? "block" : "hidden"} 
                                        left-1/2 transform -translate-x-1/2 pt-[25px] w-full `}>
                                            <div className="bg-gray-500 flex flex-col text-gray-200 ">
                                                <span className={dropDownMenuItemClass}>
                                                    Account
                                                </span>

                                                <span className={dropDownMenuItemClass}>
                                                    Orders
                                                </span>

                                                <span className={dropDownMenuItemClass}>
                                                    Addresses
                                                </span>

                                                <span className={dropDownMenuItemClass}
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


                            <FontAwesomeIcon icon={faMagnifyingGlass} style={{ fontSize: iconSize }}
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
            </div>

            <div className="block lg:hidden">
                <div className=" flex flex-row justify-between w-11/12 mx-auto">

                    <div className="flex flex-row items-center justify-start w-1/6 ">
                        <div>
                            <FontAwesomeIcon icon={faBars}
                                style={{ fontSize: iconSize }}
                                className={iconClass} />
                        </div>
                    </div>

                    <Link href={"/"}>
                        <Image src={"/Logo.png"} alt="WebsiteLogo"
                            width={100} height={100} />
                    </Link>


                    <div className="flex flex-row items-center justify-end w-fit ">
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
                                    <span>
                                        {userIn ? session?.user.email : "SIGN IN"}
                                        <FontAwesomeIcon icon={faChevronDown}
                                            className={`ml-2 ${displayUserDropdown ? "rotate-180" : "rotate-0"}`} />
                                    </span>

                                    <div
                                        className={`absolute ${displayUserDropdown ? "block" : "hidden"} 
                                        left-1/2 transform -translate-x-1/2 pt-[25px] w-full `}>
                                        <div className="bg-gray-500 flex flex-col text-gray-200 ">
                                            <span className={dropDownMenuItemClass}>
                                                Account
                                            </span>

                                            <span className={dropDownMenuItemClass}>
                                                Orders
                                            </span>

                                            <span className={dropDownMenuItemClass}>
                                                Addresses
                                            </span>

                                            <span className={dropDownMenuItemClass}
                                                onClick={() => { console.log("adsad") }}>
                                                Sign Out
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            </div>



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
            </div>

        </div>
    </>
}