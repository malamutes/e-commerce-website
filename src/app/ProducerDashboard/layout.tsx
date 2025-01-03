"use client";
import DashboardTab from "./staticComponents/DashboardTab";
import DashboardTopBar from "./staticComponents/DashboardTopBar";
import { DashboardTabSmall } from "./staticComponents/DashboardTab";

const maxDashboardHeight = 750;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col sm:container mx-auto p-5">
            <DashboardTopBar />
            <div className=" sm:hidden block flex flex-row justify-center">
                <DashboardTabSmall />
            </div>

            <div className={`flex flex-row overflow-hidden h-[${maxDashboardHeight}px]`} style={{ borderRadius: '50px 0px 0px 50px' }}>
                <div className="w-2/12 sm:block hidden">
                    <DashboardTab />
                </div>

                <div className="sm:w-10/12 w-full">
                    {children}  {/* Here is where page content will go my page.tsx file anything put inside taht file
            will be rendered here and everything outside is static*/}


                </div>
            </div>


        </div>
    );
}

export { maxDashboardHeight }