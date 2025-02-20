"use client";
import DashboardTab from "./staticComponents/DashboardTab";
import DashboardTopBar from "./staticComponents/DashboardTopBar";
import { DashboardTabSmall } from "./staticComponents/DashboardTab";
import { Suspense } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense>
            <div className="flex flex-col sm:container mx-auto p-5 min-w-[300px] mb-[50px]">
                <DashboardTopBar />
                <div className=" sm:hidden block flex flex-row justify-center">
                    <DashboardTabSmall />
                </div>

                <div className={`flex flex-row overflow-hidden max-h-[750px]`}>
                    <div className="w-2/12 sm:block hidden">
                        <DashboardTab />
                    </div>

                    <div className="sm:w-10/12 w-full">
                        {children}  {/* Here is where page content will go my page.tsx file anything put inside taht file
            will be rendered here and everything outside is static*/}
                    </div>
                </div>
            </div>
        </Suspense>

    );
}
