"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList, faGear, faChartBar, faScrewdriverWrench, faCircleInfo, faBox, IconDefinition } from "@fortawesome/free-solid-svg-icons";
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
        <div className="bg-gray-800 text-gray-300 flex justify-center h-fit pb-3 pt-10 h-full">
            <div className="flex flex-col ">
                <div className="p-5 text-lg font-bold relative ml-[25px]">
                    <div className="w-[3px] h-4/5 bg-white absolute 
                    top-1/2 left-[5px] rounded-full -translate-y-1/2"></div>
                    {session?.user.business?.businessName}'s Dashboard
                </div>

                <div className="ml-[50px]">
                    {dashboardTabs.map((tab) => (
                        <Link href={`/ProducerDashboard?tab=${tab}`} key={tab}
                            onClick={() => setCurrentTab(tab)}
                            className={`rounded-lg w-fit p-5 flex flex-
                            ${currentTab === tab ? "bg-gray-500" : "hover:bg-gray-700 "}
                            `}
                        >
                            <div className={`flex flex-row 
                            items-center
                            `}>
                                <FontAwesomeIcon icon={dashboardTabsIcon[tab]} className="mr-[10px]" />
                                <span className="">
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