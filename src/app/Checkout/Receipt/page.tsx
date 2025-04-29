"use client";

import { useEffect, useState } from "react";
import { AddressInterface } from "@/app/DataInterfaces";
import { shippingMethods } from "../shippingTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";

const monthNamesShort = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

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
    quantity: number
}

interface orderReceipt {
    orderDate: Date,
    orderTotalPrice: number,
    shippingMethod: string,
    shippingPrice: number,
    shippingAddress: AddressInterface,
    items: orderReceiptItem[]
}

function CheckoutReceiptItemCard(props: checkoutReceiptItemCardProps) {
    return <>
        <div className="flex 3xs:flex-row flex-col 3xs:items-start items-center 
        justify-between shadow-lg rounded-xl 
        3xs:overflow-hidden 3xs:min-h-[100px]
        border-2 border-black border-opacity-10
        min-w-[200px]">
            <div className="flex 3xs:flex-row flex-col gap-6 items-center">
                <div className="3xs:max-w-[100px] max-w-[full] aspect-square">
                    <Image src={props.itemImage} width={500} height={500} alt={props.itemImage} />
                </div>

                <div className="flex flex-col leading-relaxed justify-center">
                    <span className="text-gray-600 font-bold 3xs:text-start text-center">
                        {props.itemName} x  {props.itemCount}
                    </span>
                    <span className="text-gray-600 italic 3xs:text-start text-center">
                        {props.itemSize} -  {props.itemColour}
                    </span>
                </div>
            </div>

            <div className="flex items-center mr-[15px]">
                <span className="font-bold">
                    ${props.itemPrice}
                </span>

            </div>
        </div>
    </>
}

export default function CheckoutReceiptPage() {
    const [orderReceipt, setOrderReceipt] = useState<orderReceipt>({
        orderDate: new Date('1970-01-01T00:00:00Z'),
        orderTotalPrice: 0,
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
                orderDate: new Date(reply.data[0].orders_order_time),
                orderTotalPrice: reply.data[0].orders_total_price,
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
        if (!orderID) {
            console.error('No checkout receipt ID found in localStorage.');
            return;
        }
        getOrderReceipt(orderID);
    }, []);

    useEffect(() => {
        console.log("ORDER RECEIPT", orderReceipt);
    }, [orderReceipt])

    return <>
        <div className="lg:container mx-auto mt-[100px] ">
            <div className="xl:w-2/5 lg:w-3/5 w-5/6 mx-auto flex flex-col">
                <div className="leading-super-loose mb-[50px]">
                    <p className="text-2xl font-bold">
                        THANK YOU FOR SHOPPING WITH US!
                        <FontAwesomeIcon icon={faCircleCheck} className="text-[30px] ml-[5px] " />
                    </p>

                    <p className="break-word">
                        Hey {orderReceipt.shippingAddress.firstName}, <br />
                        We’re stoked you placed an order with us—you're awesome!  <br />
                        Our team is already on it, getting your products packed up and ready to ship out.  <br />
                        Once it’s on the way, we’ll
                        shoot you an email.<br />
                        Once again, thanks for choosing us, and we can’t wait for you to get your order! <br />
                        Until next time! <br />
                        — Treadify Team
                    </p>
                </div>

                <div className="leading-super-loose mb-[50px] ">
                    <span className="text-2xl font-bold">
                        Order Summary
                    </span>
                    <div className="pt-[20px] mb-[25px] flex flex-col 
                    gap-5 max-h-[500px] pb-5 overflow-y-scroll pr-2">
                        {/* NEED TO FIND A BETTER WAY OF MATCHING TYPES THAN SYNCHRONIZING MANUALLY */}
                        {orderReceipt.items.map((orderItem, index) => (
                            <CheckoutReceiptItemCard
                                key={index}
                                itemName={orderItem.name}
                                itemColour={orderItem.combination[1]}
                                itemCount={orderItem.quantity}
                                itemImage={orderItem.image}
                                itemPrice={orderItem.price}
                                itemSize={orderItem.combination[0]}
                            />
                        ))}
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="3xs:w-1/2 w-full flex flex-col">
                            <div className="flex flex-row justify-between">
                                <span className="text-gray-600 font-bold">
                                    Subtotal
                                </span>

                                <span className="text-black font-bold">
                                    ${orderReceipt.orderTotalPrice - orderReceipt.shippingPrice}
                                </span>
                            </div>

                            <div className="flex flex-row justify-between">
                                <span className="text-gray-600 font-bold">
                                    Shipping
                                </span>

                                <span className="text-black font-bold">
                                    ${orderReceipt.shippingPrice}
                                </span>
                            </div>

                            <div className="flex flex-row justify-between">
                                <span className="text-gray-600 font-bold">
                                    GST (TBA)
                                </span>

                                <span className="text-black font-bold">
                                    $0
                                </span>
                            </div>

                            <div className="flex flex-row justify-between mt-[10px] mb-[10px]">
                                <span className="text-gray-600 font-bold text-2xl">
                                    Total
                                </span>

                                <span className="text-black font-bold text-2xl">
                                    ${orderReceipt.orderTotalPrice}
                                </span>
                            </div>

                            <div className="flex flex-row justify-between">
                                <span className="text-gray-600 font-bold">
                                    Date of Order
                                </span>

                                <span className="text-black font-bold">
                                    {orderReceipt.orderDate.getDay().toString()} {monthNamesShort[orderReceipt.orderDate.getMonth()]} {orderReceipt.orderDate.getFullYear().toString()}
                                </span>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="leading-loose">
                    <span className="text-2xl font-bold">
                        Customer Details
                    </span>
                    <div className="flex flex-col gap-[25px] pt-[20px]">
                        <div>
                            <p className="text-xl text-gray-600 font-bold">
                                Address Details
                            </p>
                            <span className="leading-normal">
                                {orderReceipt.shippingAddress.firstName}, {orderReceipt.shippingAddress.lastName} <br />
                                {orderReceipt.shippingAddress.addressLineOne}, {orderReceipt.shippingAddress.addressLineTwo} <br />
                                {orderReceipt.shippingAddress.city}, {orderReceipt.shippingAddress.stateProvince} {orderReceipt.shippingAddress.zipCode} <br />
                                {orderReceipt.shippingAddress.country}
                            </span>
                        </div>

                        <div>
                            <p className="text-xl text-gray-600 font-bold">
                                Shipping Method
                            </p>
                            <span>
                                {orderReceipt.shippingMethod}
                            </span>
                        </div>

                        <div>
                            <p className="text-xl text-gray-600 font-bold">
                                Payment Details
                            </p>
                            <span>
                                CARD DETAILS FUNCTIONALITY TBA
                            </span>
                        </div>

                        <div className="hidden">
                            {orderReceipt.shippingPrice},  {orderReceipt.orderDate.toString()},  {orderReceipt.shippingMethod},
                        </div>
                    </div>
                </div>
                <div className="mt-[25px] mb-[25px]">
                    <p className="text-2xl font-bold">
                        Invoice
                    </p>
                    <a href="">
                        <span className="hover:underline italic cursor-pointer">
                            Download a PDF version of your invoice here.
                        </span>
                    </a>
                </div>

            </div>

        </div>
    </>
}