"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faRuler, faDollarSign, faPalette, faPlusSquare, faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import { SetStateAction, useContext, useEffect, useState } from "react";
import { ShoppingCartContext, ShoppingCartItem } from "../Contexts/ShoppingCartContext";
import Image from "next/image";
import { ShoppingCartContextType } from "../Contexts/ShoppingCartContext";
import { useRouter } from "next/navigation";

interface ShoppingCartProps {
    show: boolean,
    setShow: React.Dispatch<SetStateAction<boolean>>;
}

export interface ShoppingCartItemComponentProps {
    shoppingCartItem: ShoppingCartItem;
    shoppingCartContext: ShoppingCartContextType;

    //type of just lets me retrieve type of object by letting ts do it rather than me manually typing out its shape
}

export function ShoppingCartItemComponent(props: ShoppingCartItemComponentProps) {

    return <>
        <div className="flex 2xs:flex-row flex-col justify-center 3xs:p-5 p-3 min-w-[200px]">
            <div className="flex items-center 2xs:w-1/3 w-full justify-center 2xs:pb-[0px] pb-[10px]">
                <Image alt="ShoppingCartItemImage" src={props.shoppingCartItem.itemImage ?? null}
                    width={150} height={150} />
            </div>

            <div className="flex flex-col justify-center 2xs:w-2/3 w-full 2xs:pl-[20px] 
            2xs:text-start text-center gap-[2.5px]">
                <span className="text-lg italic">
                    {props.shoppingCartItem.itemBrand}
                </span>
                <span className="text-xl font-bold">
                    {props.shoppingCartItem.itemTitle}
                </span>
                <div className="flex flex-row justify-between 3xs:w-4/5 w-full ">
                    <div className="pt-1 pb-1 flex xs:flex-row items-center">
                        <FontAwesomeIcon icon={faRuler} className="pr-[2px]" />
                        <span>
                            {props.shoppingCartItem.itemSize}
                        </span>
                    </div>

                    <div className="pt-1 pb-1 flex xs:flex-row items-center">
                        <FontAwesomeIcon icon={faPalette} className="pr-[2px]" />
                        <span>
                            {props.shoppingCartItem.itemColour}
                        </span>
                    </div>

                    <div className="pt-1 pb-1 flex xs:flex-row items-center">
                        <FontAwesomeIcon icon={faDollarSign} className="pr-[2px]" />
                        <span>
                            {(props.shoppingCartItem.itemPrice * props.shoppingCartItem.itemCount).toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="flex 2xs:flex-row flex-col items-center 2xs:justify-start justify-center">
                    <div className="flex flex-row">
                        <FontAwesomeIcon icon={faMinusSquare}
                            className="cursor-pointer mr-2" size="2x"
                            onClick={() => props.shoppingCartContext.removeOneItemCountFromCart(props.shoppingCartItem)} />
                        <span className="border-2 border-gray-400 w-[32px] h-[32px] grid place-items-center mr-2">
                            {props.shoppingCartItem.itemCount}
                        </span>
                        <FontAwesomeIcon icon={faPlusSquare}
                            className="cursor-pointer mr-2" size="2x"
                            onClick={() => props.shoppingCartContext.addItemToCart(props.shoppingCartItem)} />
                    </div>


                    <div className="2xs:mt=[0px] mt-[5px]">
                        <span className="cursor-pointer hover:underline"
                            onClick={() => {
                                props.shoppingCartContext.removeItemFromCart(props.shoppingCartItem)
                            }}>
                            Remove
                        </span>
                    </div>

                </div>
            </div>

        </div>
    </>
}

export default function ShoppingCart(props: ShoppingCartProps) {
    const [animateShoppingCart, setAnimateShoppingCart] = useState(false);

    useEffect(() => {
        if (props.show) {
            setAnimateShoppingCart(true)
        }
        else {
            setAnimateShoppingCart(false)
        }
    }, [props.show])

    const shoppingCartContext = useContext(ShoppingCartContext);
    const router = useRouter();
    const handleCheckout = () => {
        router.push('/Checkout');
        props.setShow(false);
    }

    return <>
        <div className={`w-screen h-screen bg-black opacity-50 
            left-0 top-0 ${props.show ? "fixed" : "hidden"} z-50`}
            onClick={() => props.setShow(false)} >

        </div>

        <div className={`bg-white right-0 top-0 h-screen
         ${props.show ? `fixed transition-all duration-500 
        ${animateShoppingCart ? "3xs:w-[500px] w-11/12 " : "w-[0px]"}` : "hidden"}
                z-50`}>
            <div className={`flex flex-col h-[80vh] overflow-y-scroll pb-5 
             ${Object.keys(shoppingCartContext.cartState).length === 0
                    ? ""
                    : "border-b-2 border-b-gray-500"}
            `}>
                <div className="flex flex-row justify-between p-5 whitespace-nowrap">
                    <span className="font-bold text-[20px]">
                        YOUR SHOPPING CART
                    </span>
                    <FontAwesomeIcon icon={faX}
                        className="cursor-pointer text-[25px]"
                        onClick={() => props.setShow(false)}
                    />

                </div>

                <div className={`h-[20vh] whitespace-nowrap ${Object.keys(shoppingCartContext.cartState).length === 0 ? "block" : "hidden"} pl-5`}>
                    <span className="italic">
                        There are currently no items in your cart!
                    </span>
                </div>

                <div className="flex flex-col">
                    {Object.keys(shoppingCartContext.cartState).map((shoppingCartItem, index) => (
                        <div key={index} className="ml-5 mr-5 mb-5 shadow-lg ">
                            <ShoppingCartItemComponent
                                shoppingCartItem={shoppingCartContext.cartState[shoppingCartItem]}
                                shoppingCartContext={shoppingCartContext}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className={`h-[20vh] ${Object.keys(shoppingCartContext.cartState).length === 0 ? "hidden" : "block"}`}>
                <div>
                    <div className="flex flex-row justify-between p-5">

                        <span className="text-xl font-bold">
                            TOTAL
                        </span>

                        <span className="text-xl font-bold">
                            ${`${shoppingCartContext.getTotal().toFixed(2)}`}
                        </span>

                    </div>

                    <button className="bg-green-700 text-white p-4 rounded-full w-2/3 
                    block mx-auto disabled:bg-gray-400 transition-all duration-300
                        hover:ring-[2.5px] hover:ring-custom-green hover:ring-offset-[3px] hover:bg-white hover:text-custom-green" onClick={handleCheckout}>
                        <span className="font-bold">
                            Checkout Products!
                        </span>

                    </button>

                </div>

            </div>


        </div>
    </>
}