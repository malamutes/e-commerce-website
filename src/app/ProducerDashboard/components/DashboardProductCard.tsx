"use client";

import { Product } from "./Products";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { gridLayout } from "./Products";

interface DashBoardProductCardProps {
    product: Product
}

export default function DashBoardProductCard(props: DashBoardProductCardProps) {
    const [showProductEllipsisMenu, setShowProductEllipsisMenu] = useState(false);

    const fieldClass = "text-center";
    const productEllipsisMenuItemClass = "cursor-pointer pl-2 pr-2 rounded-lg hover:bg-gray-100";
    return <>
        <div className="grid grid-cols-8 border-2 border-black w-full rounded-lg p-2.5 bg-gray-200"
            style={{ gridTemplateColumns: gridLayout }}>
            <span className={fieldClass}>
                {props.product['product_id']}
            </span>

            <span className={fieldClass}>
                {props.product['product_name']}
            </span>

            <span className={fieldClass}>
                {props.product['product_price']}
            </span>

            <span className={fieldClass}>
                {props.product['product_type']}
            </span>

            <span className={fieldClass}>
                {(props.product['product_size'] as string[]).join(" | ")}
            </span>

            <span className={fieldClass}>
                0
            </span>

            <span className={fieldClass}>
                0
            </span>

            <span className={fieldClass}>
                0
            </span>
        </div>

        <div className="relative flex items-center ml-[15px]"
            onMouseEnter={() => setShowProductEllipsisMenu(true)}
            onMouseLeave={() => setShowProductEllipsisMenu(false)}>
            <FontAwesomeIcon icon={faEllipsisH}
                size="2x"
                className="cursor-pointer"

            />

            <div className={`absolute ${showProductEllipsisMenu
                ? "flex" : "hidden"}
                                    left-1/2 transform -translate-x-1/2 pt-[15px] w-fit bg-gray-300 p-2 rounded-lg
                                    flex flex-col text-nowrap p-1 z-10
                                    `}>
                <Link className={productEllipsisMenuItemClass}
                    href={`/Collections/All/Products/?productID=${props.product['product_id']}`}>
                    <span >
                        View Product
                    </span>

                </Link>

                <span className={productEllipsisMenuItemClass}>
                    Update Product
                </span>

                <span className={productEllipsisMenuItemClass}>
                    Recall Product
                </span>
            </div>
        </div>


    </>
}