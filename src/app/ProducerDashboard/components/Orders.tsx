"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ProducerOrderHistoryItem } from "@/app/DataInterfaces";
import Image from "next/image";
import { orderStatusMap } from "@/app/Account/components/OrderHistoryCard";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faCheckCircle, faHourglassHalf, faTruck, faUndo, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import LoadingComponent from "@/app/components/LoadingComponent";

export const orderStatusIconMap: { [key: string]: IconDefinition } = {
    'COMPLETED': faCheckCircle,
    'CANCELLED': faTimesCircle,
    'SHIPPING': faTruck,
    'REFUNDED': faUndo,
    'PENDING': faHourglassHalf
};

export default function Orders() {
    const { data: session } = useSession();
    const [producerOrderHistory, setProducerOrderHistory] = useState<ProducerOrderHistoryItem[]>([]);
    const [currentTab, setCurrentTab] = useState("COMPLETED");
    const [showLoadingUI, setShowLoadingUI] = useState(true);

    useEffect(() => {
        const getProducerOrders = async (producerName: string) => {
            setShowLoadingUI(true);
            if (producerName !== "") {
                const response = await fetch('/api/Users/Producers?producerQuery=producerOrders', {
                    method: "GET",
                    headers: {
                        'Accept': 'application/json'
                    }
                })

                if (response.ok) {
                    const reply = await response.json();
                    setProducerOrderHistory(reply.producerOrderHistory)
                }
                else {
                    console.log("PRODUCER ORDERS RETRIEVAL FAILED!", response.statusText)
                }
                setShowLoadingUI(false);
            }
        }

        getProducerOrders(session?.user.business?.businessName ?? "");

    }, [session?.user.business])

    /*
    useEffect(() => {
        console.log("PRODUCER HISTORY", producerOrderHistory);
    }, [producerOrderHistory])
    */

    return <>
        <div className="flex flex-col sm:pl-5">
            <div className="flex flex-row mx-auto lg:w-fit w-full overflow-x-auto">
                {['Completed', 'Shipping', 'Pending', 'Refunded', 'Cancelled'].map((status, index) => (
                    < div key={index}
                        className={`p-5 hover:bg-gray-400 
                            cursor-pointer flex-grow ${currentTab === status.toUpperCase()
                                ? "bg-gray-500 " : "bg-gray-300 "}`}
                        onClick={() => setCurrentTab(status.toUpperCase())}>
                        <span className="sm:block hidden">
                            {status}
                        </span>

                        <span className="sm:hidden block text-center">
                            <FontAwesomeIcon icon={orderStatusIconMap[status.toUpperCase()]}
                                className="text-[20px]" />
                        </span>
                    </div>
                ))}
            </div >
            <div className="flex flex-col gap-5 p-5 border-2 border-black border-opacity-25">
                <div className="lg:grid hidden grid-cols-6 font-bold gap-5 bg-gray-200 pr-2 pl-2 pt-4 pb-4">
                    <span>
                        ItemIDS
                    </span>

                    <span>
                        ItemType
                    </span>

                    <span>
                        ItemSKU
                    </span>

                    <span>
                        ItemPricing
                    </span>

                    <span>
                        ItemImage
                    </span>

                    <span className="text-center">
                        ItemStatus
                    </span>
                </div>
                {
                    producerOrderHistory.filter(orderedItem => orderedItem.orders_items_status === currentTab).length === 0 ? (
                        (
                            showLoadingUI ?
                                (
                                    <LoadingComponent
                                        width="100"
                                        height="100"
                                        minHeight="min-h-[500px]" />)
                                :
                                (
                                    <div className="text-center text-gray-500">No orders here
                                    </div>
                                )
                        )
                    ) : (
                        producerOrderHistory
                            .filter(orderedItem => orderedItem.orders_items_status === currentTab)
                            .map((orderedItem) => (
                                <div key={orderedItem.orders_items_variant_sku}>
                                    <div className="lg:grid lg:grid-cols-6 lg:gap-5 lg:p-2 hidden">
                                        <div className="flex flex-col pr-5">
                                            <span className="break-all">
                                                <span className="font-bold">OrderID: <br /> </span>{orderedItem.orders_id}
                                            </span>

                                            <span>
                                                <span className="font-bold">ProductID: <br /> </span>{orderedItem.product_id}
                                            </span>
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="font-bold">
                                                {orderedItem.product_name}
                                            </span>

                                            <span className="italic">
                                                {orderedItem.product_type} - {orderedItem.product_audience}
                                            </span>
                                        </div>

                                        <span>
                                            {orderedItem.orders_items_variant_sku}
                                        </span>

                                        <div className="flex flex-col">
                                            <span>
                                                <span className="font-bold">Unit: </span>${orderedItem.orders_items_price}
                                            </span>

                                            <span>
                                                <span className="font-bold">QTY: </span> x {orderedItem.orders_items_count}
                                            </span>

                                            <span>
                                                <span className="font-bold">Total: </span>${orderedItem.orders_items_count * Number(orderedItem.orders_items_price)}
                                            </span>
                                        </div>

                                        <div >
                                            <Image src={orderedItem.product_images[0]}
                                                alt={orderedItem.product_images[0]}
                                                width={500}
                                                height={500} />
                                        </div>

                                        <div className="flex flex-col items-center gap-5">
                                            <span className="font-bold text-sm p-3 rounded-full text-white"
                                                style={{ backgroundColor: orderStatusMap[orderedItem.orders_items_status] }}>
                                                {orderedItem.orders_items_status}
                                            </span>

                                            <Link href={`/Collections/All/Products?productID=${orderedItem.product_id}`}>
                                                <span className="font-bold text-sm p-3 rounded-full text-white bg-black whitespace-nowrap">
                                                    Item Details
                                                </span>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="lg:hidden flex flex-col gap-4 mb-[15px]">
                                        <div className="flex flex-col">
                                            <span>
                                                <span className="font-bold">ProductID --- OrderID: <br /> </span>
                                            </span>

                                            <span className="break-all">
                                                {orderedItem.product_id} <span className="font-bold"> --- </span>{orderedItem.orders_id}
                                            </span>
                                        </div>

                                        <div className="flex 3xs:flex-row flex-col gap-3">
                                            <div >
                                                <Image src={orderedItem.product_images[0]}
                                                    alt={orderedItem.product_images[0]}
                                                    width={500}
                                                    height={500} />
                                            </div>

                                            <div className="flex flex-col gap-3 ">
                                                <div className="flex flex-col">
                                                    <span className="font-bold">
                                                        {orderedItem.product_name}
                                                    </span>

                                                    <span className="italic">
                                                        {orderedItem.product_type} - {orderedItem.product_audience}
                                                    </span>
                                                </div>

                                                <span>
                                                    {orderedItem.orders_items_variant_sku}
                                                </span>

                                                <div className="flex flex-col">
                                                    <span>
                                                        <span className="font-bold">Unit: </span>${orderedItem.orders_items_price}
                                                    </span>

                                                    <span>
                                                        <span className="font-bold">QTY: </span> x {orderedItem.orders_items_count}
                                                    </span>

                                                    <span>
                                                        <span className="font-bold">Total: </span>${orderedItem.orders_items_count * Number(orderedItem.orders_items_price)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex 2xs:flex-row flex-col 2xs:items-center gap-5 justify-start">
                                            <span className="font-bold text-sm p-3 text-white"
                                                style={{ backgroundColor: orderStatusMap[orderedItem.orders_items_status] }}>
                                                {orderedItem.orders_items_status}
                                            </span>

                                            <Link className="font-bold text-sm p-3 text-white bg-black white"
                                                href={`/Collections/All/Products?productID=${orderedItem.product_id}`}>
                                                Item Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                    )
                }
            </div>
        </div>
    </>
}