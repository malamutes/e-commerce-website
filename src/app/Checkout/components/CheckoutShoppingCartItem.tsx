"use client";

import Image from "next/image";
import { ShoppingCartItemComponentProps } from "@/app/components/ShoppingCart";

export function CheckoutShoppingCartItem(props: ShoppingCartItemComponentProps) {

    return <>
        <div className="flex 3xs:flex-row flex-col justify-between p-3 bg-white min-w-[175px]">
            <div className="flex items-center 3xs:w-fit w-full justify-center">
                <Image alt="ShoppingCartItemImage" src={props.shoppingCartItem.itemImage}
                    width={150} height={150} />
            </div>

            <div className="flex 3xs:flex-row flex-col justify-between flex-grow 3xs:mt-[0px]
             mt-[15px]">
                <div className="flex flex-col justify-center 3xs:pl-[20px]
                 2xs:text-start text-center mx-auto 3xs:w-fit w-1/2">
                    <span className="text-lg italic 3xs:text-start text-center">
                        {props.shoppingCartItem.itemBrand}
                    </span>
                    <span className="text-xl font-bold 3xs:text-start text-center">
                        {props.shoppingCartItem.itemTitle}
                    </span>
                    <div className="flex flex-row w-full 3xs:justify-start
                    justify-center">
                        <span className="italic">
                            {props.shoppingCartItem.itemSize} - {props.shoppingCartItem.itemColour}
                        </span>

                    </div>
                </div>

                <div className="pt-1 pb-1 flex flex-col justify-center 3xs:w-1/3 w-1/2
                mx-auto 3xs:items-start items-center">
                    <span className="flex justify-end 3xs:w-full">
                        ${(props.shoppingCartItem.itemPrice).toFixed(2)}
                    </span>
                    <span className="flex justify-end 3xs:w-full">
                        x {(props.shoppingCartItem.itemCount)}
                    </span>
                    <hr className="w-full border-t-[1px] border-black opacity-50 " />
                    <span className="flex justify-end font-bold 3xs:w-full">
                        ${(props.shoppingCartItem.itemPrice * props.shoppingCartItem.itemCount).toFixed(2)}
                    </span>
                </div>
            </div>

        </div>
    </>
}