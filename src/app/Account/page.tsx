"use client";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AccountPage() {
    const { data: session, update } = useSession();

    const router = useRouter()

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const [updatedInfo, setUpdatedInfo] = useState(false);

    useEffect(() => {
        if (session?.user) {
            setFirstName(session.user.firstName ?? "UserFirstName");
            setLastName(session.user.lastName ?? "UserLastName");
            setPhone(session.user.phone ?? "UserPhone");
            setEmail(session.user.email ?? "UserEmail");
        }
    }, [session]);

    //UPDATING DB WORKS BUT GETTING THIS INFO TO REFLECT IN OUR CLIENT/SERVER SIDE WILL BE ROUGH

    const handleEditAddresses = () => {
        router.push('/Account/Address');
    };


    const changeUserProfile = async () => {
        const response = await fetch('api/Users?edit=Profile', {
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
        <div className="container flex flex-col mx-auto p-[25px]">
            <span className="text-2xl font-bold">
                MY ACCOUNT DETAILS
            </span>
            <div className="flex flex-row mt-[50px]">
                <div className="flex flex-col w-[30%]">
                    <div className="flex flex-col  mr-5">
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

                    <div className="flex flex-col mt-[25px]">
                        <div className="text-center bg-gray-200 pt-5 pb-5 mr-5">
                            Addresses
                            <FontAwesomeIcon icon={faPenToSquare}
                                className="font-[16px] ml-[10px] hover:scale-125 cursor-pointer
                                transition-transform duration-300 ease-in-out "
                                onClick={handleEditAddresses} />
                        </div>

                        {/* probably make these input forms when im working on backend again */}
                        <div className="flex flex-row p-2.5 items-center  mt-[15px]">
                            <span className="font-bold">
                                TO BE ADDED
                            </span>

                            <span className="bg-gray-200 rounded-lg ml-[15px] p-2.5">
                                TO BE ADDED
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-[70%] ml-5">
                    <div className="text-center bg-gray-200 pt-5 pb-5 ">
                        Order history
                    </div>
                </div>

            </div>
        </div>
    </>
}