"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { useState, useContext, useEffect } from "react";
import { useSession } from "next-auth/react";
import { GlobalLoginPromptContext } from "../Contexts/GlobalLoginPromptContext";
import { WishlistContext } from "../Contexts/WishlistModalContext";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { GlobalWishlistTrackerContext } from "../Contexts/GlobalWishlistTrackerContext";

//<a href="https://www.flaticon.com/free-icons/saved" title="saved icons">Saved icons created by NX Icon - Flaticon</a>
//<a href="https://www.flaticon.com/free-icons/bookmark" title="bookmark icons">Bookmark icons created by Freepik - Flaticon</a>

interface WishlistBookmarkProps {
    currentItemBrand: string;
    currentItemName: string;
    currentItemImage: string;
    currentItemID: string,
    left?: boolean
}

export default function WishlistBookmark(props: WishlistBookmarkProps) {
    const [showText, setShowText] = useState(false);

    const { setShowLoginPrompt, setMessage } = useContext(GlobalLoginPromptContext);
    const { setShowModal, setCurrentItemBrand,
        setCurrentItemImage, setCurrentItemName, setCurrentItemID, setUpdate }
        = useContext(WishlistContext);

    const { isItemWishlisted, allWishlistedItems } = useContext(GlobalWishlistTrackerContext);
    const [itemWishlisted, setItemWishlisted] = useState(isItemWishlisted(props.currentItemID))

    useEffect(() => {
        setItemWishlisted(isItemWishlisted(props.currentItemID));
    }, [allWishlistedItems])

    const { status } = useSession();

    const addToWishlist = async () => {
        if (status === 'unauthenticated') {
            setMessage("Please login to wishlist an item!");
            setShowLoginPrompt(true);
        }
        else {
            setCurrentItemBrand(props.currentItemBrand);
            setCurrentItemImage(props.currentItemImage);
            setCurrentItemName(props.currentItemName);
            setCurrentItemID(props.currentItemID);
            setUpdate(false);
            setShowModal(true);
        }
    }

    const updateWishList = async () => {
        setCurrentItemBrand(props.currentItemBrand);
        setCurrentItemImage(props.currentItemImage);
        setCurrentItemName(props.currentItemName);
        setCurrentItemID(props.currentItemID);
        setUpdate(true);
        setShowModal(true);
    }

    return <>
        {itemWishlisted
            ?
            (<div className="bg-white border-2 border-black border-opacity-75 w-[40px]
                h-[40px]
                p-2 flex flex-row items-center justify-center rounded-full shadow-lg cursor-pointer
                transition-all duration-250 hover:w-[125px] flex-nowrap"
                onMouseEnter={() => setShowText(true)}
                onMouseLeave={() => setShowText(false)}
                onClick={updateWishList}>
                <FontAwesomeIcon icon={faCheck} className="w-[20px] h-[20px]" />

                <span className={`${showText ? "relative inline transition-all delay-250 duration-500 opacity-100"
                    : "absolute opacity-0"} text-xs ml-[5px] font-bold`}>
                    Item Wishlisted!
                </span>
            </div>)
            :
            (<div className="bg-white border-2 border-black border-opacity-75 w-[40px]
                h-[40px]
         p-2 flex flex-row items-center justify-center rounded-full shadow-lg cursor-pointer
         transition-all duration-250 hover:w-[125px] flex-nowrap"
                onMouseEnter={() => setShowText(true)}
                onMouseLeave={() => setShowText(false)}
                onClick={addToWishlist}>

                {props.left
                    ?
                    (
                        <>
                            <span className={` ${showText ? "relative inline transition-all delay-250 duration-500 opacity-100"
                                : "absolute opacity-0"}
                    text-xs mr-[5px] font-bold`}>
                                Wishlist Me!
                            </span>

                            <FontAwesomeIcon icon={faBookmark} className="w-[20px] h-[20px]" />
                        </>
                    )
                    :
                    (
                        <>
                            <FontAwesomeIcon icon={faBookmark} className="w-[20px] h-[20px]" />

                            <span className={` ${showText ? "relative inline transition-all delay-250 duration-500 opacity-100"
                                : "absolute opacity-0"}
                    text-xs ml-[5px] font-bold`}>
                                Wishlist Me!
                            </span>
                        </>
                    )}

            </div>)}

    </>
}