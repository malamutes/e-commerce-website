"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircle } from "@fortawesome/free-regular-svg-icons";

interface PasswordValidatorProps {
    lengthValid: boolean;
    lowercaseValid: boolean;
    uppercaseValid: boolean;
    numberValid: boolean;
    specialCharValid: boolean;
}

export function PasswordValidator(props: PasswordValidatorProps) {
    return <>
        <div className='bg-gray-300 border-[1px] border-blue-900 p-3 mt-5 flex flex-col gap-2'>
            <div className={`flex flex-row items-center gap-[10px] 
                ${props.lengthValid ? "text-green-800" : "text-red-800"}`}>
                {props.lengthValid ? (
                    <>
                        <FontAwesomeIcon icon={faCircleCheck} />
                        <span>Password is between 8 and 24 characters.</span>
                    </>
                ) : (
                    <>
                        <FontAwesomeIcon icon={faCircle} />
                        <span>Password must be between 8 and 24 characters.</span>
                    </>
                )}
            </div>

            <div className={`flex flex-row items-center gap-[10px] 
                ${props.lowercaseValid ? "text-green-800" : "text-red-800"}`}>
                {props.lowercaseValid ? (
                    <>
                        <FontAwesomeIcon icon={faCircleCheck} />
                        <span>Contains a lowercase letter</span>
                    </>
                ) : (
                    <>
                        <FontAwesomeIcon icon={faCircle} />
                        <span>Must have at least 1 lowercase letter</span>
                    </>
                )}
            </div>

            <div className={`flex flex-row items-center gap-[10px] 
                ${props.uppercaseValid ? "text-green-800" : "text-red-800"}`}>
                {props.uppercaseValid ? (
                    <>
                        <FontAwesomeIcon icon={faCircleCheck} />
                        <span>Contains an uppercase letter</span>
                    </>
                ) : (
                    <>
                        <FontAwesomeIcon icon={faCircle} />
                        <span>Must have at least 1 uppercase letter</span>
                    </>
                )}
            </div>

            <div className={`flex flex-row items-center gap-[10px] 
                ${props.numberValid ? "text-green-800" : "text-red-800"}`}>
                {props.numberValid ? (
                    <>
                        <FontAwesomeIcon icon={faCircleCheck} />
                        <span>Contains a number</span>
                    </>
                ) : (
                    <>
                        <FontAwesomeIcon icon={faCircle} />
                        <span>Must have at least 1 number</span>
                    </>
                )}
            </div>

            <div className={`flex flex-row items-center gap-[10px] 
                ${props.specialCharValid ? "text-green-800" : "text-red-800"}`}>
                {props.specialCharValid ? (
                    <>
                        <FontAwesomeIcon icon={faCircleCheck} />
                        <span>Contains a special character</span>
                    </>
                ) : (
                    <>
                        <FontAwesomeIcon icon={faCircle} />
                        <span>Must have at least 1 special character</span>
                    </>
                )}
            </div>
        </div>
    </>
}