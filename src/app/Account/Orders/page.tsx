"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UserOrderHistoryDetailsItem } from "@/app/DataInterfaces";
import { UserOrderHistoryDetails } from "@/app/DataInterfaces";

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
        orders_items_array: []
    });

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
                console.log("USER ORDER HISTORY DETAILS REPLY ", reply);
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
        console.log(userOrderHistoryDetails)
    }, [userOrderHistoryDetails]);

    return <>
        asd

    </>
}