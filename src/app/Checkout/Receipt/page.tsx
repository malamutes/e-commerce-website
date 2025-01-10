"use client";

import { useEffect, useState } from "react";
import { AddressInterface } from "@/app/DataInterfaces";
import { shippingMethods } from "../page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";

interface checkoutReceiptItemCardProps {
    itemName: string,
    itemImage: string,
    itemSize: string,
    itemColour: string,
    itemCount: number,
    itemPrice: number
}

//this is directly from names i used in the backend reference, 
// need to find a better way to represent this than trying to synchronise 
//manually
interface orderReceiptItem {
    name: string,
    combination: string[],
    image: string,
    price: number,
    product_id: string,
    count: number
}

interface orderReceipt {
    orderDate: Date,
    shippingMethod: string,
    shippingPrice: number,
    shippingAddress: AddressInterface,
    items: orderReceiptItem[]
}

function CheckoutReceiptItemCard(props: checkoutReceiptItemCardProps) {
    return <>
        <div className="bg-red-900 mb-[50px]">
            {props.itemColour}
            {props.itemName}
            {props.itemCount}
            {props.itemPrice}
            {props.itemSize}
            {props.itemImage}
        </div>
    </>
}

export default function CheckoutReceiptPage() {
    const [orderReceipt, setOrderReceipt] = useState<orderReceipt>({
        orderDate: new Date('1970-01-01T00:00:00Z'),
        shippingMethod: "",
        shippingPrice: 0,
        shippingAddress: {
            firstName: "",
            lastName: "",
            phone: "",
            addressName: "",
            addressLineOne: "",
            addressLineTwo: "",
            country: "",
            stateProvince: "",
            city: "",
            zipCode: "",
        },
        items: []
    });

    const getOrderReceipt = async (orderID: string) => {
        const response = await fetch(`/api/Checkout?orderID=${orderID}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json'
            }
        })


        if (response.ok) {

            const reply = await response.json();

            console.log("SHIPPING ADDRESS -->", JSON.parse(reply.data[0].orders_shipping_address));
            const address = JSON.parse(reply.data[0].orders_shipping_address);
            setOrderReceipt({
                orderDate: reply.data[0].orders_order_time,
                shippingMethod: reply.data[0].orders_shipping_method,
                shippingPrice: shippingMethods[reply.data[0].orders_shipping_method],
                shippingAddress: {
                    firstName: address.firstName,
                    lastName: address.lastName,
                    phone: address.phone,
                    addressName: address.addressName,
                    addressLineOne: address.addressLineOne,
                    addressLineTwo: address.addressLineTwo ?? "",
                    country: address.country,
                    stateProvince: address.stateProvince,
                    city: address.city,
                    zipCode: address.zipCode,
                },
                items: reply.data[0].orders_items_list
            })
        }
        else {
            console.log("GETTING ORDER RECEIPT FAILED", response.statusText);
        }
    }

    useEffect(() => {
        const orderID = localStorage.getItem('CheckoutReceiptID');
        getOrderReceipt(orderID ?? "");

    }, [])

    useEffect(() => {
        console.log("ORDER RECEIPT", orderReceipt);
    }, [orderReceipt])

    return <>
        <div className="container mx-auto">
            <div className="w-2/5 mx-auto flex flex-col">
                <div className="leading-super-loose ">
                    <p className="text-2xl font-bold ">
                        THANK YOU FOR SHOPPING WITH US!
                        <FontAwesomeIcon icon={faCircleCheck} className="text-[30px] ml-[5px] " />
                    </p>

                    <p>
                        Hey Paul, <br />
                        We’re stoked you placed an order with us—you're awesome!  <br />
                        Our team is already on it, getting your products packed up and ready to ship out.  <br />
                        Once it’s on the way, we’ll
                        shoot you a <br />
                        Once again, thanks for choosing us, and we can’t wait for you to get your order! <br />
                        Until next time! <br />
                        — Treadify Team
                    </p>
                </div>

                <div className="leading-super-loose">
                    <span className="text-2xl font-bold">
                        Order Summary
                    </span>

                    <div>
                        {orderReceipt.shippingPrice},  {orderReceipt.orderDate.toString()},  {orderReceipt.shippingMethod},
                    </div>

                    <div>
                        {Object.keys(orderReceipt.shippingAddress).map((addressField) => (
                            <p key={addressField}>
                                {/* THIS IS KINDA AN ABUSE SINCE IM UST SHORT CIRCUITING TS SAFETY CHECK NEED A FIX
                                LATER ON WHEN REFRACTORING*/}
                                {addressField} ---{'>'} {orderReceipt.shippingAddress[addressField as keyof AddressInterface]}
                            </p>
                        ))}
                    </div>

                    <div>
                        {/* NEED TO FIND A BETTER WAY OF MATCHING TYPES THAN SYNCHRONIZING MANUALLY */}
                        {orderReceipt.items.map((orderItem, index) => (
                            <CheckoutReceiptItemCard
                                key={index}
                                itemName={orderItem.name}
                                itemColour={orderItem.combination[1]}
                                itemCount={orderItem.count}
                                itemImage={orderItem.image}
                                itemPrice={orderItem.price}
                                itemSize={orderItem.combination[0]}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </>
}