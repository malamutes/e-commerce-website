"use client";

import { useEffect, useState } from "react"
import { GlobalWishlistTrackerContext } from "./GlobalWishlistTrackerContext";

export interface AssociatedWishlistsWithProduct {
    product_id: string,
    associated_wishlists: string[]
}

export default function GlobalWishlistTrackerContextWrapper({ children }: { children: React.ReactNode }) {

    const [allWishlistedItems, setAllWishlistedItems] = useState<Map<string, string[]>>(new Map());


    useEffect(() => {
        const getCurrentlyWishlistedItems = async () => {
            const response = await fetch(`/api/Wishlist?requestType=getWishlistedItems`, {
                method: "GET",
                headers: {
                    'Accept': 'application/json'
                }
            })

            if (response.ok) {
                const reply: AssociatedWishlistsWithProduct[] = await response.json()

                //console.log("WISHLSITED ITEMS IN GLOBAL TRACEKR", reply);
                setAllWishlistedItems((new Map(reply.map((item) => [item.product_id, item.associated_wishlists]))));

            }
            else {
                alert("DIDNT WORK TO GET WISHLISTED ITEMS IN TRACKER CONTEXT")
            }
        }

        getCurrentlyWishlistedItems()
    }, [])

    const addToWishlistedItems = (productID: string, wishListNames: string[]) => {
        setAllWishlistedItems((previousMap) => {
            const newMap = new Map(previousMap);
            newMap.set(productID, wishListNames);
            return newMap;
        });
    };

    const updateWishlistedItem = (productID: string, wishListNames: string[]) => {
        setAllWishlistedItems((previousMap) => {
            const updatedMap = new Map(previousMap);
            updatedMap.set(productID, wishListNames);
            return updatedMap;
        });
    };

    const removeFromWishlistedItems = (productID: string) => {
        setAllWishlistedItems((prevItems) => {
            const removedItemFromMap = new Map(prevItems);
            removedItemFromMap.delete(productID);
            return removedItemFromMap;
        });
    };

    const isItemWishlisted = (productID: string) => {
        return allWishlistedItems.has(productID);
    };

    const removeWishlist = (wishlistToDel: string) => {
        setAllWishlistedItems((prevItems) => {
            const removeWishlistFromMap = new Map(prevItems);
            for (let [productID, wishlistArray] of removeWishlistFromMap.entries()) {
                if (wishlistArray.includes(wishlistToDel)) {
                    removeWishlistFromMap.set(productID, wishlistArray.filter(wishlist => wishlist !== wishlistToDel))
                }
            }
            return removeWishlistFromMap;
        })

    }

    useEffect(() => {
        console.log("ITEMS WISHLISTED", allWishlistedItems);
    }, [allWishlistedItems]);

    return (
        <GlobalWishlistTrackerContext.Provider
            value={{
                allWishlistedItems,
                addToWishlistedItems,
                updateWishlistedItem,
                removeFromWishlistedItems,
                isItemWishlisted,
                removeWishlist
            }}
        >
            {children}
        </GlobalWishlistTrackerContext.Provider>
    );
}