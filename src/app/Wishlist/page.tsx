"use client";

import { useContext } from "react";
import { WishlistContext } from "../(Contexts)/WishlistModalContext";
import { GlobalWishlistTrackerContext } from "../(Contexts)/GlobalWishlistTrackerContext";
import Link from "next/link";

export default function WishlistOverviewPage() {
    const { wishListArray } = useContext(WishlistContext);
    const { allWishlistedItems } = useContext(GlobalWishlistTrackerContext);

    return <>
        {wishListArray.map((wishList) => {
            let counter = 0;
            for (const productWishlists of allWishlistedItems.values()) {
                if (productWishlists.includes(wishList)) {
                    counter += 1;
                }
            }
            return (
                <Link href={`/Wishlist/${wishList}`}
                    className="bg-black rounded-full m-5 p-3 text-white"
                    key={wishList}>
                    {wishList}, {counter}
                </Link>
            )
        }
        )}
    </>
}