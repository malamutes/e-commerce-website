"use client";

import { createContext } from "react";
interface GlobalWishlistTrackerContextType {
    allWishlistedItems: Map<string, string[]>,
    addToWishlistedItems: (productID: string, wishListNames: string[]) => void,
    removeFromWishlistedItems: (productID: string) => void,
    updateWishlistedItem: (productID: string, wishListNames: string[]) => void,
    isItemWishlisted: (productID: string) => boolean,
    removeWishlist: (wishlist: string) => void
}

const GlobalWishlistTrackerContext = createContext<GlobalWishlistTrackerContextType>({
    allWishlistedItems: new Map(),
    addToWishlistedItems: (productID: string, wishListNames: string[]) => console.error('WishlistContext not provided: addToWishlist is missing'),
    updateWishlistedItem: (productID: string, wishListNames: string[]) => console.error('WishlistContext not provided: updateWishlistedItem is missing'),
    removeFromWishlistedItems: (productID: string) => console.error('WishlistContext not provided: removeFromWishlist is missing'),
    isItemWishlisted: (productID: string) => {
        console.error('WishlistContext not provided: isItemWishlisted is missing');
        return false;
    },
    removeWishlist: () => { }
});

export { GlobalWishlistTrackerContext }
