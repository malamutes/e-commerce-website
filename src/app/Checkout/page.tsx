"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleDown } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck as faCircleCheckRegular } from "@fortawesome/free-regular-svg-icons";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import AddressFormatEdit from "../Account/Address/components/AddressFormat";
import AddAddressForm from "../Account/Address/components/AddAddressForm";
import { AddressInterface } from "../DataInterfaces";
import { useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from 'uuid';
import { CheckoutShoppingCartItem } from "./components/CheckoutShoppingCartItem";
import { ShoppingCartContext } from "../ShoppingCartContext";
import { useRouter } from "next/navigation";

export const shippingMethods: { [key: string]: number } = {
    'Standard Shipping (3 - 7 business days)': 10,
    'Express Shipping (2 - 4 business days)': 15,
    'Priority Shipping (1 - 2 business days)': 30,
}

export type ShippingMethodPair<T, U> = {
    shippingMethod: T;
    shippingPrice: U;
};

export default function CheckoutPage() {
    const { data: session, update } = useSession();
    const [currentAddress, setCurrentAddress] = useState<AddressInterface>({
        firstName: '',
        lastName: '',
        phone: '',
        addressName: '',
        addressLineOne: '',
        addressLineTwo: '',
        country: '',
        stateProvince: '',
        city: '',
        zipCode: '',
    });

    const router = useRouter();

    const shoppingCartContext = useContext(ShoppingCartContext);

    useEffect(() => {
        if (session?.user.address && selectedShippingAddress === "") {
            setSelectedShippingAddress(addressKeys[0]);
        }
    }, [session])

    const addressKeys = Object.keys(session?.user.address ?? {});
    const [showAddAddressForm, setShowAddAddressForm] = useState(false);

    const [selectedShippingAddress, setSelectedShippingAddress] = useState<string>(addressKeys[0] ?? "");
    const [showShippingAddress, setShowShippingAddress] = useState(false);
    const [showAddressFormat, setShowAddressFormat] = useState(true);

    const [showshippingMethod, setShowShippingMethod] = useState(false);
    const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethodPair<string, number>>({
        shippingMethod: "Standard Shipping (3 - 7 business days)",
        shippingPrice: shippingMethods['Standard Shipping (3 - 7 business days)']
    });

    const handleAddAddress = async (address: AddressInterface) => {
        const addressId = uuidv4();
        const response = await fetch('/api/Users?edit=Address', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...session?.user.address,
                [addressId]: address
            })
        })

        await response.json();

        if (response.ok) {
            await update({
                ...session,
                user: {
                    ...session?.user,
                    address: {
                        ...session?.user.address,
                        [addressId]: address
                    }
                }

            })
            console.log("ADDED!");
            setCurrentAddress({
                firstName: '',
                lastName: '',
                phone: '',
                addressName: '',
                addressLineOne: '',
                addressLineTwo: '',
                country: '',
                stateProvince: '',
                city: '',
                zipCode: '',
            });
            setSelectedShippingAddress(addressId);
        }
        else {
            console.log(response.status, response.statusText)
        }
    }

    const handleEditAddress = async (address: AddressInterface, addressKey: string) => {
        const response = await fetch('/api/Users?edit=Address', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...session?.user.address,
                [addressKey]: address
            })
        })

        await response.json();

        if (response.ok) {
            await update({
                ...session,
                user: {
                    ...session?.user,
                    address: {
                        ...session?.user.address,
                        [addressKey]: address
                    }
                }

            })
            console.log("UPDATED ADDRESS!");
        }
        else {
            console.log(response.status, response.statusText)
        }

    }

    const handleDeleteAddress = async (addressKey: string) => {
        if (session?.user.address) {
            const { [addressKey]: removedAddress, ...newAddress } = session.user.address;


            const response = await fetch('/api/Users?edit=Address', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newAddress)
            })

            await response.json();

            if (response.ok) {
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        address: newAddress
                    }

                })
                console.log("DELETED!");

            }
            else {
                console.log(response.status, response.statusText)
            }
        }

    }

    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        let currentTotal = 0;
        Object.values(shoppingCartContext.cartState).map((cartItem) => {
            currentTotal += cartItem.itemPrice * cartItem.itemCount
            return null
        })

        setTotalPrice(currentTotal);
    }, [shoppingCartContext.cartState])

    const handlePayNow = async () => {
        const orderID = uuidv4();
        const response = await fetch('/api/Checkout', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                order: {
                    userID: session?.user.user_id,
                    orderID: orderID,
                    ordersTotalPrice: totalPrice + selectedShippingMethod.shippingPrice,
                    ordersShippingAddress: session?.user.address?.[selectedShippingAddress] ?? "",
                    ordersEmail: session?.user.email,
                    ordersShippingMethod: selectedShippingMethod.shippingMethod,
                    ordersShippingPrice: selectedShippingMethod.shippingPrice
                },
                orderItems: shoppingCartContext.cartState
            })
        })

        if (response.ok) {
            //need a better solution than this which is just to store in local storage but we'll see
            localStorage.setItem('CheckoutReceiptID', orderID);
            shoppingCartContext.clearShoppingCart();
            router.push('/Checkout/Receipt');
        }
        else {
            console.log("ORDER FAILURE", response.statusText);
        }
    };

    return <>
        {session?.user ? (<div className="lg:max-w-[1100px] mx-auto m-10 pr-[25px] pl-[25px]">
            <div className="flex lg:flex-row flex-col justify-between mx-auto lg:items-start
            items-center">
                <div className="flex flex-col lg:w-1/2 sm:w-2/3 w-full lg:mr-[15px]">
                    <span className="mb-[10px] text-xl font-bold italic">
                        Biling Details
                    </span>
                    <div className="flex flex-col cursor-pointer pt-5 pb-5">
                        <div className="flex flex-col">
                            <p className=" text-lg italic">
                                Billing Email
                            </p>
                            <span>
                                {session.user.email}
                            </span>
                        </div>
                        <hr className="border-t-[1px] border-black opacity-25 mt-5" />
                    </div>

                    <div className="flex flex-col ">
                        <div className="flex flex-row cursor-pointer justify-between"
                            onClick={() => setShowShippingAddress(showShippingAddress => !showShippingAddress)}>
                            <div>
                                <p className="text-lg italic">
                                    Shipping Address
                                </p>
                                <span className="text-sm block mt-1">
                                    {Object.values(session.user.address?.[selectedShippingAddress] ?? []).join(", ")}
                                </span>
                            </div>

                            <FontAwesomeIcon icon={faArrowAltCircleDown} className="text-[20px]" />
                        </div>
                        <div className={`flex flex-col ${showShippingAddress ? "block" : "hidden"}`}>
                            <div className="flex flex-col">
                                {addressKeys.map((addressKey) => (
                                    <div key={addressKey} className={`mt-[15px] flex flex-col
                                    ${selectedShippingAddress === addressKey ? "border-2 border-black " : ""}`}>
                                        <span className="bg-gray-300 cursor-pointer w-full p-3 "
                                            onClick={() => {
                                                if (selectedShippingAddress === addressKey) {
                                                    setShowAddressFormat(showAddressFormat => !showAddressFormat)
                                                }
                                                else {
                                                    setSelectedShippingAddress(addressKey)
                                                }
                                            }}>
                                            {session.user.address?.[addressKey].addressName ?? ""}
                                        </span>
                                        <div className={`${showAddressFormat && selectedShippingAddress === addressKey ? "block" : "hidden"} p-2`}>
                                            <AddressFormatEdit
                                                address={session.user?.address?.[addressKey] || {} as AddressInterface}
                                                addressKey={addressKey}
                                                handleDeleteAddress={handleDeleteAddress}
                                                handleEditAddress={handleEditAddress} />
                                        </div>
                                    </div >
                                ))}
                            </div>

                            <div className="mt-5 flex flex-row items-center w-fit cursor-pointer">
                                <FontAwesomeIcon icon={faSquarePlus} className="mr-[7.5px]" />
                                <span className="hover:text-blue-600"
                                    onClick={() => setShowAddAddressForm(showAddAddressForm => !showAddAddressForm)}>
                                    Use a different address
                                </span>
                            </div>

                            <div className={`${showAddAddressForm ? "block" : "hidden"} mt-5 bg-gray-200 p-5`}>
                                <AddAddressForm show={showAddAddressForm}
                                    address={currentAddress}
                                    setAddress={setCurrentAddress}
                                    setShow={setShowAddAddressForm}
                                    handleAddAddress={handleAddAddress} />
                            </div>
                        </div>
                        <hr className="border-t-[1px] border-black opacity-25 mt-5" />
                    </div>

                    <div className="flex flex-col pt-5 pb-5">
                        <div className="flex flex-row justify-between cursor-pointer "
                            onClick={() => setShowShippingMethod(showshippingMethod => !showshippingMethod)}>
                            <div>
                                <p className=" text-lg italic">
                                    Shipping Method
                                </p>

                                <span className="block mt-1">
                                    {selectedShippingMethod.shippingMethod} • ${selectedShippingMethod.shippingPrice}
                                </span>

                            </div>

                            <FontAwesomeIcon icon={faArrowAltCircleDown} className="text-[20px]" />
                        </div>
                        <div className={`${showshippingMethod ? "block" : "hidden"} mt-2.5`}>
                            {Object.keys(shippingMethods).map((method) => (
                                <div className={`flex flex-row justify-between p-2 cursor-pointer
                                    ${selectedShippingMethod.shippingMethod === method
                                        ? "bg-gray-200"
                                        : "bg-transparent"}`}
                                    key={method}
                                    onClick={() => setSelectedShippingMethod({
                                        shippingMethod: method,
                                        shippingPrice: shippingMethods[method]
                                    })}>
                                    <div>
                                        <FontAwesomeIcon icon={selectedShippingMethod.shippingMethod === method
                                            ? faCircleCheck
                                            : faCircleCheckRegular} className="mr-3" />
                                        <span>
                                            {method}
                                        </span>
                                    </div>

                                    <span>
                                        ${shippingMethods[method]}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <hr className="border-t-[1px] border-black opacity-25 mt-5" />
                    </div>

                    <div className="flex flex-col cursor-pointer pt-5 pb-5">
                        <div className="flex flex-row justify-between">
                            <span className=" text-lg italic">
                                Payment Method
                            </span>
                            <FontAwesomeIcon icon={faArrowAltCircleDown} className="text-[20px]" />
                        </div>
                        <hr className="border-t-[1px] border-black opacity-25 mt-5" />
                    </div>

                    <button className="bg-green-800 mx-auto w-full p-4 font-bold text-white rounded-lg lg:block hidden"
                        onClick={handlePayNow}
                    >PAY NOW</button>
                    <span className="mt-3 text-center text-blue-800 cursor-pointer">
                        Checkout as guest instead
                    </span>

                </div>

                <div className="flex flex-col lg:w-1/2 sm:w-2/3 w-full lg:ml-[15px] lg:mt-[0px] mt-[50px]">
                    <span className="mb-[25px] text-xl font-bold italic">
                        Shopping Cart
                    </span>

                    <div className="flex flex-col p-5 bg-gray-200 max-h-[500px] overflow-y-scroll">
                        {Object.keys(shoppingCartContext.cartState).map((shoppingCartItem, index) => (
                            <div key={index} className=" mb-5">
                                <CheckoutShoppingCartItem
                                    shoppingCartItem={shoppingCartContext.cartState[shoppingCartItem]}
                                    shoppingCartContext={shoppingCartContext}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="p-5">
                        <div className="flex flex-row justify-between">
                            <span>
                                Subtotal
                            </span>

                            <span>
                                ${totalPrice.toFixed(2)}
                            </span>
                        </div>

                        <div className="flex flex-row justify-between mt-[10px]">
                            <span>
                                Shipping
                            </span>

                            <span>
                                ${selectedShippingMethod.shippingPrice}
                            </span>
                        </div>

                        <div className="flex flex-row justify-between mt-[25px]">
                            <span className="text-lg font-bold">
                                Total
                            </span>

                            <span className="text-lg font-bold">
                                ${(totalPrice + selectedShippingMethod.shippingPrice).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                <button className="bg-green-800 mx-auto sm:w-2/3 w-full p-5 font-bold text-white rounded-lg lg:hidden block"
                    onClick={handlePayNow}
                >PAY NOW</button>
            </div>

        </div>)
            :
            null}
    </>
}