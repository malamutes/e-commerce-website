"use client";

import { Suspense } from "react";
import ProducerDashboard from "./ProducerDashboard";

export default function ProductDashboardPage() {
    return (
        <Suspense>
            <ProducerDashboard />
        </Suspense>
    )
}