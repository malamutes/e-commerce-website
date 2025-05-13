'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { businessLocations, businessTypes } from "@/app/CollectionTypes";
import Link from "next/link";
import { FullScreenLoadingComponent } from "@/app/components/LoadingComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

//NEED TO REFRACTOR THIS PART SO WE DONT NEED TO GET USER PASSWORD AND INSTEAD PROMPT USER FOR PW


//NEED TO REFRACTOR THIS PART SO WE DONT NEED TO GET USER PASSWORD AND INSTEAD PROMPT USER FOR PW

//NEED TO REFRACTOR THIS PART SO WE DONT NEED TO GET USER PASSWORD AND INSTEAD PROMPT USER FOR PW

//NEED TO REFRACTOR THIS PART SO WE DONT NEED TO GET USER PASSWORD AND INSTEAD PROMPT USER FOR PW  
export default function SignUpPage() {
    const router = useRouter();

    const [userProducer, setUserProducer] = useState<boolean | null>(null);

    const [businessName, setBusinessName] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState("");
    const [businessLocation, setBusinessLocation] = useState("");

    const userTypeSelectClass = "3xs:w-[180px] 3xs:h-[180px] w-full h-[100px] border-2 border-black flex justify-center items-center mx-[25px] cursor-pointer hover:bg-gray-300";

    const [showFullScreenLoading, setShowFullScreenLoading] = useState(false);

    //need to handle removing UI from the dom after selection probably

    const handleProducerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setShowFullScreenLoading(true);

        //code block here to verify user password
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
            console.log(registerOutcome.message);
            router.push("/");
        }
        else {
            console.log(producerRegister.status, registerOutcome);
        }

        setShowFullScreenLoading(false);
    }

    return <>
        <div className="bg-gray-200 h-fit min-h-[75vh]
         flex flex-col justify-center items-center min-w-[250px]">
            <div className={`text-center ${userProducer !== null ? "hidden" : "block"} p-5`}>
                <span className="text-2xl font-bold">
                    WHAT USER TYPE ARE YOU?
                </span>

                <div className="flex 3xs:flex-row flex-col items-center gap-y-5 mt-[25px]">
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

            <div className={`${userProducer === true ? "flex" : "hidden"} flex-col justify-center 
            items-center sm:w-[600px] 2xs:w-5/6 w-full
                `}>
                <span className="text-lg font-bold pr-5 pl-5">
                    COMPANY/ RETAIL DETAILS
                </span>
                <form className='flex lg:flex-col flex-col justify-between w-10/12'
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
                            <option value="" disabled>Select your business type</option>
                            {businessTypes.map((bType) => (
                                <option key={bType} value={bType}>{bType}</option>
                            ))}
                        </select>

                        <label htmlFor="businessLocation" className="block text-lg font-medium mb-2 mt-5">Location</label>
                        <select id="businessLocation" name="businessLocation" className="w-full p-2"
                            value={businessLocation}
                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                                setBusinessLocation(event.target.value)}>
                            <option value="" disabled>Select your business location</option>
                            {businessLocations.map((location) => (
                                <option key={location} value={location}>{location}</option>
                            ))}

                        </select>
                    </div>

                    <button className='bg-black text-white pt-2 pb-2 pl-5 pr-5 rounded-full mt-7 
                                                    w-fit ml-auto mr-auto'
                        type='submit'
                    >START PRODUCING!</button>
                </form>

                <button className='bg-black text-white pt-2 pb-2 pl-5 pr-5 rounded-full mt-7 
                                                    w-fit ml-auto mr-auto'
                    onClick={() => setUserProducer(null)}
                >Go Back</button>

                <div className="text-gray-700 text-sm mt-2 flex items-center gap-2 italic p-5">
                    <span className="text-lg">※</span>
                    <span>
                        <strong>Note:</strong> Your producer dashboard will be available on the next login,
                        and it will be accessible under the
                        <FontAwesomeIcon icon={faUser} className="ml-1 text-gray-900" /> (profile icon) OR &quot;Producer Dashboard&quot; dropdown.
                    </span>
                </div>

            </div>

            <div className={`${userProducer === false ? "flex" : "hidden"} flex-col w-full
                justify-center items-center`}>
                <span className="font-bold text-lg text-center">
                    THANKS FOR JOINING US!
                </span>

                <Link href={"/"}
                    className='bg-black text-white pt-2 pb-2 pl-5 pr-5 rounded-full mt-7 
                                                    w-fit ml-auto mr-auto'
                >START SHOPPING!</Link>

                <button className='bg-black text-white pt-2 pb-2 pl-5 pr-5 rounded-full mt-7 
                                                    w-fit ml-auto mr-auto'
                    onClick={() => setUserProducer(null)}
                >Go Back</button>
            </div>
        </div>


        <FullScreenLoadingComponent
            show={showFullScreenLoading}
            setShow={setShowFullScreenLoading}
        />
    </>
}