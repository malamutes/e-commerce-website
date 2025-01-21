"use client";

import { SetStateAction } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

interface LoginErrorProps {
    show: boolean,
    setShow: React.Dispatch<SetStateAction<boolean>>
}

export default function LoginError(props: LoginErrorProps) {
    return <>
        <div className={`${props.show ? "block" : "hidden"} border-[1px] border-red-900 
            bg-red-100 p-3 mt-[15px] flex 3xs:flex-row 3xs:text-start flex-col text-center gap-5 items-center`}>
            <FontAwesomeIcon icon={faExclamationCircle} className="text-[30px]" />
            <div>
                <span>
                    Your login attempt was unsuccessful. Please ensure correct credentials and try again.
                </span>
            </div>
        </div>

    </>
}
