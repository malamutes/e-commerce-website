"use client";
import DashboardTab from "./staticComponents/DashboardTab";
import DashboardTopBar from "./staticComponents/DashboardTopBar";

const maxDashboardHeight = 750;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col container mx-auto ">
            <DashboardTopBar />
            <div className={`flex flex-row overflow-hidden h-[${maxDashboardHeight}px]`} style={{ borderRadius: '50px 0px 0px 50px' }}>
                <div className="w-2/12 ">
                    <DashboardTab />
                </div>

                <div className="w-10/12">
                    {children}  {/* Here is where page content will go my page.tsx file anything put inside taht file
            will be rendered here and everything outside is static*/}


                </div>
            </div>


        </div>
    );
}

export { maxDashboardHeight }