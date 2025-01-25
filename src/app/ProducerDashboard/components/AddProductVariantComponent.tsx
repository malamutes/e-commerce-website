"use client";

import { SetStateAction, useState } from "react";
import { productVariantInterface } from "./AddProduct";
import { clothingSizes, clothingColours } from "@/app/CollectionTypes";

interface AddProductVariantComponentProps {
    show: boolean,
    setShow: React.Dispatch<SetStateAction<boolean>>,
    productVariant: productVariantInterface,
    setProductVariant: React.Dispatch<SetStateAction<productVariantInterface>>,
}

interface ProductVariantColourProps {
    size: string,
    clothingColours: string[],
    productVariant: productVariantInterface,
    setProductVariant: React.Dispatch<SetStateAction<productVariantInterface>>,
}

interface ProductVariantQuantityProps {
    size: string,
    colour: string,
    productVariant: productVariantInterface,
    setProductVariant: React.Dispatch<SetStateAction<productVariantInterface>>,
}

function AddProductVariantQuantity(props: ProductVariantQuantityProps) {

    const [quantity, setQuantity] = useState(0);
    const [showQuantity, setShowQuantity] = useState<boolean>(false);

    const handleSetVariant = (colour: string) => {
        if (quantity >= 1) {
            const updatedProductVariant = { ...props.productVariant };
            updatedProductVariant[props.size] = {
                ...updatedProductVariant[props.size],
                [colour]: quantity
            }
            props.setProductVariant(updatedProductVariant);
            setShowQuantity(false);
        }
        else {
            alert("VALID QUANTITY VALUE PLEASE!")
        }
    }

    const handleRemoveVariant = (colour: string) => {
        if (props.productVariant[props.size][colour]) {
            const updatedProductVariant = { ...props.productVariant }
            const { [colour]: _, ...keepProductVariant } = updatedProductVariant[props.size]
            if (Object.keys(keepProductVariant).length === 0) {
                //if there are no more variants inside the size just remove size altogether
                //need to check if : _ the _ is varaible to access value of removed key?
                const { [props.size]: _, ...removedEmptySizeVariant } = updatedProductVariant;
                props.setProductVariant(removedEmptySizeVariant);
            }
            else {
                //otherwise update as normal
                updatedProductVariant[props.size] = keepProductVariant;
                props.setProductVariant(updatedProductVariant);
            }
            setQuantity(0);
            setShowQuantity(false);
        }
        else {
            alert("NOT IN PRODUCTRS ANYWAY")
        }

    }

    return (
        <>
            <div className={`p-3 border-2 border-black rounded-xl cursor-pointer 
                ${showQuantity ? "bg-gray-300" : " hover:bg-gray-200"} `}
                onClick={() => setShowQuantity(showQuantity => !showQuantity)}
            >
                {props.colour}
            </div>

            <div className={`flex flex-col ${showQuantity ? "block" : "hidden"} gap-3 p-2`}>

                <input
                    className="border-2 border-black max-w-[100%] p-2 rounded-xl"
                    type="number"
                    value={quantity}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuantity(Number(event.target.value))}
                />



                <span className='w-full p-1 rounded-xl bg-black text-white cursor-pointer font-bold text-sm'
                    onClick={() => handleSetVariant(props.colour)}
                >SAVE</span>
                <span className='w-full p-1 rounded-xl bg-black text-white cursor-pointer font-bold text-sm break-all'
                    onClick={() => handleRemoveVariant(props.colour)}
                >REMOVE</span>


            </div>
        </>


    )
}

function ProductVariantColour(props: ProductVariantColourProps) {

    const [show, setShow] = useState(false);

    return <>
        <div className="flex flex-col gap-5 text-center">
            <div className={`p-3 border-2 border-black rounded-xl cursor-pointer 
                ${show ? "bg-gray-300" : " hover:bg-gray-200"}`} onClick={() => setShow(show => !show)}>
                {props.size}
            </div>
            <div className={`${show ? "block" : "hidden"} grid xl:grid-cols-3 grid-cols-2 gap-3`}>
                {props.clothingColours.map((colour) => (
                    <div key={colour} >
                        <AddProductVariantQuantity
                            colour={colour}
                            size={props.size}
                            productVariant={props.productVariant}
                            setProductVariant={props.setProductVariant}
                        />
                    </div>

                ))}
            </div>
        </div>
    </>
}

export default function AddProductVariantComponent(props: AddProductVariantComponentProps) {
    return <>
        <div className={`${props.show ? "block" : "hidden"} grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3`}>
            {clothingSizes.map((size) => (
                <ProductVariantColour key={size}
                    size={size}
                    clothingColours={clothingColours}
                    productVariant={props.productVariant}
                    setProductVariant={props.setProductVariant}
                />
            ))}


        </div>
        <span className={`w-fit p-5 bg-black text-white mt-5 
        cursor-pointer rounded-xl w-full text-center font-bold ${props.show ? "block" : "hidden"}`}
            onClick={() => props.setShow(false)}
        >CLOSE FORM</span>
    </>
}