"use client";

import { useSession } from "next-auth/react";

export default function DashboardTopBar() {
    const { data: session } = useSession();
    return <>
        <div className="flex flex-row pt-10 pb-10">
            <div>
                <p className="text-2xl font-bold">
                    Welcome Back, {session?.user.firstName}!
                </p>

                <span className="italic block mt-[10px]">
                    Your central hub for managing production and performance.
                </span>
            </div>


        </div>

    </>
}