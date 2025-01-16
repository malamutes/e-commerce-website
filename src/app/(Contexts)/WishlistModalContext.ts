import { createContext } from "react";

export interface WishlistContextType {
    currentItemBrand: string;
    currentItemName: string;
    currentItemImage: string | null;
    currentItemID: string,
    selectedWishlist: Set<string>;
    wishListArray: string[],
    showModal: boolean;
    update: boolean,
    setCurrentItemBrand: React.Dispatch<React.SetStateAction<string>>;
    setCurrentItemName: React.Dispatch<React.SetStateAction<string>>;
    setCurrentItemID: React.Dispatch<React.SetStateAction<string>>;
    setCurrentItemImage: React.Dispatch<React.SetStateAction<string | null>>;
    setSelectedWishlist: React.Dispatch<React.SetStateAction<Set<string>>>;
    setWishListArray: React.Dispatch<React.SetStateAction<string[]>>;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}


const WishlistContext = createContext<WishlistContextType>({
    currentItemBrand: "",
    currentItemName: "",
    currentItemImage: null,
    currentItemID: "",
    selectedWishlist: new Set(),
    showModal: false,
    update: false,
    wishListArray: [],
    setCurrentItemBrand: () => { },
    setCurrentItemID: () => { },
    setCurrentItemName: () => { },
    setCurrentItemImage: () => { },
    setSelectedWishlist: () => { },
    setShowModal: () => { },
    setWishListArray: () => { },
    setUpdate: () => { }
});

export { WishlistContext }
