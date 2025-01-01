"use client";

const iconSize = "25px";
const iconClass = "xs:mx-1.5 mx-1 cursor-pointer transition-transform duration-250 hover:scale-110";
const dropDownMenuItemClass = "text-white pl-[50px] pt-[12.5px] pb-[12.5px] font-bold text-sm";
import Image from "next/image";
import { faUser } from "@fortawesome/free-solid-svg-icons";
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

export default function WebsiteHeaderSmall() {

    const [userIn, setUserIn] = useState(false);
    const [displayUserDropdown, setDisplayUserDrowndown] = useState(false);

    const [productsDropdown, setProductsDropdown] = useState(false);

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
            <div className="flex flex-row items-center justify-start w-1/3">
                <div>
                    <FontAwesomeIcon icon={faBars}
                        style={{ fontSize: iconSize }}
                        className={iconClass}
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