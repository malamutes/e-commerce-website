"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { Product } from "@/app/ProducerDashboard/components/Products";
import Image from "next/image";
import Carousel from "@/app/components/Carousel";
import { ShoppingCartContext, ShoppingCartItem } from "@/app/(Contexts)/ShoppingCartContext";
import ShoppingCart from "@/app/components/ShoppingCart";
import WishlistBookmark from "@/app/components/WishlistBookmark";

export type VariantCombination = {
    [key: string]: string[];
};


export default function ProductPage() {

    const [currentProduct, setCurrentProduct] = useState<Product[]>([]);
    const [variantCombination, setVariantCombination] = useState<VariantCombination>({});
    const [currentColours, setCurrentColours] = useState<string[]>([]);
    const searchParams = useSearchParams();

    const [selectedColour, setSelectedColour] = useState("");
    const [selectedSize, setSelectedSize] = useState("");

    const [showCart, setShowCart] = useState(false);

    const shoppingCartContext = useContext(ShoppingCartContext);


    useEffect(() => {
        const productID = searchParams?.get("productID") ?? "";

        const getProduct = async () => {
            const response = await fetch(`/api/Collections/Products?productID=${productID}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const reply = await response.json();

            if (response.ok) {
                console.log(reply);
                setCurrentProduct(reply);
                setVariantCombination(reply[0]['variant_combination']);
            }
            else {
                alert("NO item found!")
                console.log(response.status, response.statusText);
            }
        };

        getProduct();


    }, [searchParams]);

    const addToCartSubmit = (cartItem: ShoppingCartItem) => {

        if (selectedColour !== "" && selectedSize !== "") {
            //valid selections
            shoppingCartContext.addItemToCart(cartItem);
            setShowCart(true);
        }
        else {
            alert("Please select colour and size before adding to cart!");
        }
    };

    //getting available colours based on size
    useEffect(() => {
        setCurrentColours(variantCombination[selectedSize]);
    }, [selectedSize])

    return <>
        <ShoppingCart show={showCart} setShow={setShowCart} />
        <div className="lg:container mx-auto mt-[25px]">
            {currentProduct[0] ? (
                <div className=" flex md:flex-row flex-col justify-between xl:w-11/12 w-full mx-auto pl-[25px] pr-[25px]">
                    <div className="w-1/12 flex flex-col lg:block hidden">
                        {(currentProduct[0]['product_images'] as string[]).map((image, index) => (
                            <Image
                                src={image}
                                alt={`ProductImage${index}`}
                                width={500}
                                height={500}
                                key={index}
                                className="mb-5"
                            />
                        ))}
                    </div>

                    <div className="md:w-8/12 w-full relative">
                        <div className="md:grid md:grid-cols-2 grid-cols-1 hidden gap-4 md:w-11/12 w-full mx-auto justify-items-center">
                            {(currentProduct[0]['product_images'] as string[]).map((image, index) => (
                                <Image
                                    src={image}
                                    alt={`ProductImage${index}`}
                                    width={1000}
                                    height={1000}
                                    key={index}
                                />
                            ))}
                        </div>

                        <div className="block md:hidden">
                            <Carousel itemsArray={currentProduct[0]['product_images'] as string[]} />
                        </div>
                    </div>

                    <div className="lg:w-3/12 md:w-4/12 w-full flex flex-col md:mt-[0px] 
                    mt-[25px] ">
                        <span className="text-2xl italic mb-3">
                            {currentProduct[0]['product_producer'] as string}
                        </span>

                        <span className="text-3xl font-bold mb-3">
                            {currentProduct[0]['product_name'] as string}
                        </span>

                        <span className="mb-3">
                            Sizes available In:
                            <div className="flex flex">
                                {Object.keys((currentProduct[0]['variant_combination'] as string[])).map((size, sizeIndex) => (
                                    <div key={sizeIndex} className={`w-[50px] 
                                          h-[50px] bg-transparent border-2 ${selectedSize === size ? "border-black" : "border-gray-400 "} m-2
                                          grid place-items-center cursor-pointer`}
                                        onClick={() => setSelectedSize(size)}>
                                        {size}
                                    </div>
                                ))}
                            </div>
                        </span>

                        <span className="mb-3">
                            Colours available In:
                            <div className="flex flex-row">
                                {(currentColours ?? []).map((colour, colourIndex) => (
                                    <div key={colourIndex} className={`rounded-full m-1 border-2 
                                    ${selectedColour === colour ? "border-black" : "border-gray-400 "} cursor-pointer`}
                                        onClick={() => setSelectedColour(colour)}>
                                        <div className="w-[50px] 
                                    h-[50px] bg-transparent m-[2.5px]
                                    grid place-items-center rounded-full"
                                            style={{ backgroundColor: colour }}>
                                        </div>
                                    </div>

                                ))}
                            </div>
                        </span>


                        <div className="mb-3 md:text-start md:w-full w-3/4">
                            <span>
                                {currentProduct[0]['product_description'] as string}
                            </span>

                            <span>
                                {currentProduct[0]['product_details'] as string}
                            </span>

                        </div>

                        <span className="mb-3 text-xl text-gray-700">
                            ${currentProduct[0]['product_price'] as string}
                        </span>

                        <button className="bg-green-700 p-4 text-white
                        w-5/6 mb-3
                        font-bold rounded-full"
                            onClick={() => addToCartSubmit(
                                {
                                    itemID: (currentProduct[0]['product_id'] as string),
                                    itemBrand: (currentProduct[0]['product_producer'] as string),
                                    itemTitle: (currentProduct[0]['product_name'] as string),
                                    itemColour: selectedColour,
                                    itemSize: selectedSize,
                                    itemCount: 0 /*...cartItem, itemCount: 1 makes it so its overriden to be 1 no matter what
                                        in shopping cart logic*/,
                                    itemImage: ((currentProduct[0]['product_images'] as string[])[0] as string),
                                    itemPrice: Number(currentProduct[0]['product_price'] ?? 0.00),
                                    itemCartKey: ""
                                })
                            }>
                            ADD TO CART
                        </button>

                        <div className="w-fit mb-3 ">
                            <WishlistBookmark />
                        </div>

                        <span className="text-md font-bold mb-3">
                            Product ID: <span className="font-light italic">{currentProduct[0]['product_id'] as string}</span>
                        </span>
                    </div>

                </div>
            ) : (null)}
        </div>

    </>
}