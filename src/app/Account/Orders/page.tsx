"use client";

import OrderDetails from "./OrderDetails";
import { Suspense } from "react";

export default function OrdersPageWithSuspense() {
    return (
        <Suspense >
            <OrderDetails />
        </Suspense>
    )
};

