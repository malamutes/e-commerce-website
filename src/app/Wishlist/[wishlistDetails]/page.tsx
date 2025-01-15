"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { GlobalWishlistTrackerContext } from "@/app/(Contexts)/GlobalWishlistTrackerContext";
import { WishlistContext } from "@/app/(Contexts)/WishlistModalContext";

interface wishlistType {
    wishlist_name: string,
    product_wishlisted: string[]
}

export default function WishlistDetailPage() {
    const params = useParams();

    const [wishlists, setWishlists] = useState<wishlistType[]>([]);

    const { removeWishlist } = useContext(GlobalWishlistTrackerContext);
    const { setWishListArray } = useContext(WishlistContext);

    useEffect(() => {
        const getWishlistItems = async () => {
            const response = await fetch(`/api/Wishlist?requestType=getWishlistDetails&wishlistDetails=${params?.wishlistDetails}`, {
                method: "GET",
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const reply = await response.json();
                console.log(reply);
                setWishlists(reply);
            }
            else {
                alert(response.statusText + "NO PRODUCTS IN THIS WISHLIST")
            }
        }

        getWishlistItems();

    }, [params?.wishlistDetails])

    const router = useRouter();

    const handleRemoveWishlist = async (wishlistToDel: string) => {
        const response = await fetch(`/api/Wishlist?wishlistToDelete=${wishlistToDel}`, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
            }
        });

        if (response.ok) {
            removeWishlist(decodeURIComponent(wishlistToDel));
            setWishListArray((prevArray) => {
                const updatedArray = Array.from(prevArray.filter(wishlist => wishlist !== decodeURIComponent(wishlistToDel)));
                return updatedArray;
            });
            router.push('/Wishlist');
        }
        else {
            alert(response.statusText)
        }

    }

    return (
        <>
            {wishlists.map((wishlist) => (
                <div key={wishlist.wishlist_name}>
                    <span className="font-bold text-lg">
                        {wishlist.wishlist_name}
                    </span>

                    {wishlist.product_wishlisted.map((product) => (
                        <p key={wishlist.wishlist_name + product} className="italic">
                            {product}
                        </p>
                    ))}

                </div>
            ))}

            <button className="bg-black p-3 text-white"
                onClick={() => handleRemoveWishlist(params?.wishlistDetails as string)}>REMOVE WISHLIST</button>
        </>
    );
}
