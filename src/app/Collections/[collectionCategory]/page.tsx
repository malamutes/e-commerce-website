'use client';

import Link from "next/link";
import { useParams } from "next/navigation"

export default function CollectionCategory() {
    const params = useParams();

    let currentCategory: string | string[] = "";
    if (params) {
        currentCategory = params['collectionCategory'];
    }

    console.log(currentCategory);

    return <>
        <Link href={`/Collections/${currentCategory}/Products`}>
            {currentCategory}
        </Link>

    </>
}