'use client';

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

import { faCcVisa } from "@fortawesome/free-brands-svg-icons";
import { faCcMastercard } from "@fortawesome/free-brands-svg-icons";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import { faApplePay } from "@fortawesome/free-brands-svg-icons";
import { faGooglePay } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";

import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";

export default function WebsiteFooter() {

    const socialIconClass = "mx-2";
    const footerLinkClass = "hover:text-gray-400 cursor-pointer text-sm font-medium mt-2.5 w-fit"
    const footerTitleClass = "font-bold text-xl sm:mt-5 p-2 sm:hover:text-black hover:text-gray-500 ";

    const [informationAccordion, setInformationAccordion] = useState(false);
    const [helpAccordion, setHelpAccordion] = useState(false);
    const [storesAccordion, setStoresAccordion] = useState(false);
    const [dealsAccordion, setDealsAccordion] = useState(false);

    return <>
        <div className="bg-white w-full min-w-[250px]">
            <div className="flex flex-col">
                <div className="sm:grid lg:grid-cols-5 grid-cols-2 2xl:w-3/4 
                xl:w-4/5 lg:w-11/12 w-4/5 mx-auto justify-between pt-5
                items-center lg:text-start text-center hidden">
                    <div className="flex flex-col lg:col-span-1 col-span-2 mx-auto">
                        <Link href={"/"}>
                            <Image src={"/Logo.png"} alt="WebsiteLogo"
                                width={250} height={250} className="ml-5" />
                        </Link>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className={footerTitleClass}>
                            Information
                        </span>
                        {['About Us', 'Privacy Policy', 'DMCA Policy', 'Terms of service',
                            'Reviews', 'Refund Policy'
                        ].map((info, index) => (
                            <span key={index} className={footerLinkClass}>
                                {info.toUpperCase()}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-col items-center">
                        <span className={footerTitleClass}>
                            HELP
                        </span>
                        {['Shipping & Delivery', 'FAQs', 'Contact Us', 'Terms of sale',
                            'Gifting', 'Payment Methods'
                        ].map((info, index) => (
                            <span key={index} className={footerLinkClass}>
                                {info.toUpperCase()}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-col items-center">
                        <span className={footerTitleClass}>
                            Stores
                        </span>
                        {["Asia", "Africa", "North America", "South America", "Antarctica",
                            "Europe", "Australia"].map((info, index) => (
                                <span key={index} className={footerLinkClass}>
                                    {info.toUpperCase()}
                                </span>
                            ))}
                    </div>

                    <div className="flex flex-col items-center">
                        <span className={footerTitleClass}>
                            Deals
                        </span>
                        {["Christmas", "Black Friday", "Cyber Monday", "New Year's Sale", "Halloween Sale",
                            "Summer Sale", "Thanksgiving Sale"].map((info, index) => (
                                <span key={index} className={footerLinkClass}>
                                    {info.toUpperCase()}
                                </span>
                            ))}
                    </div>
                </div>

                <div className="sm:hidden block flex flex-col ">
                    <div className="mx-auto">
                        <Link href={"/"}>
                            <Image src={"/Logo.png"} alt="WebsiteLogo"
                                width={250} height={250} className="ml-5 " />
                        </Link>
                    </div>

                    <div className="flex flex-col items-center ">
                        <div className="flex flex-row items-center cursor-pointer" onClick={() =>
                            setInformationAccordion(informationAccordion => !informationAccordion)}>
                            <span className={footerTitleClass} >
                                Information
                            </span>
                            <FontAwesomeIcon icon={faChevronCircleDown} />
                        </div>


                        <div className={`flex flex-col items-center mb-5 ${informationAccordion ? "block" : "hidden"}`}>
                            {['About Us', 'Privacy Policy', 'DMCA Policy', 'Terms of service',
                                'Reviews', 'Refund Policy'
                            ].map((info, index) => (
                                <span key={index} className={footerLinkClass}>
                                    {info.toUpperCase()}
                                </span>
                            ))}
                        </div>

                    </div>

                    <div className="flex flex-col items-center ">
                        <div className="flex flex-row items-center cursor-pointer" onClick={() =>
                            setHelpAccordion(helpAccordion => !helpAccordion)}>
                            <span className={footerTitleClass} >
                                Help
                            </span>
                            <FontAwesomeIcon icon={faChevronCircleDown} />
                        </div>
                        <div className={`flex flex-col items-center  mb-5 ${helpAccordion ? "block" : "hidden"}`}>
                            {['Shipping & Delivery', 'FAQs', 'Contact Us', 'Terms of sale',
                                'Gifting', 'Payment Methods'
                            ].map((info, index) => (
                                <span key={index} className={footerLinkClass}>
                                    {info.toUpperCase()}
                                </span>
                            ))}
                        </div>

                    </div>

                    <div className="flex flex-col items-center">
                        <div className="flex flex-row items-center cursor-pointer" onClick={() =>
                            setStoresAccordion(storesAccordion => !storesAccordion)}>
                            <span className={footerTitleClass} >
                                Stores
                            </span>
                            <FontAwesomeIcon icon={faChevronCircleDown} />
                        </div>
                        <div className={`flex flex-col items-center mb-5 ${storesAccordion ? "block" : "hidden"}`}>
                            {["Asia", "Africa", "North America", "South America", "Antarctica",
                                "Europe", "Australia"].map((info, index) => (
                                    <span key={index} className={footerLinkClass}>
                                        {info.toUpperCase()}
                                    </span>
                                ))}
                        </div>

                    </div>

                    <div className="flex flex-col items-center">
                        <div className="flex flex-row items-center cursor-pointer" onClick={() =>
                            setDealsAccordion(dealsAccordion => !dealsAccordion)}>
                            <span className={footerTitleClass} >
                                Deals
                            </span>
                            <FontAwesomeIcon icon={faChevronCircleDown} />
                        </div>
                        <div className={`flex flex-col items-center ${dealsAccordion ? "block" : "hidden"}`}>
                            {["Christmas", "Black Friday", "Cyber Monday", "New Year's Sale", "Halloween Sale",
                                "Summer Sale", "Thanksgiving Sale"].map((info, index) => (
                                    <span key={index} className={footerLinkClass}>
                                        {info.toUpperCase()}
                                    </span>
                                ))}
                        </div>

                    </div>
                </div>
            </div>

            <hr className="border-t-3 border-gray-300 mt-10" />

            <div className="flex lg:flex-row flex-col 2xl:w-3/4 xl:w-4/5 lg:w-11/12 
            mx-auto justify-between">
                <div className="flex justify-center p-5">
                    <FontAwesomeIcon icon={faFacebook} size="2x"
                        className={socialIconClass} />
                    <FontAwesomeIcon icon={faInstagram} size="2x"
                        className={socialIconClass} />
                    <FontAwesomeIcon icon={faXTwitter} size="2x"
                        className={socialIconClass} />
                    <FontAwesomeIcon icon={faYoutube} size="2x"
                        className={socialIconClass} />
                    <FontAwesomeIcon icon={faEnvelope} size="2x"
                        className={socialIconClass} />
                </div>

                <div className="flex justify-center p-5">
                    <FontAwesomeIcon icon={faCcVisa} size="2x" className={socialIconClass} />
                    <FontAwesomeIcon icon={faCcMastercard} size="2x" className={socialIconClass} />
                    <FontAwesomeIcon icon={faPaypal} size="2x" className={socialIconClass} />
                    <FontAwesomeIcon icon={faApplePay} size="2x" className={socialIconClass} />
                    <FontAwesomeIcon icon={faGooglePay} size="2x" className={socialIconClass} />
                </div>
            </div>

            <hr className="border-t-3 border-gray-300 " />

            <div className="font-bold 2xl:w-3/4 xl:w-4/5 lg:w-11/12 mx-auto p-5 
            flex lg:flex-row flex-col justify-between text-center">
                <span>
                    © 2024 | Threadify | All Rights Reserved
                </span>

                <div>
                    <span>
                        Cookie Preferences
                    </span>
                    <span className="mx-2.5 xs:inline hidden">
                        |
                    </span>

                    <span className="block sm:inline">
                        BACK TO TOP
                    </span>
                </div>


            </div>
        </div>
    </>
}