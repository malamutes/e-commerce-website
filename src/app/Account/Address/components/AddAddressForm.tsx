
"use client";
import { SetStateAction, useState } from "react";
import { AddressInterface } from "@/app/DataInterfaces";
import { FullScreenLoadingComponent } from "@/app/components/LoadingComponent";

interface AddAddressFormProps {
    show: boolean,
    setShow: React.Dispatch<SetStateAction<boolean>>,
    address: AddressInterface,
    setAddress: React.Dispatch<SetStateAction<AddressInterface>>,
    handleAddAddress?: (address: AddressInterface) => Promise<void>,
    handleEditAddress?: (address: AddressInterface, addressKey: string) => Promise<void>,
    addressKey?: string,
}

export default function AddAddressForm(props: AddAddressFormProps) {
    const inputFieldClass = "bg-gray-300 rounded-lg p-2 w-full";
    const inputFieldLabelClass = "font-bold mb-1 text-sm";
    const inputFieldWrapperClass = "flex flex-col mb-2";
    const [showFullLoading, setShowFullLoading] = useState(false);

    return <>
        <form className={`${props.show ? "block" : "hidden"}`} onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (props.handleEditAddress && props.addressKey) {
                //both must be available at once anyway to run 

                setShowFullLoading(true)
                await props.handleEditAddress(props.address, props.addressKey);
                setShowFullLoading(false);
            } else {
                if (props.handleAddAddress) {
                    setShowFullLoading(true);
                    await props.handleAddAddress(props.address);
                    setShowFullLoading(false);
                }
            }
            props.setShow(false);
        }}>
            <div className="text-lg font-bold mb-5 text-start">
                <span >
                    {props.handleEditAddress ? "Update" : "Add New"} Address
                </span>
            </div>

            <div>
                <div className="flex flex-row justify-between">
                    <div className={`${inputFieldWrapperClass} w-1/2 mr-[10px]`}>
                        <label htmlFor="firstName" className={inputFieldLabelClass}>First Name:</label>
                        <input
                            id="firstName"
                            type="text"
                            value={props.address.firstName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                props.setAddress({
                                    ...props.address,
                                    firstName: e.target.value
                                })
                            }
                            className={inputFieldClass}
                        />
                    </div>

                    <div className={`${inputFieldWrapperClass} w-1/2 ml-[10px]`}>
                        <label htmlFor="lastName" className={inputFieldLabelClass}>Last Name:</label>
                        <input
                            id="lastName"
                            type="text"
                            value={props.address.lastName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                props.setAddress({
                                    ...props.address,
                                    lastName: e.target.value
                                })
                            }
                            className={inputFieldClass}
                        />
                    </div>
                </div>

                <div className={inputFieldWrapperClass}>
                    <label htmlFor="phone" className={inputFieldLabelClass}>Phone:</label>
                    <input
                        id="phone"
                        type="text"
                        value={props.address.phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            props.setAddress({
                                ...props.address,
                                phone: e.target.value
                            })
                        }
                        className={inputFieldClass}
                    />
                </div>

                <div className={inputFieldWrapperClass}>
                    <label htmlFor="addressName" className={inputFieldLabelClass}>Address Name:</label>
                    <input
                        id="addressName"
                        type="text"
                        value={props.address.addressName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            props.setAddress({
                                ...props.address,
                                addressName: e.target.value
                            })
                        }
                        className={inputFieldClass}
                    />
                </div>

                <div className={inputFieldWrapperClass}>
                    <label htmlFor="addressLineOne" className={inputFieldLabelClass}>Address Line One:</label>
                    <input
                        id="addressLineOne"
                        type="text"
                        value={props.address.addressLineOne}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            props.setAddress({
                                ...props.address,
                                addressLineOne: e.target.value
                            })
                        }
                        className={inputFieldClass}
                    />
                </div>

                <div className={inputFieldWrapperClass}>
                    <label htmlFor="addressLineTwo" className={inputFieldLabelClass}>Address Line Two:</label>
                    <input
                        id="addressLineTwo"
                        type="text"
                        value={props.address.addressLineTwo}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            props.setAddress({
                                ...props.address,
                                addressLineTwo: e.target.value
                            })
                        }
                        className={inputFieldClass}
                    />
                </div>

                <div className={inputFieldWrapperClass}>
                    <label htmlFor="country" className={inputFieldLabelClass}>Country:</label>
                    <select
                        id="country"
                        value={props.address.country}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            props.setAddress({
                                ...props.address,
                                country: e.target.value
                            })
                        }
                        className={inputFieldClass}
                    >
                        <option value="Australia">Australia</option>
                        <option value="USA">USA</option>
                        <option value="Canada">Canada</option>
                    </select>
                </div>

                <div className={inputFieldWrapperClass}>
                    <label htmlFor="state" className={inputFieldLabelClass}>State / Province:</label>
                    <select
                        id="state"
                        value={props.address.stateProvince}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            props.setAddress({
                                ...props.address,
                                stateProvince: e.target.value
                            })
                        }
                        className={inputFieldClass}
                    >
                        <option value="PROVINCEONE">PROVINCEONE</option>
                        <option value="PROVINCETWO">PROVINCETWO</option>
                        <option value="PROVINCETWO">PROVINCETWO</option>
                    </select>
                </div>

                <div className="flex flex-row justify-between mb-4">
                    <div className={`${inputFieldWrapperClass} w-1/2 mr-[10px]`}>
                        <label htmlFor="city" className={inputFieldLabelClass}>City:</label>
                        <input
                            id="city"
                            type="text"
                            value={props.address.city}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                props.setAddress({
                                    ...props.address,
                                    city: e.target.value
                                })
                            }
                            className={inputFieldClass}
                        />
                    </div>

                    <div className={`${inputFieldWrapperClass} w-1/2 ml-[10px]`}>
                        <label htmlFor="zipCode" className={inputFieldLabelClass}>Zip Code:</label>
                        <input
                            id="zipCode"
                            type="text"
                            value={props.address.zipCode}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                props.setAddress({
                                    ...props.address,
                                    zipCode: e.target.value
                                })
                            }
                            className={inputFieldClass}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-row mb-[25px]">
                <button className="bg-black text-white w-fit p-3 rounded-full text-sm mr-[20px]"
                    type="submit">{props.handleEditAddress ? "UPDATE" : "ADD"} ADDRESS</button>
                <button className=" w-fit text-sm hover:underline" onClick={(e) => {
                    e.preventDefault();
                    props.setShow(false);
                }}>Cancel</button>
            </div>
        </form>

        <FullScreenLoadingComponent
            show={showFullLoading}
            setShow={setShowFullLoading}
        />
    </>
}