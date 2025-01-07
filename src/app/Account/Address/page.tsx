"use client";

import React, { SetStateAction, useEffect, useState } from "react";
import { AddressInterface, DBAddressInterface } from "@/app/DataInterfaces";
import AddAddressForm from "./components/AddAddressForm";
import AddressFormatEdit from "./components/AddressFormat";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";

export default function EditAddressBook() {
    const [showAddAddressForm, setShowAddAddressForm] = useState(false);
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

    const { data: session, update } = useSession();
    const [userAddress, setUserAddress] = useState<DBAddressInterface>({});
    const router = useRouter();

    useEffect(() => {
        if (session?.user.address) {
            setUserAddress(session.user.address);
        }
    }, [session])

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

            console.log("NEW ADDRESS", newAddress);

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

    return <>
        <div className="lg:container mx-auto 2xs:pr-[50px] 2xs:pl-[50px] pr-[20px] pl-[20px]">
            <div className="flex flex-col ">
                <div className="text-center bg-gray-300 xl:w-1/3 lg:w-1/2 md:w-7/12 sm:w-3/4 w-full mx-auto pt-5 
                            pb-5 2xs:pl-[100px] 2xs:pr-[100px] mt-[50px] ">
                    <span className="text-gray-800 text-2xl font-bold">
                        Address Book
                    </span>
                </div>

                <div className="flex flex-row w-fit mx-auto mt-[25px] mb-[25px]">
                    <button className={`bg-black text-white w-fit p-3 rounded-full mx-auto text-sm
                ${showAddAddressForm ? "hidden" : "block"}`}
                        onClick={() => setShowAddAddressForm(true)}
                    >ADD ADDRESS</button>
                    <button className="w-fit p-3 text-sm mr-[20px] font-bold hover:underline"
                        onClick={() => router.push('/Account')}>Back to Account</button>
                </div>


                <div className="xl:w-1/3 lg:w-1/2 md:w-7/12 sm:w-3/4 w-full mx-auto">
                    <AddAddressForm show={showAddAddressForm}
                        setShow={setShowAddAddressForm}
                        address={currentAddress}
                        setAddress={setCurrentAddress}
                        handleAddAddress={handleAddAddress} />
                </div>

                <div className="xl:w-1/3 lg:w-1/2 md:w-7/12 sm:w-3/4 w-full mx-auto">
                    {Object.keys(userAddress).map((addressKey, index) => {
                        return <div key={index} className="mb-5">
                            <AddressFormatEdit address={userAddress[addressKey]}
                                addressKey={addressKey}
                                handleDeleteAddress={handleDeleteAddress}
                                handleEditAddress={handleEditAddress} />
                        </div>
                    })}
                </div>
            </div>
        </div>
    </>
}