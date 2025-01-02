"use client";
import { clothingCategory, sexCategory, clothingSizes, clothingColours, sortFeatureCategory } from "@/app/CollectionTypes";

import FilterTabMenuMulti from "./FilterTabMenu";
import { FilterTabMenuSingle } from "./FilterTabMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons/faSliders";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

interface FilterTabProps {
    sexFilter: string[];
    setSexFilter: React.Dispatch<React.SetStateAction<string[]>>;

    colourFilter: string[];
    setColourFilter: React.Dispatch<React.SetStateAction<string[]>>;

    sizeFilter: string[];
    setSizeFilter: React.Dispatch<React.SetStateAction<string[]>>;

    sortingFilter: string;
    setSortingFilter: React.Dispatch<React.SetStateAction<string>>;

    onSale: string;
    setOnSale: React.Dispatch<React.SetStateAction<string>>;

    clothingFilter: string;
    setClothingFilter: React.Dispatch<React.SetStateAction<string>>;
}

export default function FilterTabLarge(props: FilterTabProps) {
    const {
        sexFilter, setSexFilter,
        colourFilter, setColourFilter,
        sizeFilter, setSizeFilter,
        sortingFilter, setSortingFilter,
        onSale, setOnSale,
        clothingFilter, setClothingFilter
    } = props;

    return <>
        <div className="flex flex-col ">
            <FilterTabMenuSingle
                title="Categories"
                categoryArray={clothingCategory}
                filterState={clothingFilter}
                filterSetState={setClothingFilter}
            />

            <FilterTabMenuMulti
                title="Sex"
                categoryArray={sexCategory}
                filterStateArray={sexFilter}
                filterSetStateArray={setSexFilter}
            />

            <FilterTabMenuMulti
                title="Colours"
                categoryArray={clothingColours}
                filterStateArray={colourFilter}
                filterSetStateArray={setColourFilter}
            />

            <FilterTabMenuMulti
                title="Sizes"
                categoryArray={clothingSizes}
                filterStateArray={sizeFilter}
                filterSetStateArray={setSizeFilter}
            />

            <FilterTabMenuSingle
                title="Sale"
                categoryArray={["On Sale"]}
                filterState={onSale}
                filterSetState={setOnSale}
            />

            <FilterTabMenuSingle
                title="Sort By"
                categoryArray={sortFeatureCategory}
                filterState={sortingFilter}
                filterSetState={setSortingFilter}
            />
        </div>
    </>
}

export function FilterTabSmall(props: FilterTabProps) {
    const {
        sexFilter, setSexFilter,
        colourFilter, setColourFilter,
        sizeFilter, setSizeFilter,
        sortingFilter, setSortingFilter,
        onSale, setOnSale,
        clothingFilter, setClothingFilter
    } = props;

    const [filterOffCanvas, setFilterOffCanvas] = useState(false);

    return <>
        <div className="flex flex-row items-center 
        border-2 border-gray-300 mb-5 cursor-pointer
        justify-between p-3"
            onClick={() => setFilterOffCanvas(true)}
        >
            <span>
                Filter & Sort
            </span>
            <FontAwesomeIcon icon={faSliders} />
        </div>

        <div className={`fixed h-screen w-screen bg-black 
            ${filterOffCanvas ? "opacity-60" : "hidden"} top-0 left-0`}
            onClick={() => setFilterOffCanvas(false)}
            style={{ zIndex: 0 }}>
        </div>

        <div className={`${filterOffCanvas ? "fixed" : "hidden"}
            w-5/6 bg-white flex flex-col h-screen top-0 left-0`}
            style={{ zIndex: 50 }}
        >
            <div className="flex justify-between">
                <span className="text-xl">
                    Filters
                </span>

                <FontAwesomeIcon icon={faX}
                    className="cursor-pointer"
                    onClick={() => setFilterOffCanvas(false)} size="2x" />
            </div>

            <div className="flex flex-col mr-5">
                <FilterTabMenuSingle
                    title="Categories"
                    categoryArray={clothingCategory}
                    filterState={clothingFilter}
                    filterSetState={setClothingFilter}
                />

                <FilterTabMenuMulti
                    title="Sex"
                    categoryArray={sexCategory}
                    filterStateArray={sexFilter}
                    filterSetStateArray={setSexFilter}
                />

                <FilterTabMenuMulti
                    title="Colours"
                    categoryArray={clothingColours}
                    filterStateArray={colourFilter}
                    filterSetStateArray={setColourFilter}
                />

                <FilterTabMenuMulti
                    title="Sizes"
                    categoryArray={clothingSizes}
                    filterStateArray={sizeFilter}
                    filterSetStateArray={setSizeFilter}
                />

                <FilterTabMenuSingle
                    title="Sale"
                    categoryArray={["On Sale"]}
                    filterState={onSale}
                    filterSetState={setOnSale}
                />

                <FilterTabMenuSingle
                    title="Sort By"
                    categoryArray={sortFeatureCategory}
                    filterState={sortingFilter}
                    filterSetState={setSortingFilter}
                />
            </div>
        </div>
    </>
}