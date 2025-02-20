"use client";

import { Suspense } from "react";
import ProducerDashboard from "./ProducerDashboard";

export default function ProducerDashboardPage() {
    return (
        <Suspense>
            <ProducerDashboard />
        </Suspense>
    )
}