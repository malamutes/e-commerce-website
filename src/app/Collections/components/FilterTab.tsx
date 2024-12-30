"use client";
import { clothingCategory, sexCategory, clothingSizes, clothingColours, sortFeatureCategory } from "@/app/CollectionTypes";

import FilterTabMenuMulti from "./FilterTabMenu";
import { FilterTabMenuSingle } from "./FilterTabMenu";

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

export default function FilterTab(props: FilterTabProps) {
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
                title="Clothing Categories"
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