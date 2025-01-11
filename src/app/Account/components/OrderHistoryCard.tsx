"use client";

import { UserOrderHistory } from "@/app/DataInterfaces";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleRight, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { clampFunc } from "@/app/components/Carousel";
import Link from "next/link";
import { useMatchMediaQuery } from "@/app/MatchMediaQuery";

const orderStatusMap: { [key: string]: string } = {
    'COMPLETED': 'green',
    'CANCELLED': 'red',
    'SHIPPING': 'blue',
    'REFUNDED': 'purple'
}

export default function OrderHistoryCard(props: UserOrderHistory) {
    const [numItemsDisplay, setNumItemsDisplay] = useState(3);
    const [distance, setDistance] = useState(0);
    const totalNumItems = props.orders_image.length;
    const more1536px = useMatchMediaQuery({ size: 1536 });
    const more360px = useMatchMediaQuery({ size: 360 });

    useEffect(() => {
        if (more1536px) {
            setNumItemsDisplay(3);
        } else if (more360px) {
            setNumItemsDisplay(2);
        } else if (!more360px) {
            setNumItemsDisplay(1);
        }

    }, [more1536px, more360px]);


    return <>
        <div >
            <div className="flex md:flex-row flex-col shadow-lg p-2 gap-3">
                <div className="2xl:w-6/12 md:w-5/12 w-full flex flex-col gap-2 justify-center ">
                    <span className="font-bold">
                        ORDER ID: {props.orders_id}
                    </span>
                    <span className="italic">
                        {new Date(props.orders_order_time).toLocaleString("en-GB", {
                            timeZone: "UTC",
                            day: "numeric",
                            month: "short", // Abbreviated month name
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false, // 24-hour format
                        }) + " UTC"}
                    </span>

                    <span className="font-bold">
                        ${props.orders_total_price}
                    </span>

                    <div className="flex 2xl:flex-row flex-col 2xl:gap-3 gap-5 2xl:mb-[0px] mb-[5px]">
                        <span>
                            Order is <span className="text-white p-[5px] rounded-xl"
                                style={{ backgroundColor: orderStatusMap[props.orders_order_status] }}
                            >{props.orders_order_status}</span>.
                        </span>

                        <Link href={`/Account/Orders?ordersID=${props.orders_id}`}>
                            <span className="font-bold pt-2 pb-2 pr-5 pl-5 
                            text-sm text-white bg-black rounded-full">
                                VIEW ORDER DETAILS
                            </span>
                        </Link>
                    </div>
                </div>

                <div className="2xl:w-6/12 md:w-7/12 w-full relative flex items-center">
                    <div className="overflow-hidden">
                        <div className="w-full flex flex-row " style={{
                            transition: 'transform 1s ease-in-out',
                            transform: `translateX(${distance}%)`
                        }}>
                            {props.orders_image.map((itemImage, index) => (
                                <div key={index} className="p-1" style={{
                                    minWidth: `${100 / numItemsDisplay}%`,
                                    maxWidth: `${100 / numItemsDisplay}%`
                                }}>
                                    <Image src={itemImage} width={500} height={500} alt={itemImage} />
                                </div>

                            ))}
                        </div>
                    </div>

                    <FontAwesomeIcon icon={faArrowCircleLeft}
                        className={`absolute left-0 bottom-1/2 translate-y-1/2 lg:-translate-x-1/2
                        ml-1 sm:text-[32px] text-[25px]
                        ${distance === 0 ? "hidden" : "block cursor-pointer"}
                        ${props.orders_image.length < numItemsDisplay ? "hidden" : "block"}`}

                        onClick={() => setDistance(
                            distance => clampFunc(distance + 100,
                                -((1 / (numItemsDisplay / totalNumItems)) - 1) * 100, 0)
                        )} />

                    <FontAwesomeIcon icon={faArrowCircleRight}
                        className={`absolute right-0 bottom-1/2 lg:translate-x-1/2
                        translate-y-1/2 mr-1 sm:text-[32px] text-[25px]
                        ${distance === -((1 / (numItemsDisplay / totalNumItems)) - 1) * 100 ?
                                "hidden" : "block cursor-pointer"}
                            ${props.orders_image.length < numItemsDisplay ? "hidden" : "block"}`}

                        onClick={() => setDistance(
                            distance => clampFunc(distance - 100,
                                -((1 / (numItemsDisplay / totalNumItems)) - 1) * 100, 0)
                        )} />
                </div>

            </div>
            <hr className="border-t-2 border-black w-full border-opacity-25" />
        </div>

    </>
}