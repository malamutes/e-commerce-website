"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { useState, useContext } from "react";
import { useSession } from "next-auth/react";
import { GlobalLoginPromptContext } from "../(Contexts)/GlobalLoginPromptContext";

export default function WishlistBookmark() {
    const [showText, setShowText] = useState(false);

    const { setShowLoginPrompt, setMessage } = useContext(GlobalLoginPromptContext);

    const { data: session, status } = useSession();

    const addToWishlist = async () => {
        if (status === 'unauthenticated') {
            setMessage("Please login to wishlist an item!");
            setShowLoginPrompt(true);
        }
        else {
            alert("ADSAD")
        }
    }

    return <>
        <div className="bg-white border-2 border-black border-opacity-75
         p-2 flex flex-row items-center justify-center rounded-full shadow-lg cursor-pointer"
            onMouseEnter={() => setShowText(true)}
            onMouseLeave={() => setShowText(false)}
            onClick={addToWishlist}>
            <FontAwesomeIcon icon={faBookmark} className="w-[20px] h-[20px]" />

            <span className={`${showText ? "block" : "hidden"} text-xs ml-[5px] font-bold`}>
                Wishlist Me!
            </span>
        </div>
    </>
}