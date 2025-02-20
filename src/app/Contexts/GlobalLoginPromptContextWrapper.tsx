"use client";

import { SetStateAction, useContext, useEffect, useState } from "react"
import { GlobalLoginPromptContext, GlobalLoginTypeContext } from "./GlobalLoginPromptContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface GlobalLoginPromptProps {
    show: boolean,
    setShow: React.Dispatch<SetStateAction<boolean>>,
    message: string
}

export function GlobalLoginTypeContextWrapper({ children }: { children: React.ReactNode }) {

    const [logIn, setLogin] = useState<boolean>(true);

    return <>
        <GlobalLoginTypeContext.Provider value={{
            logIn: logIn,
            setLogIn: setLogin
        }}>

            {children}
        </GlobalLoginTypeContext.Provider>
    </>
}

function GlobalLoginPrompt(props: GlobalLoginPromptProps) {
    const { setLogIn } = useContext(GlobalLoginTypeContext);
    //true is login false is sign up 

    return <>
        <div className={`w-screen h-screen bg-black opacity-50
            left-0 top-0 ${props.show ? "fixed" : "hidden"}`}
            onClick={() => props.setShow(false)} style={{ zIndex: 40 }}>

        </div>

        <div className={`${props.show ? "fixed" : "hidden"} w-screen h-screen top-0 left-0 flex 
        items-center justify-center pointer-events-none`}
            style={{ zIndex: 40 }}>
            <div className={`absolute pointer-events-auto ${props.show
                ? "flex flex-col p-3 gap-5 rounded-2xl w-8/12 max-w-[350px] min-w-[230px]"
                : "hidden"} bg-white `}
                style={{ zIndex: 40 }}>
                <div className="flex flex-row justify-between gap-3 items-center font-bold">
                    {props.message}
                    <FontAwesomeIcon icon={faCircleXmark} size="2x"
                        className="cursor-pointer"
                        onClick={() => props.setShow(false)} />
                </div>

                <div className="flex flex-col justify-between items-center">
                    <span className="font-bold mb-2">
                        New user?
                    </span>
                    <Link href={"/LoginPage"}
                        onClick={() => {
                            props.setShow(false);
                            setLogIn(false)
                        }}
                        className="p-3 font-bold text-sm rounded-full 
                    bg-green-800 text-white w-1/2 text-center whitespace-nowrap ">
                        <span>
                            Join us!
                        </span>
                    </Link>
                </div>

                <div className="flex flex-col justify-between items-center">
                    <span className="font-bold mb-2">
                        Already a member?
                    </span>

                    <Link href={"/LoginPage"}
                        onClick={() => {
                            props.setShow(false);
                            setLogIn(true)
                        }}
                        className="p-3 font-bold text-sm rounded-full 
                    bg-blue-800 text-white w-1/2 text-center 2xs:whitespace-nowrap
                    break-auto">
                        <span >
                            Welcome back!
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    </>
}

export default function GlobalLoginPromptContextWrapper({ children }: { children: React.ReactNode }) {

    const [showLoginPrompt, setShowLoginPrompt] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("Login please.");

    return <>
        <GlobalLoginPromptContext.Provider value={{
            showLoginPrompt: showLoginPrompt,
            setShowLoginPrompt: setShowLoginPrompt,
            message: message,
            setMessage: setMessage,
            loginComponent: <GlobalLoginPrompt
                show={showLoginPrompt}
                setShow={setShowLoginPrompt}
                message={message} />
        }}>

            {children}
            <GlobalLoginPrompt
                show={showLoginPrompt}
                setShow={setShowLoginPrompt}
                message={message}
            />
        </GlobalLoginPromptContext.Provider>
    </>
}
