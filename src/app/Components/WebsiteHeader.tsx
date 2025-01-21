'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, SetStateAction, useContext } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { clothingCategory, headers, salesCategories } from "../CollectionTypes";

export const HeadlineDropwdownMap: { [key: string]: string[] } = {
    'Products': clothingCategory,
    'Featured': salesCategories.filter(cat => cat !== 'Regular'),
    'Upcoming': ["null", "null", "null"],
    'Gifting': ["null", "null", "null"],
}
import WebsiteHeaderSmall from "./WebsiteHeaderSmall";
import WebsiteHeaderLarge from "./WebsiteHeaderLarge";
import { Session } from "next-auth";
import { GlobalWishlistTrackerContext } from "../(Contexts)/GlobalWishlistTrackerContext";
import { GlobalLoginPromptContext } from "../(Contexts)/GlobalLoginPromptContext";

export interface WebsiteHeaderInterface {
    iconSize: string,
    iconClass: string,
    dropDownMenuItemClass: string,

    userIn: boolean,
    setUserIn: React.Dispatch<SetStateAction<boolean>>,

    displayUserDropdown: boolean,
    setDisplayUserDrowndown: React.Dispatch<SetStateAction<boolean>>,

    showShoppingCart: boolean,
    setShowShoppingCart: React.Dispatch<SetStateAction<boolean>>,

    navDropdown: number,
    setNavDropdown: React.Dispatch<SetStateAction<number>>,

    loginSubmit: () => void,
    handleUserSignOut: () => Promise<void>,
    handleProducerDashboard: () => void,
    handleAccount: () => void,
    handleWishlistClick: () => void,

    headers: string[]
}

interface DropdownMenu {
    dropdownItems: string[],
    dropdownTitle: string
}

export function DropdownMenu(props: DropdownMenu) {
    const [closeMenu, setCloseMenu] = useState(true);
    const iconClass = "xs:mx-1.5 mx-1 cursor-pointer transition-transform duration-250 hover:scale-110";
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

export default function WebsiteHeader() {
    const iconSize = "25px";
    const iconClass = "xs:mx-1.5 mx-1 cursor-pointer transition-transform duration-250 hover:scale-110";
    const dropDownMenuItemClass = "text-white pl-[50px] pt-[12.5px] pb-[12.5px] font-bold text-sm";

    const [userIn, setUserIn] = useState(false);
    const [displayUserDropdown, setDisplayUserDrowndown] = useState(false);

    const [navDropdown, setNavDropdown] = useState(-1);
    const [showShoppingCart, setShowShoppingCart] = useState(false);

    const { setShowLoginPrompt, setMessage } = useContext(GlobalLoginPromptContext);

    const { data: session, status } = useSession();

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

    const handleWishlistClick = () => {
        if (status !== "authenticated") {
            setMessage("You need to be logged in to wishlist items!");
            setShowLoginPrompt(true);
        }
        else if (status === "authenticated") {
            router.push('/Wishlist');
        }
    }

    return <>

        <div className="fixed bg-gray-300 w-screen pt-1.5 pb-1.5 h-[100px] z-40" >
            {/* hardcode website top nav to be 100px for now since im using it to sort out padding
            in main body content*/}

            <WebsiteHeaderLarge
                iconSize={iconSize}
                iconClass={iconClass}
                dropDownMenuItemClass={dropDownMenuItemClass}
                userIn={userIn}
                setUserIn={setUserIn}
                displayUserDropdown={displayUserDropdown}
                setDisplayUserDrowndown={setDisplayUserDrowndown}
                showShoppingCart={showShoppingCart}
                setShowShoppingCart={setShowShoppingCart}
                navDropdown={navDropdown}
                setNavDropdown={setNavDropdown}
                loginSubmit={loginSubmit}
                handleUserSignOut={handleUserSignOut}
                handleProducerDashboard={handleProducerDashboard}
                handleAccount={handleAccount}
                handleWishlistClick={handleWishlistClick}
                headers={headers}
            />

            <WebsiteHeaderSmall
                iconSize={iconSize}
                iconClass={iconClass}
                dropDownMenuItemClass={dropDownMenuItemClass}
                userIn={userIn}
                setUserIn={setUserIn}
                displayUserDropdown={displayUserDropdown}
                setDisplayUserDrowndown={setDisplayUserDrowndown}
                showShoppingCart={showShoppingCart}
                setShowShoppingCart={setShowShoppingCart}
                navDropdown={navDropdown}
                setNavDropdown={setNavDropdown}
                loginSubmit={loginSubmit}
                handleUserSignOut={handleUserSignOut}
                handleProducerDashboard={handleProducerDashboard}
                handleAccount={handleAccount}
                handleWishlistClick={handleWishlistClick}
                headers={headers}
            />

        </div>

    </>
}