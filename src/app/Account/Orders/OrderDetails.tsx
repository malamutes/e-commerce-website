"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AddressInterface } from "@/app/DataInterfaces";
import { UserOrderHistoryDetails } from "@/app/DataInterfaces";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function OrderDetails() {
    const searchParams = useSearchParams();

    const [ordersID, setOrdersID] = useState("");
    const [userOrderHistoryDetails, setUserOrderHistoryDetails] = useState<UserOrderHistoryDetails>({
        orders_id: '',
        orders_shipping_method: '',
        orders_order_time: new Date(),
        orders_total_price: 0,
        orders_shipping_price: 0,
        orders_shipping_address: {
            firstName: '',
            lastName: '',
            phone: '',
            addressName: '',
            addressLineOne: '',
            addressLineTwo: '',
            country: '',
            stateProvince: '',
            city: '',
            zipCode: ''
        },
        orders_items_array: [],
        orders_order_status: ''
    });
    const [address, setAddress] = useState<AddressInterface>({
        firstName: '',
        lastName: '',
        phone: '',
        addressName: '',
        addressLineOne: '',
        addressLineTwo: '', // This can be left as an empty string or `undefined` if you prefer
        country: '',
        stateProvince: '',
        city: '',
        zipCode: ''
    })

    useEffect(() => {
        const ordersIDFromParams = searchParams?.get("ordersID") ?? "";
        if (ordersIDFromParams !== "") {
            setOrdersID(ordersIDFromParams);
            console.log("ordersID:", ordersIDFromParams);
        } else {
            console.log("No ordersID found in search params");
        }
    }, [searchParams])

    useEffect(() => {
        const getOrderDetails = async (orderID: string) => {
            const response = await fetch(`/api/Users/Orders?orderID=${orderID}`, {
                method: "GET",
                headers: {
                    'Accept': 'application/json'
                }
            });

            const reply = await response.json()

            if (response.ok) {
                setUserOrderHistoryDetails(reply.userOrderHistoryDetails[0]);
                setAddress(JSON.parse(reply.userOrderHistoryDetails[0].orders_shipping_address));
            }
            else {
                console.log(response.status, response.statusText);
            }
        }
        if (ordersID !== "") {
            getOrderDetails(ordersID);
        }
    }, [ordersID])

    useEffect(() => {
        console.log("USER ORDER HISTORY", userOrderHistoryDetails)
    }, [userOrderHistoryDetails]);

    return <>
        <div className="lg:container mx-auto lg:pr-[100px] lg:pl-[100px] lg:mb-[50px] pr-[25px] pl-[25px] min-w-[280px]">
            <div className="flex flex-col mt-[50px] gap-5">
                <span className="text-3xl font-bold">
                    YOUR ORDER DETAILS
                </span>

                <div className="flex md:flex-row flex-col justify-between gap-[50px]">
                    <div className="leading-loose md:w-5/12 ">
                        <p className="font-bold">
                            Order Details
                        </p>
                        <p>
                            <span className="font-bold">OrderID: </span>{userOrderHistoryDetails.orders_id}
                        </p>
                        <p>
                            <span className="font-bold">Items: </span>{userOrderHistoryDetails.orders_items_array.length}
                        </p>
                        <p>
                            <span className="font-bold">Order Date: </span>{new Date(userOrderHistoryDetails.orders_order_time).toLocaleString("en-GB", {
                                timeZone: "UTC",
                                day: "numeric",
                                month: "short", // Abbreviated month name
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false, // 24-hour format
                            }) + " UTC"}
                        </p>
                        <p>
                            Status: <span className="bg-green-800 p-2 rounded-full text-white font-bold text-sm"
                            >{userOrderHistoryDetails.orders_order_status}</span>
                        </p>
                    </div>

                    <div className="leading-loose">
                        <p className="font-bold">
                            Shipping Address
                        </p>
                        <p>
                            {address.firstName} {address.lastName} <br />
                            {address.addressLineOne}, {address.addressLineTwo} <br />
                            {address.city}, {address.stateProvince} {address.zipCode} <br />
                            {address.country}
                        </p>
                    </div>

                    <div className="flex lg:justify-end md:w-1/3  ">
                        <div className="leading-loose">
                            <p className="font-bold">
                                Payment Total
                            </p>

                            <div className="flex flex-col justify-between leading-extra-loose">
                                <div className="flex flex-row gap-x-[50px] justify-between">
                                    <span>
                                        Subtotal
                                    </span>
                                    <span>
                                        ${(userOrderHistoryDetails.orders_total_price - userOrderHistoryDetails.orders_shipping_price).toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex flex-row gap-x-[50px] justify-between">
                                    <span>
                                        Shipping Method
                                    </span>
                                    <span>
                                        {userOrderHistoryDetails.orders_shipping_method.split(" ")[0]}
                                    </span>
                                </div>

                                <div className="flex flex-row gap-x-[50px] justify-between">
                                    <span>
                                        Shipping Price
                                    </span>

                                    <span>
                                        ${userOrderHistoryDetails.orders_shipping_price}
                                    </span>
                                </div>

                                <div className="flex flex-row gap-x-[50px] justify-between">
                                    <span className="font-bold text-xl">
                                        Total
                                    </span>

                                    <span className="font-bold text-xl">
                                        ${userOrderHistoryDetails.orders_total_price}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-5  border-2 border-gray-300 p-5 max-h-[1500px] overflow-y-scroll " >
                    <div className="md:grid grid-cols-6 font-bold bg-gray-200 p-5 hidden">
                        <span>
                            Image
                        </span>

                        <span className="col-span-2 ml-[50px]">
                            Details
                        </span>

                        <span>
                            Unit Price
                        </span>

                        <span>
                            Quantity
                        </span>

                        <span>
                            Total Price
                        </span>
                    </div>

                    {userOrderHistoryDetails.orders_items_array.map((orderedItem) => (
                        <div key={orderedItem.sku} className="md:grid md:grid-cols-6 p-5 lg:gap-0 md:gap-5
                        flex 2xs:flex-row flex-col gap-5">
                            <div className="max-w-[200px] 2xs:-ml-5 mx-auto">
                                <Image src={orderedItem.image} alt={orderedItem.image} width={500} height={500} />
                            </div>
                            <>
                                <span className="col-span-2 ml-[50px] md:block hidden">
                                    <p className="font-bold">
                                        {orderedItem.name}
                                    </p>

                                    <p className="text-gray-700">
                                        {orderedItem.producer}
                                    </p>

                                    <p className="italic">
                                        {orderedItem.combination.join(" - ")}
                                    </p>
                                </span>

                                <span className="md:block hidden">
                                    ${orderedItem.price}
                                </span>

                                <span className="md:block hidden">
                                    {orderedItem.quantity}
                                </span>

                                <span className="md:block hidden">
                                    ${orderedItem.quantity * orderedItem.price}
                                </span>

                            </>

                            <div className="flex flex-col md:hidden block min-w-[100px] 2xs:text-start text-center">
                                <p className="font-bold truncate">
                                    {orderedItem.name}
                                </p>

                                <p className="text-gray-700 whitespace-nowrap">
                                    {orderedItem.producer}
                                </p>

                                <p className="italic">
                                    {orderedItem.combination.join(" - ")}
                                </p>

                                <span >
                                    ${orderedItem.price} x {orderedItem.quantity}
                                </span>

                                <span >
                                    Total: ${orderedItem.quantity * orderedItem.price}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <span className="text-gray-600 italic hover:underline cursor-pointer">
                    Get your E-invoice here
                </span>

                <Link href={"/Account"} className="flex flex-row items-center gap-2 cursor-pointer mb-[25px]">
                    <FontAwesomeIcon icon={faArrowRightToBracket} size="2x" className="rotate-180" />
                    <span>
                        Back to Account
                    </span>
                </Link >

            </div>
        </div>
    </>
}