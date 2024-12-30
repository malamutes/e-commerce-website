"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

interface FilterTabMenuMultiProps {
    title: string,
    categoryArray: string[],
    filterStateArray: string[],
    filterSetStateArray: React.Dispatch<React.SetStateAction<string[]>>;
}

interface FilterTabMenuSingleProps {
    title: string,
    categoryArray: string[],
    filterState: string,
    filterSetState: React.Dispatch<React.SetStateAction<string>>;
}

const titleClass = "flex justify-between pt-3 items-center cursor-pointer ";

export default function FilterTabMenuMulti(props: FilterTabMenuMultiProps) {

    const [showMenu, setShowMenu] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const justSelectedFilter = e.target.value;
        props.filterSetStateArray((sizeFilter) => {
            if (sizeFilter.includes(justSelectedFilter)) {
                return sizeFilter.filter(size => size !== justSelectedFilter);
            }

            return [...sizeFilter, justSelectedFilter];
        });
    };

    return <>
        <div className="pl-5">
            <div className={titleClass}
                onClick={() => setShowMenu(showMenu => !showMenu)}
            >
                <span className="text-lg font-[500]">
                    {props.title}
                </span>
                <FontAwesomeIcon icon={faChevronDown} className={`transition-all duration-250 
                    ${showMenu ? "rotate-180" : ""}`} />
            </div>

            <div className={`flex flex-col overflow-hidden pb-3 pl-2`}
                style={{
                    transition: `max-height 0.5s ease-in-out`,
                    maxHeight: showMenu ? "500px" : "0px",
                }}
            >
                {props.categoryArray.map((element, index) => (
                    <span key={element}
                        className={`transition-all ease-in-out `}
                        style={{
                            transitionDelay: `${showMenu ? index * (500 / props.categoryArray.length) :
                                (props.categoryArray.length - index - 1) * 37.5}ms`,
                            opacity: showMenu ? 1 : 0,
                            transform: `scale(${showMenu ? "1" : "0"})`
                        }}
                    >
                        <input
                            type="checkbox"
                            id={element}
                            value={element}
                            checked={props.filterStateArray.includes(element)}
                            onChange={handleChange}
                            className="mr-2 "
                        />
                        <label htmlFor={element}>{element}</label>
                    </span>
                ))}
            </div>

            <hr className="border-t-1 border-gray-500"></hr>
        </div>

    </>
}

export function FilterTabMenuSingle(props: FilterTabMenuSingleProps) {

    const [showMenu, setShowMenu] = useState(false);

    return <>
        <div className="pl-5">
            <div className={titleClass}
                onClick={() => setShowMenu(showMenu => !showMenu)}
            >
                <span className="text-lg font-[500]">
                    {props.title}
                </span>
                <FontAwesomeIcon icon={faChevronDown} className={`transition-all duration-250 
                    ${showMenu ? "rotate-180" : ""}`} />
            </div>

            <div className={`flex flex-col overflow-hidden pb-3 pl-2`}
                style={{
                    transition: `max-height 0.6s ease-in-out`,
                    maxHeight: showMenu ? "500px" : "0px",
                }}
            >
                {props.categoryArray.map((clothing, index) => (
                    <span key={clothing} onClick={() => {
                        if (props.filterState !== clothing) {
                            props.filterSetState(clothing);
                        }
                        else {
                            props.filterSetState("");
                        }

                    }}
                        className={`${props.filterState === clothing ? "font-black font-lg" : "font-medium font-md"} 
                        cursor-pointer transition-all ease-in-out `}
                        style={{
                            transitionDelay: `${showMenu ? index * (500 / props.categoryArray.length) :
                                (props.categoryArray.length - index - 1) * 37.5}ms`,
                            opacity: showMenu ? 1 : 0,
                            transform: `scale(${showMenu ? "1" : "0"})`
                        }}
                    >
                        {clothing}
                    </span>
                ))}
            </div>
            <hr className="border-t-1 border-gray-500"></hr>
        </div>


    </>
}