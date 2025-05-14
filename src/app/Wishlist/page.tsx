"use client";

import { useContext, useEffect } from "react";
import { WishlistContext } from "../Contexts/WishlistModalContext";
import { GlobalWishlistTrackerContext } from "../Contexts/GlobalWishlistTrackerContext";
import Link from "next/link";

export default function WishlistOverviewPage() {
    const { wishListArray } = useContext(WishlistContext);
    const { allWishlistedItems } = useContext(GlobalWishlistTrackerContext);

    useEffect(() => {
        console.log(wishListArray);
    }, [wishListArray])

    return <>
        <div className="min-h-[500px] min-w-[300px]">
            <div className="lg:w-3/5 w-4/5 mx-auto p-5 flex flex-col gap-5">
                <div className="bg-gray-300 w-fit pr-10 pl-10 pt-3 pb-3
                 rounded-full mx-auto shadow-lg">
                    <span className="text-3xl font-bold">
                        Wishlists
                    </span>
                </div>

                <p className="mx-auto italic text-md">
                    You can find all your wisthlists here, with listed items inside!
                </p>

                <div className="grid md:grid-cols-2">
                    {wishListArray.map((wishList) => {
                        let counter = 0;
                        for (const productWishlists of allWishlistedItems.values()) {
                            if (productWishlists.includes(wishList)) {
                                counter += 1;
                            }
                        }
                        return (
                            <Link href={`/Wishlist/${wishList}`}
                                className="bg-white sm:rounded-full rounded-2xl m-5 p-3 shadow-lg
                                flex flex-col text-center border-2  transition-all duration-300
                                border-black border-opacity-0 hover:border-opacity-75"
                                key={wishList}>
                                <span>
                                    {wishList}
                                </span>
                                <span>
                                    {counter} Products
                                </span>
                            </Link>
                        )
                    }
                    )}
                </div>
            </div>


        </div>

    </>
}