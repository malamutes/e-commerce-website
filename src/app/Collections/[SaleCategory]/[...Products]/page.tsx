"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Carousel from "@/app/components/Carousel";
import { ShoppingCartContext, ShoppingCartItem } from "@/app/Contexts/ShoppingCartContext";
import ShoppingCart from "@/app/components/ShoppingCart";
import WishlistBookmark from "@/app/components/WishlistBookmark";
import { ProductCardInterface } from "@/app/DataInterfaces";
import MainPageHeader from "@/app/components/MainPageHeader";
import LoadingComponent from "@/app/components/LoadingComponent";

export type VariantCombination = {
    [key: string]: string[];
};

interface ProductCardDetailsInterface extends ProductCardInterface {
    variant_combination: string[],
    product_details: string,
    product_description: string
}

export default function ProductPage() {

    const [currentProduct, setCurrentProduct] = useState<ProductCardDetailsInterface[]>([]);
    const [variantCombination, setVariantCombination] = useState<VariantCombination>({});

    const [relatedProducts, setRelatedProducts] = useState<ProductCardInterface[]>([]);

    const [currentColours, setCurrentColours] = useState<string[]>([]);
    const searchParams = useSearchParams();

    const [selectedColour, setSelectedColour] = useState("");
    const [selectedSize, setSelectedSize] = useState("");

    const [showCart, setShowCart] = useState(false);

    const [currentImageSelected, setCurrentImageSelected] = useState(0);

    const shoppingCartContext = useContext(ShoppingCartContext);

    const getRelatedProducts = async (pId: string) => {
        const relatedResponse = await fetch(`/api/Collections/Products?relatedProducts=true&productID=${pId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (relatedResponse.ok) {
            const reply = await relatedResponse.json();
            console.log(reply);
            setRelatedProducts(reply);
        }
        else {
            alert("NO related items found!")
            console.log(relatedResponse.status, relatedResponse.statusText);
        }
    }

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
                getRelatedProducts(productID);
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
    }, [selectedSize, variantCombination])

    const handleScrollWithOffset = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, index: number) => {
        event.preventDefault(); // Prevent the default anchor scroll

        setCurrentImageSelected(index);
        const target = document.querySelector(event.currentTarget.getAttribute("href") || "") as HTMLAnchorElement;

        if (target) {
            window.scrollTo({
                top: target.offsetTop,
                behavior: "smooth"
            });
        }

    };

    useEffect(() => {
        console.log(currentImageSelected)
    }, [currentImageSelected]);
    return <>
        <ShoppingCart show={showCart} setShow={setShowCart} />
        <div className="lg:container mx-auto mt-[25px] min-w-[275px]">
            {currentProduct[0] ? (
                <div className="flex md:flex-row flex-col justify-between xl:w-11/12 w-full mx-auto pl-[25px] pr-[25px]">
                    <div className="w-1/12 flex flex-col lg:block hidden flex flex-col sticky top-[11vh]
                    max-h-[800px] overflow-auto custom-scrollbar pr-[5px]">
                        {(currentProduct[0].product_images).map((image, index) =>
                        (
                            <a key={index} href={`#ProductImage-${Math.floor(index / 2)}`}
                                onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => handleScrollWithOffset(e, Math.floor(index / 2))}>
                                <Image
                                    src={image}
                                    alt={`ProductImage${index}`}
                                    width={500}
                                    height={500}
                                    className={`mb-5 ${currentImageSelected === Math.floor(index / 2)
                                        ? "border-2" : "border-0"}
                                    border-black p-[2px]`}
                                />
                            </a>
                        ))}
                    </div>

                    <div className="md:w-8/12 w-full relative">
                        <div className="md:grid md:grid-cols-2 grid-cols-1 hidden gap-4 md:w-11/12 w-full mx-auto justify-items-center">
                            {(currentProduct[0].product_images).map((image, index) => (
                                <Image
                                    src={image}
                                    alt={`ProductImage${index}`}
                                    width={1000}
                                    height={1000}
                                    key={index}
                                    id={`ProductImage-${Math.floor(index / 2)}`}
                                />
                            ))}
                        </div>

                        <div className="block md:hidden">
                            <Carousel itemsArray={currentProduct[0].product_images} />
                        </div>
                    </div>

                    <div className="lg:w-3/12 md:w-4/12 w-full flex flex-col md:mt-[0px] 
                    mt-[25px] md:text-start text-center sticky top-[11vh]
                    max-h-[800px] custom-scrollbar pr-[5px]">
                        <span className="text-2xl italic mb-3">
                            {currentProduct[0].product_producer}
                        </span>

                        <span className="text-3xl font-bold mb-3">
                            {currentProduct[0].product_name}
                        </span>

                        <span className="mb-3">
                            Sizes available In:
                            <div className="flex flex-row md:justify-start justify-center">
                                {Object.keys((currentProduct[0].variant_combination)).map((size, sizeIndex) => (
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
                            <div className="flex flex-row md:justify-start justify-center">
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


                        <div className="mb-3 md:text-start md:w-full w-5/6 md:mx-0 mx-auto">
                            <span>
                                {currentProduct[0].product_description}
                            </span>

                            <span>
                                {currentProduct[0]['product_details']}
                            </span>

                        </div>

                        <span className="mb-3 text-xl text-gray-700">
                            {(currentProduct[0].product_sale_price > 0 && currentProduct[0].product_sales_category.includes("Sale"))
                                ?
                                (
                                    <div className="flex flex-col gap-3">
                                        <span>
                                            <span className="text-red-600 font-bold mr-[2.5px]"> SALE ${currentProduct[0].product_sale_price}</span> <span className="line-through"> ${currentProduct[0].product_price}</span>
                                        </span>
                                        <div className="p-2 bg-red-600 text-white">
                                            {((currentProduct[0].product_price -
                                                currentProduct[0].product_sale_price) / currentProduct[0].product_price * 100).toFixed(0)}% OFF

                                        </div>
                                    </div>
                                )
                                :
                                (
                                    <span>
                                        ${currentProduct[0].product_price}
                                    </span>
                                )}

                        </span>

                        <button className="bg-green-700 p-4 text-white
                        w-5/6 mb-3 md:mx-0 mx-auto
                        font-bold rounded-full transition-all duration-300
                        hover:ring-[2.5px] hover:ring-custom-green hover:ring-offset-[3px] hover:bg-white hover:text-custom-green"
                            onClick={() => addToCartSubmit(
                                {
                                    itemID: (currentProduct[0].product_id),
                                    itemBrand: (currentProduct[0].product_producer),
                                    itemTitle: (currentProduct[0].product_name),
                                    itemColour: selectedColour,
                                    itemSize: selectedSize,
                                    itemCount: 0 /*...cartItem, itemCount: 1 makes it so its overriden to be 1 no matter what
                                        in shopping cart logic*/,
                                    itemImage: ((currentProduct[0].product_images)[0]),
                                    itemPrice: Number((currentProduct[0].product_sale_price > 0 && currentProduct[0].product_sales_category.includes("Sale"))
                                        ? currentProduct[0].product_sale_price : currentProduct[0].product_price),
                                    itemCartKey: ""
                                })
                            }>
                            ADD TO CART
                        </button>

                        <div className="w-fit mb-3 md:mx-0 mx-auto">
                            <WishlistBookmark
                                currentItemBrand={currentProduct[0].product_producer}
                                currentItemID={currentProduct[0].product_id}
                                currentItemImage={(currentProduct[0].product_images)[0]}
                                currentItemName={currentProduct[0].product_name}
                                left={true}
                            />
                        </div>

                        <span className="text-md font-bold mb-3">
                            Product ID: <span className="font-light italic">{currentProduct[0].product_id}</span>
                        </span>
                    </div>

                </div>
            ) : (

                <LoadingComponent
                    width="100"
                    height="100"
                    minHeight="min-h-[1000px]"
                />
            )}

            <div className="w-5/6 mx-auto mb-[50px]">
                <MainPageHeader
                    showButton={false}
                    categoryTitle="Related Products"
                    categoryArray={relatedProducts}
                    categories={false}
                    headerStyle={"shadow-none"}
                />
            </div>
        </div>

    </>
}