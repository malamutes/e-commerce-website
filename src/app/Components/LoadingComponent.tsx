"use client";

import { SetStateAction } from "react";
interface LoadingComponentProps {
    height: string,
    width: string,
    minHeight?: string
}

//relevant files/componetns are producte page, account page, producer page and collection pages

export default function LoadingComponent(props: LoadingComponentProps) {
    const animationDur = "1s";
    const centerY = parseInt(props.height) / 2 - 5;

    return (
        <div className={`flex flex-row justify-center w-full items-center ${props.minHeight}`}>
            <svg
                width={props.width}
                height={props.height}
                viewBox={`0 0 ${props.width} ${props.height}`}
                xmlns="http://www.w3.org/2000/svg"
            >

                <rect x="10" y={centerY} width="10" height="10" fill="black">
                    <animate attributeName="y" values={`${centerY}; ${centerY - 15}; ${centerY}`} dur={animationDur} repeatCount="indefinite" />
                    <animate attributeName="height" values="10; 40; 10" dur={animationDur} repeatCount="indefinite" />
                </rect>


                <rect x="30" y={centerY} width="10" height="10" fill="black">
                    <animate attributeName="y" values={`${centerY}; ${centerY - 15}; ${centerY}`} dur={animationDur} repeatCount="indefinite" begin="0.1s" />
                    <animate attributeName="height" values="10; 40; 10" dur={animationDur} repeatCount="indefinite" begin="0.1s" />
                </rect>


                <rect x="50" y={centerY} width="10" height="10" fill="black">
                    <animate attributeName="y" values={`${centerY}; ${centerY - 15}; ${centerY}`} dur={animationDur} repeatCount="indefinite" begin="0.2s" />
                    <animate attributeName="height" values="10; 40; 10" dur={animationDur} repeatCount="indefinite" begin="0.2s" />
                </rect>


                <rect x="70" y={centerY} width="10" height="10" fill="black">
                    <animate attributeName="y" values={`${centerY}; ${centerY - 15}; ${centerY}`} dur={animationDur} repeatCount="indefinite" begin="0.3s" />
                    <animate attributeName="height" values="10; 40; 10" dur={animationDur} repeatCount="indefinite" begin="0.3s" />
                </rect>


                <rect x="90" y={centerY} width="10" height="10" fill="black">
                    <animate attributeName="y" values={`${centerY}; ${centerY - 15}; ${centerY}`} dur={animationDur} repeatCount="indefinite" begin="0.4s" />
                    <animate attributeName="height" values="10; 40; 10" dur={animationDur} repeatCount="indefinite" begin="0.4s" />
                </rect>
            </svg>

        </div>
    );
}

interface FullScreenLoadingComponentProps {
    show: boolean,
    setShow: React.Dispatch<SetStateAction<boolean>>,
    zIndex?: number
}

export function FullScreenLoadingComponent(props: FullScreenLoadingComponentProps) {
    return (
        <div className={`w-screen h-screen fixed top-0 left-0 bg-white bg-opacity-75 ${props.show ? "block" : "hidden"}`} style={{ zIndex: props.zIndex }}>
            <LoadingComponent
                width="100"
                height="100"
                minHeight="min-h-screen"
            />
        </div>
    )
}

/* 
 
            */