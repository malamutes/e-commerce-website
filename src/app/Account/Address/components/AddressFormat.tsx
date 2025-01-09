"use client";

import { AddressInterface } from "@/app/DataInterfaces";
import { useState } from "react";
import AddAddressForm from "./AddAddressForm";

export interface AddressFormatEditProps {
    address: AddressInterface
    handleDeleteAddress: (addressKey: string) => void,
    addressKey: string,
    handleEditAddress: (address: AddressInterface, addressKey: string) => void
}

export default function AddressFormatEdit(props: AddressFormatEditProps) {
    const [editAddress, setEditAddress] = useState(false);
    const [address, setAddress] = useState<AddressInterface>(props.address);

    return <>
        <div className={`flex flex-col bg-gray-200 p-2 ${editAddress ? "hidden" : "block"} 
            mb-7 xxs:break-words break-all`}>
            <div className="mb-4 shadow-lg p-2">
                <p className="text-xl font-bold">
                    {props.address.addressName} ({props.address.firstName} {props.address.lastName})
                </p>
            </div>

            <div className="ml-[15px] mb-4 shadow-lg p-2 w-fit">
                <p>
                    {props.address.phone}
                </p>
                <p>
                    {props.address.addressLineOne}, {props.address.addressLineTwo}
                </p>
                <p>
                    {props.address.city}, {props.address.stateProvince} {props.address.zipCode}
                </p>

                <p>
                    {props.address.country}
                </p>
            </div>

            <div className="flex flex-row">
                <button className="w-fit p-3 text-sm mr-[20px] font-bold hover:shadow-lg bg-gray-100"
                    onClick={() => setEditAddress(true)}>Update Address</button>
                <button className=" w-fit text-sm text-red-500 font-bold p-3 hover:shadow-lg bg-gray-100"
                    onClick={() => props.handleDeleteAddress(props.addressKey)}>Delete</button>
            </div>
        </div>

        <div >
            <AddAddressForm show={editAddress}
                setShow={setEditAddress}
                address={address}
                setAddress={setAddress}
                handleAddAddress={() => {/* DUMMY FUNCTION NOTHING TO DO HERE, WE CAN PROLLY
                EDIT THIS COMPONENT SO BOTH ARE OPTIONAL*/}}
                handleEditAddress={() => props.handleEditAddress(address, props.addressKey)}
                addressKey={props.addressKey} />
        </div>
    </>
}

export interface AddressFormatProps {
    address: AddressInterface
}

export function AddressFormat(props: AddressFormatProps) {
    return <>
        <div className="flex flex-col bg-gray-100 p-2 break-words">
            <div className="mb-4 shadow-lg p-2  ">
                <p className="text-lg font-bold">
                    {props.address.addressName} ({props.address.firstName} {props.address.lastName})
                </p>
            </div>

            <div className="ml-[15px] mb-4 shadow-lg p-2 w-fit">
                <p>
                    {props.address.phone}
                </p>
                <p>
                    {props.address.addressLineOne}, {props.address.addressLineTwo}
                </p>
                <p>
                    {props.address.city}, {props.address.stateProvince} {props.address.zipCode}
                </p>

                <p>
                    {props.address.country}
                </p>
            </div>
        </div>
    </>
}
