"use client";
import DashboardTab from "./components/DashboardTab";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-row">
            <div className="w-1/12">
                <DashboardTab />
            </div>

            {children}  {/* Here is where page content will go my page.tsx file anything put inside taht file
            will be rendered here and everything outside is static*/}

        </div>
    );
}