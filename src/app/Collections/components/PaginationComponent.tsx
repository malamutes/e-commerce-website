"use client";

import { SetStateAction, useEffect, useState } from "react";

interface PaginationComponentProps {
    numOfPages: number,
    currentPage: number,
    setCurrentPage: React.Dispatch<SetStateAction<number>>
}

export default function PaginationComponent(props: PaginationComponentProps) {
    const window = 2; //determines how many pages before it turns to ellipsis
    const [paginationPages, setPaginationPages] = useState<string[]>([]);

    useEffect(() => {
        const updatePagesArray = [...paginationPages];

        if (props.numOfPages <= 5) {
            for (let i = 1; i <= props.numOfPages; i++) {
                updatePagesArray.push(i.toString());
            };
        }

        else {
            if (props.currentPage + window <= 5) {
                for (let i = 1; i <= 5; i++) {
                    updatePagesArray.push(i.toString());
                };
                if (props.currentPage + 2 * window < props.numOfPages) {
                    updatePagesArray.push("...");
                }
                updatePagesArray.push(props.numOfPages.toString());
            }

            else if (props.currentPage + 2 * window >= props.numOfPages) {
                updatePagesArray.push("1");
                updatePagesArray.push("...");
                for (let i = props.numOfPages - 2 * window; i <= Math.max(props.currentPage, props.numOfPages); i++) {
                    updatePagesArray.push(i.toString());
                };
            }

            else {
                updatePagesArray.push("1");
                if (props.currentPage - 2 * window >= 1) {
                    updatePagesArray.push("...");
                }

                for (let i = Math.min(props.currentPage - window); i <= Math.max(props.currentPage + window); i++) {
                    updatePagesArray.push(i.toString());
                };
                if (props.currentPage + window < props.numOfPages) {
                    updatePagesArray.push("...");
                }
                updatePagesArray.push(props.numOfPages.toString());
            }
        }

        setPaginationPages(updatePagesArray);

    }, [props.currentPage]);

    useEffect(() => {
        console.log(props.currentPage, paginationPages);
    }, [paginationPages])

    return <>
        <div className="flex justify-center items-center w-full mb-10 mt-10">
            <div className="flex flex-wrap justify-center gap-3">
                {paginationPages.map((numOfPage, index) => {
                    if (numOfPage === "...") {
                        return (
                            <span
                                key={index}
                                className={`text-center text-3xl
                                        text-gray-600}`}
                            >
                                {"..."}
                            </span>
                        )
                    }
                    else {
                        return (
                            <div
                                key={index}
                                className={`p-3 text-center rounded-full border-2 
                                            border-black cursor-pointer w-[50px] h-[50px] 
                                            ${props.currentPage === (Number(numOfPage)) ? "bg-black text-white font-bold" : "hover:bg-gray-300"}`}
                                onClick={() => {
                                    props.setCurrentPage(Number(numOfPage));
                                    global.window.scrollTo({ top: 0, left: 0, behavior: "instant" });
                                }}
                            >
                                {Number(numOfPage)}
                            </div>
                        )
                    }
                })}
            </div>
        </div>
    </>
}