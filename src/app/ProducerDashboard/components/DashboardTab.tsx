"use client";

import Link from "next/link";

export default function DashboardTab() {
    const dashboardTabs = ['Overview', 'Products', 'Sales', 'Orders', 'Operations', 'Settings'];
    const dashboardTabsClass = "cursor-pointer hover:bg-gray-100 w-fit p-2 rounded-lg"

    return <>
        <div className="bg-gray-500 flex">
            <div className="flex flex-col">
                <span>
                    Producer Dashboard
                </span>

                {dashboardTabs.map((tab) => (
                    <Link href={`/ProducerDashboard?tab=${tab}`} key={tab} >
                        <span className={dashboardTabsClass}>
                            {tab}
                        </span>
                    </Link>

                ))}
            </div>
        </div>

    </>
}