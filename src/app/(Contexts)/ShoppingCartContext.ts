import { createContext } from "react";

export interface ShoppingCartItem {
    itemTitle: string,
    itemImage: string,
    itemSize: string,
    itemCount: number,
    itemPrice: number
    itemBrand: string,
    itemID: string,
    itemColour: string,
    itemCartKey: string
}

export interface ShoppingCart { [itemID: string]: ShoppingCartItem };

export interface ShoppingCartContextType {
    cartState: ShoppingCart,
    setCartState: React.Dispatch<React.SetStateAction<{ [key: string]: ShoppingCartItem }>>;
    addItemToCart: (item: ShoppingCartItem) => void,
    removeOneItemCountFromCart: (item: ShoppingCartItem) => void,
    removeItemFromCart: (item: ShoppingCartItem) => void,
    setCountAmount: (item: ShoppingCartItem, count: number) => void,
    clearShoppingCart: () => void,
    getTotal: () => Number
}

const ShoppingCartContext = createContext<ShoppingCartContextType>({
    cartState: {},
    setCartState: () => { },
    addItemToCart: () => { },
    removeOneItemCountFromCart: () => { },
    removeItemFromCart: () => { },
    setCountAmount: () => { },
    clearShoppingCart: () => { },
    getTotal: () => 0
});

export { ShoppingCartContext }
