"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { GlobalWishlistTrackerContext } from "@/app/Contexts/GlobalWishlistTrackerContext";
import { WishlistContext } from "@/app/Contexts/WishlistModalContext";
import ProductCard from "@/app/Collections/components/ProductCard";
import { ShoppingCartContext } from "@/app/Contexts/ShoppingCartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCircleXmark, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import LoadingComponent, { FullScreenLoadingComponent } from "@/app/components/LoadingComponent";
import { ProductCardInterface } from "@/app/DataInterfaces";

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

interface ProductCardVariantInterface extends ProductCardInterface {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    variant_combination: {}
}

export default function WishlistDetailPage() {
    const params = useParams();

    const [wishlists, setWishlists] = useState<ProductCardVariantInterface[]>([]);

    const { removeWishlist, allWishlistedItems } = useContext(GlobalWishlistTrackerContext);
    const { setWishListArray } = useContext(WishlistContext);
    const [showAddToCartModal, setShowAddToCartModal] = useState(false);

    const [addToCartMap, setAddToCartMap] = useState<Map<string, addToCartMapType>>(new Map());

    const { addItemToCart } = useContext(ShoppingCartContext);

    const [showLoadingUI, setShowLoadingUI] = useState(true);
    const [showFullLoadingUI, setShowFullLoadingUI] = useState(false);

    useEffect(() => {
        const getWishlistItems = async () => {
            setShowLoadingUI(true);
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
            setShowLoadingUI(false);
        }

        getWishlistItems();
    }, [params?.wishlistDetails, allWishlistedItems])

    const router = useRouter();

    const handleRemoveWishlist = async (wishlistToDel: string) => {
        setShowFullLoadingUI(true);
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
            //alert(response.statusText)
        }
        setShowFullLoadingUI(false);
    }

    const handleAddToCart = () => {
        setShowFullLoadingUI(true);
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
        setShowFullLoadingUI(false);
    }

    useEffect(() => {
        console.log(addToCartMap)
    }, [addToCartMap]);

    return (
        <>
            <div className="flex flex-col gap-5 items-center p-5 min-w-[280px]">
                <span className="font-bold text-2xl leading-relaxed text-center">
                    {params?.wishlistDetails} <br />
                    <span className="italic text-gray-600 text-lg">You have wishlisted {wishlists.length} items!</span>
                </span>


                <div className="container mx-auto">
                    {showLoadingUI
                        ?
                        (
                            <LoadingComponent
                                width="100"
                                height="100"
                                minHeight="min-h-[250px]"
                            />
                        )
                        :
                        (
                            <div className="xl:w-4/5 md:w-10/12 w-full grid xl:grid-cols-4 
                            md:grid-cols-3 3xs:grid-cols-2 grid-cols-1 gap-5 mx-auto auto-rows-fr">
                                {wishlists.map((wishlistItem) => (
                                    <div key={wishlistItem.product_id as string} className="h-full self-stretch">
                                        <ProductCard product={wishlistItem} />
                                    </div>
                                ))}
                            </div>
                        )}

                </div>

                <div className="flex 3xs:flex-row flex-col gap-10 mt-[25px] 3xs:w-auto w-11/12">
                    <button className="bg-black p-3 text-white transition-all duration-300
                        hover:ring-[2.5px] hover:ring-black hover:ring-offset-[3px] hover:bg-white hover:text-black font-bold"
                        onClick={() => handleRemoveWishlist(params?.wishlistDetails as string)}>REMOVE WISHLIST</button>

                    <button className="bg-black p-3 text-white transition-all duration-300
                        hover:ring-[2.5px] hover:ring-black hover:ring-offset-[3px] hover:bg-white hover:text-black font-bold"
                        onClick={() => { router.push('/Wishlist') }}>BACK TO WISHLISTS</button>

                    <button className="bg-black p-3 text-white transition-all duration-300
                        hover:ring-[2.5px] hover:ring-black hover:ring-offset-[3px] hover:bg-white hover:text-black font-bold"
                        onClick={() => setShowAddToCartModal(true)}>ADD TO CART</button>
                </div>

            </div>

            <div className={`top-0 left-0 w-screen h-screen 
                    grid place-items-center ${showAddToCartModal ? "fixed " : "hidden"}`}>

                <div className="fixed w-screen h-screen bg-black opacity-75 top-0 left-0"
                    onClick={() => setShowAddToCartModal(false)}>

                </div>

                <div className="relative 2xl:w-1/2 3xs:w-3/5 w-5/6 min-w-[250px]">
                    <div className="flex flex-col gap-5 bg-gray-200 p-5
                    overflow-auto max-h-[500px]" style={{ zIndex: 1 }}>

                        <span className="text-2xl font-bold bg-gray-300 p-3 rounded-xl">
                            Add wishlisted items to cart!
                        </span>

                        <div className="grid md:grid-cols-2 grid-cols-1 gap-y-5 gap-x-10 p-2">
                            {wishlists.map((product) => (
                                <div key={product.product_id as string} className="flex flex-col gap-1 bg-gray-300 p-3 rounded-xl">
                                    <div className="flex flex-col gap-1">
                                        <div>
                                            <span className="font-bold text-lg">{product.product_name as string} </span><br />
                                            <span className="text-gray-700 italic text-lg">- {product['product_producer'] as string}</span>
                                        </div>


                                        <div className="w-fit"
                                            onClick={(() => {
                                                const newAddToCartMap = new Map(addToCartMap);
                                                if (newAddToCartMap.has(product.product_id as string)) {
                                                    newAddToCartMap.delete(product.product_id as string)
                                                }
                                                else {
                                                    newAddToCartMap.set(product.product_id as string, {
                                                        generalItemInfo: {
                                                            itemBrand: product['product_producer'] as string,
                                                            itemCount: 0 as number,
                                                            itemID: product.product_id as string,
                                                            itemImage: (product.product_images as string[])[0] as string,
                                                            itemPrice: (product.product_sale_price > 0 && product.product_sales_category.includes("Sale"))
                                                                ? product.product_sale_price : product.product_price as number,
                                                            itemTitle: product.product_name as string
                                                        },
                                                        specificItemInfo: {}
                                                    })
                                                }

                                                setAddToCartMap(newAddToCartMap);
                                            })}
                                        >

                                            {addToCartMap.has(product.product_id as string)
                                                ? <FontAwesomeIcon icon={faCheckCircle} className="text-[25px] cursor-pointer" />
                                                : <FontAwesomeIcon icon={faPlusCircle} className="text-[25px] cursor-pointer" />}

                                        </div>
                                    </div>

                                    {(product['variant_combination'] as []).map((combination, index) => {
                                        // Define local state or other logic here
                                        return (
                                            <div key={index} className={`
                                                ${addToCartMap.has(product.product_id as string) ?
                                                    "text-gray-800 pointer-events-auto " :
                                                    "text-gray-400 pointer-events-none"}
                                                `}
                                            >
                                                {(combination['colours'] as string[]).map((colour) => {
                                                    return (
                                                        <p
                                                            key={colour}
                                                            className={`cursor-pointer w-fit mb-1 pr-2 pl-2 pt-1 pb-1 rounded-full 
                                                                        border-2 border-black border-opacity-0 hover:border-opacity-100
                                                                ${Object.keys((addToCartMap.get(product.product_id as string) ?? {}).specificItemInfo ?? {}).includes(combination['size'])
                                                                    && (addToCartMap.get(product.product_id as string)?.specificItemInfo?.[combination['size']].includes(colour) ?? false)
                                                                    ? "text-black font-bold border-2 border-black border-opacity-100 bg-gray-300"
                                                                    : ""}`}

                                                            onClick={() => {
                                                                const newAddToCartMap = new Map(addToCartMap);

                                                                const currentProductInfo = newAddToCartMap.get(product.product_id as string);

                                                                const generalItemInfo = currentProductInfo?.generalItemInfo ?? {
                                                                    itemBrand: product['product_producer'] as string,
                                                                    itemCount: 0 as number,
                                                                    itemID: product.product_id as string,
                                                                    itemImage: (product.product_images as string[])[0] as string,
                                                                    itemPrice: (product.product_sale_price > 0 && product.product_sales_category.includes("Sale"))
                                                                        ? product.product_sale_price : product.product_price as number,
                                                                    itemTitle: product.product_name as string
                                                                }

                                                                if ((newAddToCartMap.get(product.product_id as string)?.specificItemInfo?.[combination['size']] ?? []).includes(colour) ?? false) {
                                                                    newAddToCartMap.set(product.product_id as string,
                                                                        {
                                                                            generalItemInfo: generalItemInfo,
                                                                            specificItemInfo: {
                                                                                ...currentProductInfo?.specificItemInfo,
                                                                                [combination['size']]: currentProductInfo?.specificItemInfo?.[combination['size']].filter(colours => colours !== colour)
                                                                            }
                                                                        })
                                                                }
                                                                else {
                                                                    newAddToCartMap.set(product.product_id as string,
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
                                                            {combination['size']} - {colour}
                                                        </p>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                        <button className="bg-black p-3 text-white rounded-xl  transition-all duration-300
                        hover:ring-[2.5px] hover:ring-black hover:ring-offset-[3px] hover:bg-white hover:text-black"
                            onClick={() => handleAddToCart()}>ADD TO CART</button>
                    </div>

                    <FontAwesomeIcon icon={faCircleXmark}
                        className="absolute right-0 text-[35px] top-0 -translate-y-[45px] cursor-pointer"
                        onClick={() => setShowAddToCartModal(false)}
                        style={{ filter: 'invert(1)' }}
                    />
                </div>
            </div>

            <FullScreenLoadingComponent
                show={showFullLoadingUI}
                setShow={setShowFullLoadingUI}
            />
        </>
    );
}
