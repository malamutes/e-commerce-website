"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList, faGear, faChartBar, faScrewdriverWrench, faCircleInfo, faBox, IconDefinition, faDesktop } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const dashboardTabsIcon: { [key: string]: IconDefinition } = {
    'Overview': faCircleInfo,
    'Products': faBox,
    'Sales': faChartBar,
    'Orders': faClipboardList,
    'Operations': faScrewdriverWrench,
    'Settings': faGear,
};

export default function DashboardTab() {

    const params = useSearchParams();
    const dashboardTabs = ['Overview', 'Products', 'Sales', 'Orders', 'Operations', 'Settings'];

    const [currentTab, setCurrentTab] = useState(params?.get('tab') ?? "Overview");
    const { data: session, status } = useSession();

    useEffect(() => {
        setCurrentTab(params?.get('tab') ?? "Overview");
    }, [params])

    return <>
        <div className="bg-gray-800 text-gray-300 flex justify-center 
         h-fit pb-3 pt-10 h-full">
            <div className="flex flex-col items-center overflow-hidden">
                <div className="lg:p-5 md:p-3 text-lg font-bold relative lg:bg-gray-900 ">
                    <div className="xl:ml-[25px] lg:block hidden">
                        {session?.user.business?.businessName}'s Dashboard
                    </div>

                    <FontAwesomeIcon icon={faDesktop} className="text-[25px] text-gray-400 lg:hidden block mb-[15px]" />
                </div>

                <div >
                    {dashboardTabs.map((tab) => (
                        <Link href={`/ProducerDashboard?tab=${tab}`} key={tab}
                            onClick={() => setCurrentTab(tab)}
                            className={`rounded-lg w-fit p-5 xl:mr-0 lg:mr-5 mr-0 flex lg:ml-[20px] xl:ml-[0px] 
                            ${currentTab === tab ? "bg-gray-500" : "hover:bg-gray-700 "}
                            `}
                        >
                            <div className={`flex flex-row 
                            items-center
                            `}>
                                <FontAwesomeIcon icon={dashboardTabsIcon[tab]} className="lg:mr-[10px] lg:text-[16px] text-[20px]" />
                                <span className="lg:block hidden">
                                    {tab}
                                </span>
                            </div>

                        </Link>
                    ))}
                </div>

            </div>
        </div>

    </>
}

export function DashboardTabSmall() {

    const params = useSearchParams();
    const dashboardTabs = ['Overview', 'Products', 'Sales', 'Orders', 'Operations', 'Settings'];

    const [currentTab, setCurrentTab] = useState(params?.get('tab') ?? "Overview");

    useEffect(() => {
        setCurrentTab(params?.get('tab') ?? "Overview");
    }, [params])

    return <>
        <div className="bg-gray-800 text-gray-300 flex justify-center p-5
        w-full rounded-full mb-[25px]">
            <div className="xs:flex xs:flex-row grid grid-cols-3 items-center">
                {dashboardTabs.map((tab) => (
                    <Link href={`/ProducerDashboard?tab=${tab}`} key={tab}
                        onClick={() => setCurrentTab(tab)}
                        className={`rounded-full p-3 m-1 text-[20px]
                            ${currentTab === tab ? "bg-gray-500" : "hover:bg-gray-700 "}
                            `}
                    >
                        <FontAwesomeIcon icon={dashboardTabsIcon[tab]} />

                    </Link>
                ))}
            </div>
        </div>

    </>
}