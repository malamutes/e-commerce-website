"use client";

import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AddressFormat } from "./Address/components/AddressFormat";
import { DBAddressInterface } from "../DataInterfaces";
import { UserOrderHistory } from "../DataInterfaces";
import OrderHistoryCard from "./components/OrderHistoryCard";
import LoadingComponent from "../components/LoadingComponent";

export default function AccountPage() {
    const { data: session, update } = useSession();

    const router = useRouter()

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const [userAddress, setUserAddress] = useState<DBAddressInterface>({});

    const [userOrderHistory, setUserOrderHistory] = useState<UserOrderHistory[]>([]);

    const [showFullLoading, setShowFullLoading] = useState(false);
    const [showLoadingUI, setShowLoadingUI] = useState(true);

    useEffect(() => {
        if (session?.user) {
            setFirstName(session.user.firstName ?? "UserFirstName");
            setLastName(session.user.lastName ?? "UserLastName");
            setPhone(session.user.phone ?? "UserPhone");
            setEmail(session.user.email ?? "UserEmail");
            if (session.user.address) {
                setUserAddress(session.user.address);
                setShowLoadingUI(false);
            }
        }
    }, [session]);

    useEffect(() => {
        const retrieveOrderHistory = async (userID: number) => {
            setShowLoadingUI(true);
            const response = await fetch(`/api/Users?userID=${userID}`, {
                method: "GET",
                headers: {
                    'Accept': 'application/json'
                }
            });

            const reply = await response.json()

            if (response.ok) {
                setUserOrderHistory(reply.userOrderHistory);
                console.log(reply);
            }
            else {
                console.log(response.status, response.statusText);
            }
            setShowLoadingUI(false);
        }

        if (session?.user.user_id) {
            retrieveOrderHistory(session?.user.user_id);
        }
    }, [session?.user.user_id])

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

        await response.json()

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
        setShowFullLoading(true);
        e.preventDefault();
        await changeUserProfile();
        setShowFullLoading(false);
    };

    return <>
        <div className="lg:container flex flex-col mx-auto pt-[50px] pb-[50px] 2xl:pr-[100px] 2xl:pl-[100px]
        xl:pr-[50px] xl:pl-[50px] lg:pr-[25px] lg:pl-[25px] sm:pr-[50px] sm:pl-[50px] pr-[20px] pl-[20px]
        min-w-[280px]">
            <span className="text-2xl font-bold">
                MY ACCOUNT DETAILS
            </span>
            <div className="flex lg:flex-row flex-col mt-[25px]">
                <div className="flex lg:flex-col sm:flex-row flex-col lg:w-[30%] 
                lg:gap-x-0 gap-x-[25px] ">
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
                    lg:max-h-fit lg:overflow-hidden overflow-y-auto lg:max-h-fit max-h-[500px] 
                    pb-[25px] sm:mt-[0px] mt-[50px]">
                        <div className="text-center bg-gray-200 pt-5 pb-5">
                            Addresses
                            <FontAwesomeIcon icon={faPenToSquare}
                                className="font-[16px] ml-[10px] hover:scale-125 cursor-pointer
                                transition-transform duration-300 ease-in-out "
                                onClick={handleEditAddresses} />
                        </div>

                        {/* probably make these input forms when im working on backend again */}
                        <div className="flex flex-col items-center max-h-[515px] overflow-y-auto pr-[5px]">
                            <button className={`bg-black text-white w-fit p-3 rounded-full text-sm mt-[15px] mb-5`}
                                onClick={() => router.push('/Account/Address')}
                            >MANAGE ADDRESS</button>

                            <div className="max-w-full flex flex-col gap-5">
                                {Object.keys(userAddress).length > 0 ?
                                    (
                                        Object.keys(userAddress ?? {}).map((addressKey, index) => {
                                            return <div key={index}>
                                                <AddressFormat address={userAddress[addressKey]} />
                                            </div>
                                        })
                                    )
                                    :
                                    (
                                        showLoadingUI ?
                                            (<LoadingComponent
                                                width="100"
                                                height="100"
                                                minHeight="min-h-[100px]"
                                            />)

                                            :
                                            (
                                                <span>
                                                    Add an address now!
                                                </span>
                                            )
                                    )}
                            </div>
                        </div>

                    </div>
                </div>

                <div className="flex flex-col lg:w-[70%] w-full lg:ml-5 lg:mt-[0px] mt-[50px]">
                    <div className="text-center bg-gray-200 pt-5 pb-5 ">
                        Order history
                    </div>

                    <div className="flex flex-col gap-4 pt-[15px] max-h-[1000px] pr-3 pt-3 pb-3
                    overflow-y-auto text-center">
                        {userOrderHistory.length === 0 ?
                            (
                                showLoadingUI ?
                                    (
                                        <LoadingComponent
                                            width="100"
                                            height="100"
                                            minHeight="min-h-[100px]"
                                        />
                                    )
                                    :
                                    (
                                        <span>
                                            You have no past orders!
                                        </span>
                                    )
                            )
                            :
                            (
                                userOrderHistory.map((orderItem) => (
                                    <div key={orderItem.orders_id}>
                                        <OrderHistoryCard
                                            orders_id={orderItem.orders_id}
                                            orders_image={orderItem.orders_image}
                                            orders_order_status={orderItem.orders_order_status}
                                            orders_order_time={new Date(orderItem.orders_order_time)}
                                            orders_total_price={orderItem.orders_total_price}
                                            user_id={orderItem.user_id}
                                        />
                                    </div>
                                )))}
                    </div>
                </div>
            </div>
        </div>

        <div className={`w-screen h-screen fixed top-0 left-0 bg-white bg-opacity-75 ${showFullLoading ? "block" : "hidden"}`}>
            <LoadingComponent
                width="100"
                height="100"
                minHeight="min-h-screen"
            />
        </div>
    </>
}