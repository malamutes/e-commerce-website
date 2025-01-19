"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { GlobalWishlistTrackerContext } from "@/app/(Contexts)/GlobalWishlistTrackerContext";
import { WishlistContext } from "@/app/(Contexts)/WishlistModalContext";
import { Product } from "@/app/ProducerDashboard/components/Products";
import ProductCard from "@/app/Collections/components/ProductCard";
import { ShoppingCartContext } from "@/app/(Contexts)/ShoppingCartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

interface generalItemInfoType {
    itemTitle: string,
    itemImage: string,
    itemCount: number,
    itemPrice: number
    itemBrand: string,
    itemID: string,
}

interface addToCartMapType {
    generalItemInfo: generalItemInfoType,
    specificItemInfo: { [key: string]: string[] }
}

export default function WishlistDetailPage() {
    const params = useParams();

    const [wishlists, setWishlists] = useState<Product[]>([]);

    const { removeWishlist, allWishlistedItems } = useContext(GlobalWishlistTrackerContext);
    const { setWishListArray } = useContext(WishlistContext);
    const [showAddToCartModal, setShowAddToCartModal] = useState(false);

    const [addToCartMap, setAddToCartMap] = useState<Map<string, addToCartMapType>>(new Map());

    const { addItemToCart } = useContext(ShoppingCartContext);

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
                console.log("GETTING PRODUCTS IN WISHLIST!", reply);
                setWishlists(reply);
            }
            else {
                alert(response.statusText + "NO PRODUCTS IN THIS WISHLIST")
            }
        }

        getWishlistItems();

    }, [params?.wishlistDetails, allWishlistedItems])

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

    const handleAddToCart = () => {
        for (const [productID, itemInfo] of addToCartMap.entries()) {
            (Object.keys(itemInfo.specificItemInfo)).map((size) => {
                itemInfo.specificItemInfo[size].map((colour) => {
                    addItemToCart({
                        itemBrand: addToCartMap.get(productID)?.generalItemInfo.itemBrand as string,
                        itemCartKey: `SKU-${addToCartMap.get(productID)?.generalItemInfo.itemID}-${colour}-${size}`,
                        itemColour: colour,
                        itemCount: 1,
                        itemID: addToCartMap.get(productID)?.generalItemInfo.itemID as string,
                        itemImage: addToCartMap.get(productID)?.generalItemInfo.itemImage as string,
                        itemPrice: addToCartMap.get(productID)?.generalItemInfo.itemPrice as number,
                        itemSize: size,
                        itemTitle: addToCartMap.get(productID)?.generalItemInfo.itemTitle as string
                    })
                })
            })
        }

        setShowAddToCartModal(false);
        setAddToCartMap(new Map());
        alert("ITEMS ADDED TO CART!");
    }

    useEffect(() => {
        console.log(addToCartMap)
    }, [addToCartMap]);

    return (
        <>
            <div className="flex flex-col gap-5 items-center p-5 min-w-[280px]">
                <span className="font-bold text-2xl leading-relaxed text-center">
                    {params?.wishlistDetails} <br />
                    <span className="italic text-gray-400 text-xl">{wishlists.length} Items</span>
                </span>


                <div className="container mx-auto">
                    <div className="xl:w-4/5 md:w-10/12 w-full grid xl:grid-cols-4 md:grid-cols-3 3xs:grid-cols-2 grid-cols-1 gap-5 mx-auto">
                        {wishlists.map((wishlistItem) => (
                            <div key={wishlistItem['product_id'] as string}>
                                <ProductCard
                                    product={wishlistItem}
                                />

                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex 3xs:flex-row flex-col gap-10 mt-[25px] max-w-[4/5]">
                    <button className="bg-black p-3 text-white"
                        onClick={() => handleRemoveWishlist(params?.wishlistDetails as string)}>REMOVE WISHLIST</button>

                    <button className="bg-black p-3 text-white"
                        onClick={() => { router.push('/Wishlist') }}>BACK TO WISHLISTS</button>

                    <button className="bg-black p-3 text-white"
                        onClick={() => setShowAddToCartModal(true)}>ADD TO CART</button>
                </div>

            </div>

            <div className={`top-0 left-0 w-screen h-screen 
                grid place-items-center ${showAddToCartModal ? "fixed " : "hidden"}`}>

                <div className="fixed w-screen h-screen bg-black opacity-75 top-0 left-0"
                    onClick={() => setShowAddToCartModal(false)}>

                </div>
                <div className="w-3/5 flex flex-col gap-5 bg-gray-200 relative p-5 mt-[100px]
                overflow-auto max-h-[500px]" style={{ zIndex: 1 }}>
                    <FontAwesomeIcon icon={faCircleXmark}
                        className="absolute right-0 text-[30px] -translate-y-[60px]"
                        onClick={() => setShowAddToCartModal(false)}
                        style={{ filter: 'invert(1)' }} />
                    <span className="text-center text-xl font-bold">
                        Add wishlist items to cart!
                    </span>

                    <button className="bg-black p-3 text-white"
                        onClick={() => handleAddToCart()}>ADD TO CART</button>

                    {wishlists.map((product) => (
                        <div key={product['product_id'] as string} className="flex flex-col">
                            <span>
                                {product['product_name'] as string}, {product['product_producer'] as string}
                            </span>


                            <div className={`w-[25px] h-[25px] 
                            ${addToCartMap.has(product['product_id'] as string) ? "bg-red-900" : "bg-purple-900"}`}
                                onClick={(() => {
                                    const newAddToCartMap = new Map(addToCartMap);
                                    if (newAddToCartMap.has(product['product_id'] as string)) {
                                        newAddToCartMap.delete(product['product_id'] as string)
                                    }
                                    else {
                                        newAddToCartMap.set(product['product_id'] as string, {
                                            generalItemInfo: {
                                                itemBrand: product['product_producer'] as string,
                                                itemCount: 0 as number,
                                                itemID: product['product_id'] as string,
                                                itemImage: (product['product_images'] as string[])[0] as string,
                                                itemPrice: product['product_price'] as number,
                                                itemTitle: product['product_name'] as string
                                            },
                                            specificItemInfo: {}
                                        })
                                    }

                                    setAddToCartMap(newAddToCartMap);
                                })}
                            >

                            </div>
                            {(product['variant_combination'] as []).map((combination, index) => {
                                // Define local state or other logic here
                                return (
                                    <div key={index} className={`
                                    ${addToCartMap.has(product['product_id'] as string) ?
                                            "text-gray-600 pointer-events-auto" :
                                            "text-gray-300 pointer-events-none"}
                                    `}
                                    >
                                        {(combination['colours'] as string[]).map((colour) => {
                                            return (
                                                <p
                                                    key={colour}
                                                    className={`cursor-pointer border-2 border-black w-fit m-2
                                                    ${Object.keys((addToCartMap.get(product['product_id'] as string) ?? {}).specificItemInfo ?? {}).includes(combination['size'])
                                                            && (addToCartMap.get(product['product_id'] as string)?.specificItemInfo?.[combination['size']].includes(colour) ?? false)
                                                            ? "text-black font-bold"
                                                            : ""}`}

                                                    onClick={() => {
                                                        const newAddToCartMap = new Map(addToCartMap);

                                                        const currentProductInfo = newAddToCartMap.get(product['product_id'] as string);
                                                        const currentProductVariantCombination = currentProductInfo?.specificItemInfo;

                                                        const generalItemInfo = currentProductInfo?.generalItemInfo ?? {
                                                            itemBrand: product['product_producer'] as string,
                                                            itemCount: 0 as number,
                                                            itemID: product['product_id'] as string,
                                                            itemImage: (product['product_images'] as string[])[0] as string,
                                                            itemPrice: product['product_price'] as number,
                                                            itemTitle: product['product_name'] as string
                                                        }

                                                        if ((newAddToCartMap.get(product['product_id'] as string)?.specificItemInfo?.[combination['size']] ?? []).includes(colour) ?? false) {
                                                            newAddToCartMap.set(product['product_id'] as string,
                                                                {
                                                                    generalItemInfo: generalItemInfo,
                                                                    specificItemInfo: {
                                                                        ...currentProductInfo?.specificItemInfo,
                                                                        [combination['size']]: currentProductInfo?.specificItemInfo?.[combination['size']].filter(colours => colours !== colour)
                                                                    }
                                                                })
                                                        }
                                                        else {
                                                            newAddToCartMap.set(product['product_id'] as string,
                                                                {
                                                                    generalItemInfo: generalItemInfo,
                                                                    specificItemInfo: {
                                                                        ...currentProductInfo?.specificItemInfo,
                                                                        [combination['size']]: currentProductInfo?.specificItemInfo?.[combination['size']]
                                                                            ? [...currentProductInfo.specificItemInfo[combination['size']], colour]
                                                                            : [colour]
                                                                    }
                                                                })

                                                        }


                                                        setAddToCartMap(newAddToCartMap);
                                                    }}>
                                                    {combination['size']} :{colour}
                                                </p>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
