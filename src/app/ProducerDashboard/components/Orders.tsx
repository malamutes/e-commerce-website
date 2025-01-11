"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ProducerOrderHistoryItem } from "@/app/DataInterfaces";

export default function Orders() {
    const { data: session } = useSession();
    const [producerOrderHistory, setProducerOrderHistory] = useState<ProducerOrderHistoryItem[]>([]);

    useEffect(() => {
        const getProducerOrders = async (producerName: string) => {
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
            }
        }

        getProducerOrders(session?.user.business?.businessName ?? "");

    }, [session?.user.business])

    useEffect(() => {
        console.log("PRODUCER HISTORY", producerOrderHistory);
    }, [producerOrderHistory])

    return <>
        <div className="flex flex-row w-5/6 mx-auto">
            {['Completed', 'Shipped', 'Pending', 'Refunded', 'Cancelled'].map((status, index) => (
                < div key={index}
                    className="bg-gray-400 p-5 hover:bg-gray-200 cursor-pointer" >
                    <span>
                        {status}
                    </span>
                </div>

            ))}
        </div >
    </>
}