import { faArrowCircleRight, faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";

export default function Overview() {

    const [showPreviousMetricTab, setShowPreviousMetricTab] = useState(false);
    const [previousMetric, setShowPreviousMetric] = useState("WEEK");

    return <>
        <div className="bg-gray-300 2xs:p-10 xs:p-5 p-3 flex flex-col gap-5">
            <div>
                <p className="font-bold text-2xl">
                    Overview
                </p>

                <p className="italic text-md font-bold">
                    General business info
                </p>
            </div>

            <div className="lg:grid lg:grid-cols-3 flex flex-col gap-5">
                <div className="flex flex-col bg-gray-200 p-5 justify-center rounded-lg text-center">
                    <span className="text-lg font-bold">
                        Total Sales
                    </span>
                    <span className="italic">
                        Across Business Launch
                    </span>
                    <span className="text-4xl font-bold">
                        $2593.59
                    </span>
                </div>

                <div className="flex flex-col bg-gray-200 rounded-lg items-center gap-3 p-5">
                    <span className="text-lg font-bold">
                        Total Units Sold
                    </span>

                    <div className="flex flex-row gap-5 items-center">
                        <span className="text-4xl font-bold">
                            586
                        </span>

                        <hr className="border-[1px] border-black lg:h-full h-[50px]" />

                        <div className="flex flex-col">
                            <div >
                                <span className="italic">Refunded:</span> <span className="font-bold">12</span>
                            </div>
                            <div>
                                <span className="italic">Cancelled:</span> <span className="font-bold">9</span>
                            </div>

                            <div>
                                <span className="italic">Returned:</span> <span className="font-bold">2</span>
                            </div>
                        </div >
                    </div>
                </div>

                <div className="flex flex-col bg-gray-200 rounded-lg p-5 justify-center items-center">
                    <span className="text-lg font-bold text-center">
                        Most Popular Product
                    </span>

                    <div className="text-center">
                        <span className="font-bold text-2xl">Chic Couture Maxi Dress </span><br
                        /> - <span className="italic">Dresses</span>
                    </div>
                </div>

                <div className="flex flex-col bg-gray-200 rounded-lg p-5 xl:col-span-1 col-span-3">
                    <span className="text-lg font-bold">
                        Sales by Location
                    </span>

                    <div className="flex flex-col gap-3 p-3">
                        <span>
                            <i>United States</i>: <b>$800.00</b> (USD)
                        </span>
                        <span>
                            <i>Canada</i>: <b>CA$600.00</b> (~$450.00 USD)
                        </span>
                        <span>
                            <i>United Kingdom</i>: <b>£275.00</b> (~$350.00 USD)
                        </span>
                        <span>
                            <i>Australia</i>: <b>A$460.00</b> (~$300.00 USD)
                        </span>
                        <span>
                            <i>Germany</i>: <b>€230.00</b> (~$250.00 USD)
                        </span>
                        <span>
                            <i>India</i>: <b>₹16,500.00</b> (~$200.00 USD)
                        </span>
                        <span>
                            <i>Japan</i>: <b>¥21,700.00</b> (~$150.59 USD)
                        </span>
                        <span>
                            <i>Brazil</i>: <b>R$450.00</b> (~$93.00 USD)
                        </span>
                    </div>
                </div>

                <div className="flex flex-col bg-gray-200 rounded-lg p-3 xl:col-span-2 col-span-3">
                    <span className="text-lg font-bold relative">
                        Metrics against
                        previous <div
                            className="relative inline-block"
                            onMouseEnter={() => setShowPreviousMetricTab(true)}
                            onMouseLeave={() => setShowPreviousMetricTab(false)}
                        >
                            <span className="hover:underline cursor-pointer italic">
                                {previousMetric.toLowerCase()}
                            </span>
                            {showPreviousMetricTab && (
                                <div
                                    className="absolute bg-white rounded-lg p-3 flex flex-col w-[100px] h-[100px] top-full left-0"
                                >
                                    <span className="cursor-pointer hover:underline"
                                        onClick={() => { setShowPreviousMetricTab(false); setShowPreviousMetric("WEEK") }}>
                                        week
                                    </span>
                                    <span className="cursor-pointer hover:underline"
                                        onClick={() => { setShowPreviousMetricTab(false); setShowPreviousMetric("MONTH") }}>
                                        month
                                    </span>
                                    <span className="cursor-pointer hover:underline"
                                        onClick={() => { setShowPreviousMetricTab(false); setShowPreviousMetric("YEAR") }}>
                                        year
                                    </span>
                                </div>
                            )}
                        </div>

                    </span>
                    <div className="grid md:grid-cols-3 grid-cols-1 gap-3 p-2">
                        <div className="flex flex-col gap-2 bg-gray-300 w-fit p-3 rounded-lg">
                            <span className="text-lg font-bold">
                                Orders
                            </span>
                            <span className="text-3xl font-bold">
                                36
                            </span>
                            <span>
                                Today
                            </span>
                            <div className="flex flex-row items-center gap-2">
                                <FontAwesomeIcon icon={faCaretDown} className="text-[20px]" />
                                <span>
                                    <b>3</b> vs last week
                                </span>
                            </div>

                            <Image className="mt-[15px]"
                                src={"https://placehold.co/600x600?text=Graph Of Stats"} width={600}
                                height={600} alt="https://placehold.co/600x400?text=Graph Of Stats" />
                        </div>

                        <div className="flex flex-col gap-2 bg-gray-300 w-fit p-3 rounded-lg">
                            <span className="text-lg font-bold">
                                Revenue
                            </span>
                            <span className="text-3xl font-bold">
                                $529.18
                            </span>
                            <span>
                                Today
                            </span>
                            <div className="flex flex-row items-center gap-2">
                                <FontAwesomeIcon icon={faCaretDown} className="text-[20px]" />
                                <span>
                                    <b>$373.13</b> vs last week
                                </span>
                            </div>

                            <Image className="mt-[15px]"
                                src={"https://placehold.co/600x600?text=Graph Of Stats"} width={600}
                                height={600} alt="https://placehold.co/600x400?text=Graph Of Stats" />
                        </div>

                        <div className="flex flex-col gap-2 bg-gray-300 w-fit p-3 rounded-lg">
                            <span className="text-lg font-bold">
                                Net Profit
                            </span>
                            <span className="text-3xl font-bold">
                                $389.14
                            </span>
                            <span>
                                Today
                            </span>
                            <div className="flex flex-row items-center gap-2">
                                <FontAwesomeIcon icon={faCaretUp} className="text-[20px]" />
                                <span>
                                    <b>$183</b> vs last week
                                </span>
                            </div>

                            <Image className="mt-[15px]"
                                src={"https://placehold.co/600x600?text=Graph Of Stats"} width={600}
                                height={600} alt="https://placehold.co/600x400?text=Graph Of Stats" />
                        </div>
                    </div>
                    <div className="w-full bg-black col-span-3 p-3 pt-5 pb-5 text-white mt-1
                        font-bold rounded-xl text-center cursor-pointer flex flex-row gap-2 items-center justify-center"
                        onClick={() => { alert("SUPPOSED TO LINK TO YOUR OWN BUSINESS API TOOL ") }}>
                        Your own API management tool <FontAwesomeIcon icon={faArrowCircleRight} className="text-[25px]" />
                    </div>
                </div>
            </div>

            <span className='font-bold italic text-gray-600 text-center'>
                *THIS IS FRONTEND MOCKUP ONLY, NO BACKEND ATM*
            </span>

        </div >
    </>
}