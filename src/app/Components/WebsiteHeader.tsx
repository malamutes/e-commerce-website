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
import { GlobalLoginPromptContext } from "../Contexts/GlobalLoginPromptContext";
import { ProductCardInterface } from "../DataInterfaces";
import { FullScreenLoadingComponent } from "./LoadingComponent";

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

    headers: string[];
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    searchQueryProducts: ProductCardInterface[];
    setSearchQueryProducts: React.Dispatch<React.SetStateAction<ProductCardInterface[]>>;
    noResultMessage: string;
    setNoResultMessage: React.Dispatch<React.SetStateAction<string>>;
    searchQueryTotalCount: number,
    setSearchQueryTotalCount: React.Dispatch<React.SetStateAction<number>>;
    showLoadingUI: boolean,
    setShowLoadingUI: React.Dispatch<React.SetStateAction<boolean>>;
}

interface DropdownMenu {
    dropdownItems: string[],
    dropdownTitle: string,
    classname?: string,
    style?: React.CSSProperties
}

export function DropdownMenu(props: DropdownMenu) {
    const [closeMenu, setCloseMenu] = useState(true);
    const iconClass = "xs:mx-1.5 mx-1 cursor-pointer transition-transform duration-250 hover:scale-110";
    return <>
        <div className={`flex flex-col p-5 ${props.classname}`} style={props.style}>
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

            <div
                className={`flex flex-col overflow-hidden transition-all duration-500 ease-in-out
                ${closeMenu ? "hidden" : "block"}`}>
                {props.dropdownItems.map((item, index) => {
                    let dynamicUrl: string = "";
                    if (props.dropdownTitle === 'Products') {
                        dynamicUrl = `/Collections?featuredCategory=All&clothingCategory=${item}`
                    }
                    else if (props.dropdownTitle === 'Featured') {
                        dynamicUrl = `/Collections/?featuredCategory=${item}&clothingCategory=All`
                    }
                    else {
                        dynamicUrl = ""
                    }

                    return (
                        <Link
                            key={index}
                            href={dynamicUrl}
                            className={`
                                hover:shadow-lg rounded-lg cursor-pointer p-[5px] hover:bg-gray-300 w-fit
                            `}
                        >
                            <span>{item}</span>
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
    const dropDownMenuItemClass = "text-white ml-[40px] font-bold text-sm hover:bg-gray-200 hover:text-black w-fit p-3 cursor-pointer rounded-lg";

    const [userIn, setUserIn] = useState(false);
    const [displayUserDropdown, setDisplayUserDrowndown] = useState(false);

    const [navDropdown, setNavDropdown] = useState(-1);
    const [showShoppingCart, setShowShoppingCart] = useState(false);

    const { setShowLoginPrompt, setMessage } = useContext(GlobalLoginPromptContext);

    const { status } = useSession();

    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [searchQueryProducts, setSearchQueryProducts] = useState<ProductCardInterface[]>([]);
    const [noResultMessage, setNoResultMessage] = useState("");
    const [searchQueryTotalCount, setSearchQueryTotalCount] = useState(0);

    const [showLoadingUI, setShowLoadingUI] = useState(false);

    const [showFullScreenLoading, setShowFullScreenLoading] = useState(false);

    const loginSubmit = async () => {
        if (!userIn) {
            router.push('/LoginPage');
        }
    }

    const handleUserSignOut = async () => {
        try {
            setShowFullScreenLoading(true);
            await signOut({ callbackUrl: '/' });
            setShowFullScreenLoading(false);
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
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setNoResultMessage={setNoResultMessage}
                noResultMessage={noResultMessage}
                setSearchQueryProducts={setSearchQueryProducts}
                searchQueryProducts={searchQueryProducts}
                searchQueryTotalCount={searchQueryTotalCount}
                setSearchQueryTotalCount={setSearchQueryTotalCount}
                showLoadingUI={showLoadingUI}
                setShowLoadingUI={setShowLoadingUI}
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
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setNoResultMessage={setNoResultMessage}
                noResultMessage={noResultMessage}
                setSearchQueryProducts={setSearchQueryProducts}
                searchQueryProducts={searchQueryProducts}
                searchQueryTotalCount={searchQueryTotalCount}
                setSearchQueryTotalCount={setSearchQueryTotalCount}
                showLoadingUI={showLoadingUI}
                setShowLoadingUI={setShowLoadingUI}
            />
        </div>

        <FullScreenLoadingComponent
            show={showFullScreenLoading}
            setShow={setShowFullScreenLoading}
        />
    </>
}