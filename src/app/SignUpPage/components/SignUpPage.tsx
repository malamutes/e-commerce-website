'use client';

import { useEffect, useState } from "react";
import Form from "next/form";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { businessLocations, businessTypes } from "@/app/CollectionTypes";

export default function SignUpPage() {
    const router = useRouter();

    const [userProducer, setUserProducer] = useState<boolean | null>(null);

    const [businessName, setBusinessName] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState("");
    const [businessLocation, setBusinessLocation] = useState("");

    const userTypeSelectClass = "w-[200px] h-[200px] border-2 border-black flex justify-center items-center mx-[25px] cursor-pointer hover:bg-gray-300";

    const { data: session, status, update } = useSession();

    console.log(session?.user.user_id, session?.user.email, status);
    //need to handle removing UI from the dom after selection probably

    const handleProducerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const producerRegister = await fetch('/api/producerSignUp', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                businessName: businessName,
                businessType: businessType,
                businessRegistrationNumber: businessRegistrationNumber,
                businessLocation: businessLocation,
            })
        });

        const registerOutcome = await producerRegister.json();

        if (producerRegister.ok) {
            //instead of signing in again with user pw and username
            //we can do what most websites do and prompt user to enter pw
            //again after submitting company info
            //and then trigger a re sign-in using that pw which will be hashed ofc
            const loginResult = await signIn('credentials', {
                redirect: true,
                userEmail: registerOutcome.data[0].user_email,
                userPassword: registerOutcome.data[0].user_password,
                callbackUrl: '/'
            });

            if (loginResult?.ok) {
                console.log("Sign in successful!");
                console.log("CallbackURL", loginResult?.url);
            }
            else {
                console.log("Status Code", loginResult?.status);
                console.log("Error:", loginResult?.error);
            }

        }
        else {
            console.log(producerRegister.status, registerOutcome);
        }
    }

    return <>
        <div className="bg-gray-200 h-screen flex flex-col justify-center items-center ">
            <div className={`text-center ${userProducer !== null ? "hidden" : "block"}`}>
                <span className="text-2xl font-bold">
                    WHAT USER TYPE ARE YOU?
                </span>

                <div className="flex flex-row mt-[25px]">
                    <div className={userTypeSelectClass}
                        onClick={() => setUserProducer(false)}>
                        <span>
                            CONSUMER
                        </span>
                    </div>

                    <div className={userTypeSelectClass}
                        onClick={() => setUserProducer(true)}>
                        <span>
                            PRODUCER
                        </span>
                    </div>
                </div>

            </div>

            <div className={`${userProducer === true ? "flex" : "hidden"} flex-col w-1/3
                justify-center items-center`}>
                <span>
                    COMPANY/ RETAIL DETAILS
                </span>
                <Form action="text" className='flex lg:flex-col flex-col justify-between w-10/12'
                    onSubmit={handleProducerSubmit}
                >
                    <div className='flex flex-col w-auto'>
                        <label htmlFor="businessName"
                            className="block text-lg font-medium mt-5">
                            Business Name</label>
                        <input name="businessName" type='text' id='businessName'
                            className='border-solid border-[1.5px] 
                                                            border-gray-300 p-2.5 w-full '
                            placeholder='Business Name'
                            required={true}
                            value={businessName}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                setBusinessName(event.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label htmlFor="businessRegistrationNumber" className="block text-lg font-medium mb-2 mt-5">Business Registration Number</label>
                        <input name="businessRegistrationNumber" type='number'
                            className='border-solid border-[1.5px] 
                                                        border-gray-300 p-2.5 w-full mb-5'
                            placeholder='Business Registration Number'
                            required={true}
                            value={businessRegistrationNumber}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                setBusinessRegistrationNumber(event.target.value)
                            }

                        />

                        <label htmlFor="businessType" className="block text-lg font-medium mb-2">Business Type</label>
                        <select id="businessType" name="businessType" className="w-full p-2"
                            value={businessType}
                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                                setBusinessType(event.target.value)}>
                            <option value="" selected disabled>Select your business type</option>
                            {businessTypes.map((bType) => (
                                <option key={bType} value={bType}>{bType}</option>
                            ))}
                        </select>

                        <label htmlFor="businessLocation" className="block text-lg font-medium mb-2 mt-5">Location</label>
                        <select id="businessLocation" name="businessLocation" className="w-full p-2"
                            value={businessLocation}
                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                                setBusinessLocation(event.target.value)}>
                            <option value="" selected disabled>Select your business location</option>
                            {businessLocations.map((location) => (
                                <option key={location} value={location}>{location}</option>
                            ))}

                        </select>
                    </div>

                    <button className='bg-black text-white pt-2 pb-2 pl-5 pr-5 rounded-full mt-7 
                                                    w-fit ml-auto mr-auto'
                        type='submit'
                    >START PRODUCING!</button>
                </Form>

                <button className='bg-black text-white pt-2 pb-2 pl-5 pr-5 rounded-full mt-7 
                                                    w-fit ml-auto mr-auto'
                    onClick={() => setUserProducer(null)}
                >Go Back</button>

            </div>

            <div className={`${userProducer === false ? "flex" : "hidden"} flex-col w-1/3
                justify-center items-center`}>
                <span>
                    THANK YOU FOR SIGNING UP!
                </span>

                <button className='bg-black text-white pt-2 pb-2 pl-5 pr-5 rounded-full mt-7 
                                                    w-fit ml-auto mr-auto'
                >START SHOPPING!</button>

                <button className='bg-black text-white pt-2 pb-2 pl-5 pr-5 rounded-full mt-7 
                                                    w-fit ml-auto mr-auto'
                    onClick={() => setUserProducer(null)}
                >Go Back</button>
            </div>
        </div>
    </>
}