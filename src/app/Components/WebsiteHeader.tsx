'use client';

import Image from "next/image";
import { faChevronDown, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { clothingCategory, headers, salesCategories } from "../CollectionTypes";
import WebsiteHeaderSmall from "./WebsiteHeaderSmall";
import WebsiteHeaderLarge from "./WebsiteHeaderLarge";

export default function WebsiteHeader() {

    return <>

        <div className="fixed bg-gray-300 w-screen pt-1.5 pb-1.5 h-[100px] z-40" >
            {/* hardcode website top nav to be 100px for now since im using it to sort out padding
            in main body content*/}

            <WebsiteHeaderLarge />

            <WebsiteHeaderSmall />

        </div>

    </>
}