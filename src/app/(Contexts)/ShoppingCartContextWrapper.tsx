"use client";

import { useEffect, useState } from "react"
import { ShoppingCartItem } from "./ShoppingCartContext"
import { ShoppingCartContext } from "./ShoppingCartContext"
import { ShoppingCart } from "./ShoppingCartContext";

export default function ShoppingCartContextWrapper({ children }: { children: React.ReactNode }) {

    const [shoppingCart, setShoppingCart] = useState<ShoppingCart>({});

    useEffect(() => {
        const currentCart = localStorage.getItem('ShoppingCart');
        if (currentCart) {
            setShoppingCart(JSON.parse(currentCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('ShoppingCart', JSON.stringify(shoppingCart));
    }, [shoppingCart]);


    const addItemToCart = (cartItem: ShoppingCartItem) => {
        const itemCartKey = `SKU-${cartItem.itemID}-${cartItem.itemColour}-${cartItem.itemSize}`;

        setShoppingCart((prevShoppingCart) => {
            //console.log("SHOPPING CART BLOCK");
            //stuff here being ran twice

            const shoppingCartCopy = { ...prevShoppingCart };

            if (prevShoppingCart[itemCartKey]) {
                //item exists, just increment count
                //dont use something = something in react set state because its unpredictable
                //the whole point is to simply return an 'updated object' rather than modyfying state of anythign directly inside
                shoppingCartCopy[itemCartKey] = {
                    ...shoppingCartCopy[itemCartKey],
                    itemCount: prevShoppingCart[itemCartKey].itemCount + 1,
                };
            }
            else {
                //item dont exist, add it 
                shoppingCartCopy[itemCartKey] = {
                    //unpacking cartitem and overriding item count with 1
                    ...cartItem, itemCount: 1,
                    itemCartKey: itemCartKey
                }

            }

            return shoppingCartCopy;
        })

    }

    const removeOneItemCountFromCart = (cartItem: ShoppingCartItem) => {
        const itemCartKey = `SKU-${cartItem.itemID}-${cartItem.itemColour}-${cartItem.itemSize}`;

        //should be no need to check if item exists in cart becuase by definition the UI component is where i do this
        setShoppingCart((prevShoppingCart) => {
            if (prevShoppingCart[itemCartKey].itemCount === 1) {
                //if there is only 1 count of item, remove it from shopping cart altogether
                const { [itemCartKey]: _, ...updatedShoppingCart } = prevShoppingCart;
                return updatedShoppingCart;
            }
            else {
                //otherwise if the count is not 1 then remove only 1 count of it 
                const shoppingCartCopy = { ...prevShoppingCart };
                shoppingCartCopy[itemCartKey] = {
                    ...shoppingCartCopy[itemCartKey],
                    itemCount: prevShoppingCart[itemCartKey].itemCount - 1

                }
                return shoppingCartCopy;
            }
        })
    }

    const removeItemFromCart = (cartItem: ShoppingCartItem) => {
        const itemCartKey = `SKU-${cartItem.itemID}-${cartItem.itemColour}-${cartItem.itemSize}`;

        setShoppingCart((prevShoppingCart) => {
            //just removes the item from the cart altogether 
            const { [itemCartKey]: _, ...updatedShoppingCart } = prevShoppingCart;
            return updatedShoppingCart;
        })
    }

    const setCountAmount = (cartItem: ShoppingCartItem, count: number) => {
        const itemCartKey = `SKU-${cartItem.itemID}-${cartItem.itemColour}-${cartItem.itemSize}`;
        setShoppingCart((prevShoppingCart) => {
            const shoppingCartCopy = { ...prevShoppingCart };
            shoppingCartCopy[itemCartKey] = {
                ...shoppingCartCopy[itemCartKey],
                itemCount: count
            }
            return shoppingCartCopy;
        })
    }

    const clearShoppingCart = () => {
        //clear shopping cart on payment or something
        setShoppingCart({});
    }

    const getTotal = () => {
        let totalAmount = 0;
        Object.keys(shoppingCart).map((cartItem) => {
            totalAmount += shoppingCart[cartItem].itemPrice * shoppingCart[cartItem].itemCount
        })
        return totalAmount;
    }

    return <>
        <ShoppingCartContext.Provider value={{
            cartState: shoppingCart,
            setCartState: setShoppingCart,
            addItemToCart: addItemToCart,
            removeItemFromCart: removeItemFromCart,
            removeOneItemCountFromCart: removeOneItemCountFromCart,
            setCountAmount: setCountAmount,
            clearShoppingCart: clearShoppingCart,
            getTotal: getTotal
        }}>

            {children}
        </ShoppingCartContext.Provider>
    </>
}