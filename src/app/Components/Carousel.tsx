"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";

interface CarouselProps {
    itemsArray: string[],
}


const clampFunc = function clamp(value: number, min: number, max: number) {
    return (Math.max(Math.min(value, max), min));
}


export default function Carousel(props: CarouselProps) {
    const numItems = props.itemsArray.length;
    const [currentIndex, setCurrentIndex] = useState(0);

    return <>
        <div className="w-full h-fit flex flex-row justify-center items-center relative">
            <FontAwesomeIcon icon={faChevronLeft} size="2x" className="z-10 cursor-pointer absolute left-0"
                onClick={() => setCurrentIndex(currentIndex => clampFunc(currentIndex - 1, 0, numItems - 1))}
            />
            <FontAwesomeIcon icon={faChevronRight} size="2x" className="z-10 cursor-pointer absolute right-0"
                onClick={() => setCurrentIndex(currentIndex => clampFunc(currentIndex + 1, 0, numItems - 1))}
            />

            <div className="absolute bottom-0">
                {Array(numItems).fill("CircleNav").map((item, index) => (
                    <FontAwesomeIcon
                        className="m-1 cursor-pointer"
                        icon={faCircle}
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>

            <div className="left-0 top-0 w-full h-full">
                <Image src={props.itemsArray[currentIndex] || "https://placehold.co/600x600?text=CannotFindImage"}
                    width={1000}
                    height={1000}
                    alt={`ProductCarouselImage-${currentIndex}`} />
            </div>
        </div>
    </>
}

export { clampFunc }