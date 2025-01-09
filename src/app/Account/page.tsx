"use client";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AddressFormat } from "./Address/components/AddressFormat";
import { DBAddressInterface } from "../DataInterfaces";

export default function AccountPage() {
    const { data: session, update } = useSession();

    const router = useRouter()

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const [updatedInfo, setUpdatedInfo] = useState(false);
    const [userAddress, setUserAddress] = useState<DBAddressInterface>({});

    useEffect(() => {
        if (session?.user) {
            setFirstName(session.user.firstName ?? "UserFirstName");
            setLastName(session.user.lastName ?? "UserLastName");
            setPhone(session.user.phone ?? "UserPhone");
            setEmail(session.user.email ?? "UserEmail");
            if (session.user.address) {
                setUserAddress(session.user.address);
            }
        }
    }, [session]);

    //UPDATING DB WORKS BUT GETTING THIS INFO TO REFLECT IN OUR CLIENT/SERVER SIDE WILL BE ROUGH

    const handleEditAddresses = () => {
        router.push('/Account/Address');
    };


    const changeUserProfile = async () => {
        const response = await fetch('/api/Users?edit=Profile', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email
            })
        })

        const reply = await response.json()

        if (response.ok) {
            console.log("it worked");
            await update({
                ...session,
                user: {
                    ...session?.user,
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
                    email: email,
                }
            })
        }
        else {
            console.log(response.status, response.statusText);
        }
    }

    const handleEditProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await changeUserProfile();
        alert("Profile Updated Successfully.")
    };

    return <>
        <div className="lg:container flex flex-col mx-auto pt-[50px] pb-[50px] 2xl:pr-[100px] 2xl:pl-[100px]
        xl:pr-[50px] xl:pl-[50px] lg:pr-[25px] lg:pl-[25px] sm:pr-[50px] sm:pl-[50px] pr-[20px] pl-[20px]">
            <span className="text-2xl font-bold">
                MY ACCOUNT DETAILS
            </span>
            <div className="flex lg:flex-row flex-col mt-[25px]">
                <div className="flex lg:flex-col sm:flex-row flex-col lg:w-[30%] 
                lg:gap-x-0 gap-x-[25px] justify-center">
                    <div className="flex flex-col mr-5 lg:w-full sm:w-1/3 w-full">
                        <div className="text-center bg-gray-200 pt-5 pb-5">
                            Profile Details
                        </div>

                        {/* probably make these input forms when im working on backend again */}
                        <form className="mt-[25px]" onSubmit={(e) => { handleEditProfile(e) }}>
                            <div className="flex flex-col mb-4">
                                <label htmlFor="firstName" className="font-bold mb-1">First Name:</label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    className="bg-gray-300 rounded-lg p-2 w-full"
                                    value={firstName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col mb-4">
                                <label htmlFor="lastName" className="font-bold mb-1">Last Name:</label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    className="bg-gray-300 rounded-lg p-2 w-full"
                                    value={lastName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col mb-4">
                                <label htmlFor="phone" className="font-bold mb-1">Phone:</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    className="bg-gray-300 rounded-lg p-2 w-full"
                                    value={phone}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col mb-4">
                                <label htmlFor="email" className="font-bold mb-1">Email:</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="bg-gray-300 rounded-lg p-2 w-full"
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                />
                            </div>


                            <button
                                type="submit"
                                disabled={
                                    firstName === session?.user.firstName &&
                                    lastName === session?.user.lastName &&
                                    phone === session?.user.phone &&
                                    email === session?.user.email
                                }
                                className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600
                                disabled:bg-gray-400"
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>

                    <div className="flex flex-col lg:mt-[25px] lg:w-full sm:w-2/3 w-full 
                    lg:max-h-fit lg:overflow-hidden overflow-y-scroll lg:max-h-fit max-h-[500px] 
                    pb-[25px] sm:mt-[0px] mt-[50px]">
                        <div className="text-center bg-gray-200 pt-5 pb-5 sm:mr-5">
                            Addresses
                            <FontAwesomeIcon icon={faPenToSquare}
                                className="font-[16px] ml-[10px] hover:scale-125 cursor-pointer
                                transition-transform duration-300 ease-in-out "
                                onClick={handleEditAddresses} />
                        </div>

                        {/* probably make these input forms when im working on backend again */}
                        <div className="flex flex-col items-center sm:mr-5">
                            <button className={`bg-black text-white w-fit p-3 rounded-full text-sm mt-[15px] mr-5 mb-5`}
                                onClick={() => router.push('/Account/Address')}
                            >MANAGE ADDRESS</button>

                            <div className="max-w-full flex flex-col gap-5">
                                {Object.keys(userAddress ?? {}).map((addressKey, index) => {
                                    return <div key={index}>
                                        <AddressFormat address={userAddress[addressKey]} />
                                    </div>
                                })}
                            </div>
                        </div>

                    </div>
                </div>

                <div className="flex flex-col lg:w-[70%] w-full lg:ml-5 lg:mt-[0px] mt-[50px]">
                    <div className="text-center bg-gray-200 pt-5 pb-5 ">
                        Order history
                    </div>
                </div>

            </div>
        </div>
    </>
}