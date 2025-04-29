"use client";

import Collection from "./Collection";
import { Suspense } from "react";

export default function Collections() {
    return (
        <Suspense >
            <Collection />
        </Suspense>
    )

}