"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Product } from "../ProducerDashboard/components/Products";
import { clothingCategory } from "../CollectionTypes";
import Link from "next/link";

export default function Collections() {
    return <>
        PRODUCT VIEW
        <div className="flex flex-col">
            {clothingCategory.map((category) => (
                <Link key={category} href={`/Collections/${category}`}
                    className="border-2 border-black w-fit hover:bg-gray-400 p-2 rounded-md"
                >
                    <span >
                        {category}
                    </span>
                </Link>

            ))}
        </div>

    </>
}