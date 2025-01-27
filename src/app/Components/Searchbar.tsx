"use client"

import { faMagnifyingGlass, faSquareXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { SetStateAction, useState } from "react"

interface SearchbarProps {
    show: boolean,
    setShow: React.Dispatch<SetStateAction<boolean>>
}

const handleSearch = async (searchQuery: string) => {
    const response = await fetch(`/api/SearchQuery?searchBarQuery=${searchQuery}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json'
        }
    })

    if (response.ok) {
        const reply = await response.json();
        console.log(reply)
    }
    else {
        console.log(response.statusText, "SEARCH BAR QUERY ERROR CHECK LOGS")
    }
}

const handleEnterSearch = (event: React.KeyboardEvent, searchQuery: string) => {
    if (event.key === "Enter") {
        event.preventDefault()
        handleSearch(searchQuery);
    }
}

export default function Searchbar(props: SearchbarProps) {
    const [searchQuery, setSearchQuery] = useState("");

    return <>
        <div className={`w-screen fixed h-screen top-0 left-0 bg-black bg-opacity-50
            ${props.show ? "lg:block hidden" : "hidden"} `}
            onClick={() => props.setShow(false)}>
            <div className="h-[50vh] bg-white "
                onClick={(event: React.MouseEvent<HTMLDivElement>) => event.stopPropagation()}>
                <div className="bg-gray-200 w-full">
                    <div className="w-1/2 flex flex-row mx-auto p-5 gap-5 justify-center items-center">
                        <div className="relative w-5/6">
                            <input
                                type="text"
                                className="w-full p-3 pl-5 rounded-lg border-[1px] border-black border-opacity-25"
                                placeholder="Search products or brands"
                                value={searchQuery}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value)}
                                style={{ boxShadow: "2.5px 2.5px 5px rgba(0,0,0,0.1)" }}
                                onKeyDown={(event: React.KeyboardEvent) => handleEnterSearch(event, searchQuery)}
                            />
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-[18px]
                            text-gray-500 cursor-pointer hover:scale-125 ease-in-out duration-500"
                                onClick={() => handleSearch(searchQuery)}
                            />
                        </div>
                        <FontAwesomeIcon icon={faSquareXmark} className="text-[40px] cursor-pointer"
                            onClick={() => props.setShow(false)} />
                    </div>
                </div>
                <div className="h-full w-full p-3">

                </div>
            </div>
        </div>
    </>
}


export function SearchbarSmall() {
    const [searchQuery, setSearchQuery] = useState("");

    return <>
        <div className={`lg:hidden block`}>
            <div className="flex items-center"
                onClick={(event: React.MouseEvent<HTMLDivElement>) => event.stopPropagation()}>
                <div className="w-full flex flex-row mx-auto p-5 gap-5 
                justify-center items-center ">
                    <div className="relative w-full">
                        <input
                            type="text"
                            className="w-full p-3 pl-5 rounded-lg border-[1px] border-black border-opacity-25"
                            placeholder="Search products or brands"
                            value={searchQuery}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value)}
                            style={{ boxShadow: "2.5px 2.5px 5px rgba(0,0,0,0.1)" }}
                            onKeyDown={(event: React.KeyboardEvent) => handleEnterSearch(event, searchQuery)}
                        />
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className="absolute right-5 top-1/2 transform -translate-y-1/2 text-[18px]
                            text-gray-500 cursor-pointer hover:scale-125 ease-in-out duration-500"
                            onClick={() => handleSearch(searchQuery)}
                        />
                    </div>

                </div>
            </div>
        </div>
    </>
}