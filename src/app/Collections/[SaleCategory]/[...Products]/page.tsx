"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Product } from "@/app/ProducerDashboard/components/Products";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Carousel from "@/app/components/Carousel";

export default function ProductPage() {

    const [currentProduct, setCurrentProduct] = useState<Product[]>([]);
    const searchParams = useSearchParams();

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
            }
            else {
                alert("NO item found!")
                console.log(response.status, response.statusText);
            }
        };

        getProduct();


    }, [searchParams]);

    const titleClass = "flex justify-between pt-3 items-center cursor-pointer ";

    return <>
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
                            {currentProduct[0]['product_producer']}
                        </span>

                        <span className="text-3xl font-bold mb-3">
                            {currentProduct[0]['product_name']}
                        </span>

                        <span className="mb-3">
                            Sizes available In:
                            <div className="flex flex-row">
                                {(currentProduct[0]['product_size'] as string[]).map((size, sizeIndex) => (
                                    <div key={sizeIndex} className="w-[50px] 
                                          h-[50px] bg-white border-2 border-black m-2
                                          grid place-items-center">
                                        {size.charAt(0)}
                                    </div>
                                ))}
                            </div>
                        </span>

                        <span className="mb-3">
                            Colours available In:
                            <div className="flex flex-row">
                                {(currentProduct[0]['product_colour'] as string[]).map((colour, colourIndex) => (

                                    <div key={colourIndex} className="w-[50px] 
                                    h-[50px] bg-white border-2 border-black m-2
                                    grid place-items-center rounded-full">
                                    </div>
                                ))}
                            </div>
                        </span>


                        <div className="mb-3 md:text-start md:w-full w-3/4">
                            <span>
                                {currentProduct[0]['product_description']}
                            </span>

                            <span>
                                {currentProduct[0]['product_details']}
                            </span>

                        </div>

                        <span className="mb-3 text-lg text-gray-700">
                            ${currentProduct[0]['product_price']}
                        </span>

                        <button className="bg-green-700 p-4 text-white
                        w-5/6 mb-3
                        font-bold rounded-full">
                            ADD TO CART
                        </button>


                        <span className="text-md font-bold mb-3">
                            Product ID: <span className="font-light italic">{currentProduct[0]['product_id']}</span>
                        </span>
                    </div>

                </div>
            ) : (null)}
        </div>

    </>
}