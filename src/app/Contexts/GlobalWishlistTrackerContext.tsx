"use client";

import { createContext, SetStateAction } from "react";
interface GlobalWishlistTrackerContextType {
    allWishlistedItems: Map<string, string[]>,
    setAllWishlistedItems: React.Dispatch<SetStateAction<Map<string, string[]>>>,
    addToWishlistedItems: (productID: string, wishListNames: string[]) => void,
    removeFromWishlistedItems: (productID: string) => void,
    updateWishlistedItem: (productID: string, wishListNames: string[]) => void,
    isItemWishlisted: (productID: string) => boolean,
    removeWishlist: (wishlist: string) => void
}

const GlobalWishlistTrackerContext = createContext<GlobalWishlistTrackerContextType>({
    allWishlistedItems: new Map(),
    setAllWishlistedItems: () => { },
    addToWishlistedItems: (productID: string, wishListNames: string[]) => {
        console.error('WishlistContext not provided: addToWishlist is missing', { productID, wishListNames });
    },
    updateWishlistedItem: (productID: string, wishListNames: string[]) => {
        console.error('WishlistContext not provided: updateWishlistedItem is missing', { productID, wishListNames });
    },
    removeFromWishlistedItems: (productID: string) => {
        console.error('WishlistContext not provided: removeFromWishlist is missing', { productID });
    },
    isItemWishlisted: (productID: string) => {
        console.error('WishlistContext not provided: isItemWishlisted is missing', { productID });
        return false;
    },
    removeWishlist: () => { }
});


export { GlobalWishlistTrackerContext }
