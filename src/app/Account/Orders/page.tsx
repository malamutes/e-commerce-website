"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderDetails() {
    const searchParams = useSearchParams();

    const [ordersID, setOrdersID] = useState("");

    useEffect(() => {
        const ordersIDFromParams = searchParams?.get("ordersID") ?? "";
        if (ordersIDFromParams !== "") {
            setOrdersID(ordersIDFromParams);
            console.log("ordersID:", ordersIDFromParams);
        } else {
            console.log("No ordersID found in search params");
        }
    }, [searchParams])

    return <>
        asd

    </>
}