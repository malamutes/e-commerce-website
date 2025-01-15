"use client";

import { HTMLInputTypeAttribute, useContext, useEffect, useState } from "react"
import { WishlistContext } from "./WishlistModalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { GlobalWishlistTrackerContext } from "./GlobalWishlistTrackerContext";

interface WishlistModalProps {
    showModal: boolean,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    currentItemBrand: string;
    currentItemName: string;
    currentItemImage: string;
    currentItemID: string,
    wishListArray: string[],
    setSelectedWishlist: React.Dispatch<React.SetStateAction<Set<string>>>,
    update: boolean
}

function WishlistModal(props: WishlistModalProps) {
    const [showCreateList, setShowCreateList] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [currentlySelectedWishlists, setCurrentlySelectedWishlists] = useState<Set<string>>(new Set());
    const [newListSelected, setNewListSelected] = useState(false);
    const { addToWishlistedItems, updateWishlistedItem, allWishlistedItems, removeFromWishlistedItems } = useContext(GlobalWishlistTrackerContext);

    //console.log(allWishlistedItems, props.currentItemID);
    useEffect(() => {
        setCurrentlySelectedWishlists(new Set(allWishlistedItems.get(props.currentItemID) ?? []));
        //the null fallback just ensures for adding items their key wont be tracked anyway so we can safely 
        //give empty array for it 
        setShowCreateList(false);
        setNewListName("");
        setNewListSelected(false);
    }, [props.showModal])

    const handleAddToWishlists = async () => {
        let newSet = new Set(currentlySelectedWishlists);
        let sendNewListName = "";
        if (newListSelected === true) {
            newSet.add(newListName);
            sendNewListName = newListName;
        };

        console.log("NEW SET", newSet);

        const response = await fetch('/api/Wishlist', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                itemID: props.currentItemID,
                wishlistSelected: Array.from(newSet),
                newWishlist: sendNewListName
            })
        })

        if (response.ok) {
            //alert("NEW ITEM ADDED TO WISHLIST");
            props.setShowModal(false)
            props.setSelectedWishlist(newSet)
            addToWishlistedItems(props.currentItemID, Array.from(newSet));
        }
        else {
            console.log(response.statusText);
        }
    }

    const handleCloseModal = () => {
        props.setShowModal(false);
        setShowCreateList(false)
    }


    const handleUpdateWishlists = async () => {
        let newSet = new Set(currentlySelectedWishlists);
        let sendNewListName = "";
        if (newListSelected === true) {
            newSet.add(newListName);
            sendNewListName = newListName;
        };

        const response = await fetch('/api/Wishlist', {

            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                itemID: props.currentItemID,
                wishlistSelected: Array.from(newSet),
                newWishlist: sendNewListName
            })
        })

        if (response.ok) {
            const reply = await response.json()
            //alert("NEW ITEM ADDED TO WISHLIST");
            props.setShowModal(false);
            //IM USING SELECTED WISHLIST TO TRIGGER REFETCH TO GET UPDATED ARRAYS FROM DB
            //SLOW ASF NEED TO OPTIMISE
            props.setSelectedWishlist(newSet);

            if (newSet.size !== 0) {
                updateWishlistedItem(props.currentItemID, Array.from(newSet));
            }
            else {
                removeFromWishlistedItems(props.currentItemID);
            }
        }
        else {
            console.log(response.statusText);
        }
    }

    return <>
        <div className={`w-screen h-screen bg-black opacity-50
            left-0 top-0 ${props.showModal ? "fixed" : "hidden"}`}
            onClick={() => handleCloseModal()} style={{ zIndex: 40 }}>

        </div>

        <div className={`${props.showModal ? "fixed" : "hidden"} w-screen h-screen top-0 left-0 flex 
        items-center justify-center pointer-events-none`}
            style={{ zIndex: 40 }}>
            <div className="bg-white flex flex-col pointer-events-auto">
                <div className="flex flex-row gap-5 justify-between">
                    <div className="flex flex-row gap-3">

                    </div>

                    <span>
                        {props.currentItemName} <br />
                        {props.currentItemBrand}
                    </span>
                    <FontAwesomeIcon icon={faX} size="2x"
                        onClick={() => handleCloseModal()} />
                </div>

                <div className="flex flex-col gap-3">
                    {
                        props.wishListArray.map((wishList) => (
                            <div key={wishList} className="flex flex-row justify-between">
                                <span key={wishList}>
                                    {wishList}
                                </span>

                                <div className={`w-[35px] h-[35px]
                                    ${currentlySelectedWishlists.has(wishList)
                                        ? "bg-purple-900"
                                        : " bg-red-900"}
                                    `}
                                    onClick={() => setCurrentlySelectedWishlists((currentlySelectedWishlists) => {
                                        const returnSet = new Set(currentlySelectedWishlists);
                                        if (currentlySelectedWishlists.has(wishList)) {
                                            returnSet.delete(wishList);
                                        }
                                        else {
                                            returnSet.add(wishList)

                                        }
                                        return returnSet;
                                    })}>
                                </div>
                            </div>
                        ))
                    }
                </div>

                <div className={`${showCreateList ? "block" : "hidden"}`}>
                    <input
                        className="bg-gray-200 p-3"
                        value={newListName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewListName(e.target.value)}
                    />
                    <div className={`w-[35px] h-[35px]
                                    ${newListSelected
                            ? "bg-purple-900"
                            : "bg-red-900"}
                                    `}
                        onClick={() => setNewListSelected(newListSelected => !newListSelected)}>
                    </div>
                </div>

                <button className="p-3 bg-black text-white m-3 w-fit disabled:bg-gray-200"
                    onClick={() => { setShowCreateList(true); setNewListSelected(true) }}
                    disabled={showCreateList === true}
                >CREATE NEW LIST</button>


                {props.update
                    ?
                    (<button className="p-3 bg-black text-white m-3 w-fit"
                        onClick={handleUpdateWishlists}>UPDATE LIST </button>)
                    :
                    (<button className="p-3 bg-black text-white m-3 w-fit"
                        onClick={handleAddToWishlists}>ADD TO LIST</button>)}
            </div>


        </div>
    </>
}

export default function WishlistContextWrapper({ children }: { children: React.ReactNode }) {
    const [currentItemBrand, setCurrentItemBrand] = useState<string>("");
    const [currentItemName, setCurrentItemName] = useState<string>("");
    const [currentItemImage, setCurrentItemImage] = useState<string>("");
    const [currentItemID, setCurrentItemID] = useState<string>("");
    const [selectedWishlist, setSelectedWishlist] = useState<Set<string>>(new Set());
    const [showModal, setShowModal] = useState<boolean>(false);
    const [wishListArray, setWishListArray] = useState<string[]>([])
    const [update, setUpdate] = useState<boolean>(false);

    useEffect(() => {
        const getWishlistFromDB = async () => {
            const response = await fetch('/api/Wishlist?requestType=Modal', {
                method: "GET",
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const reply = await response.json()
                console.log("GETTING WISHLISTED ARRAYS", reply)
                setWishListArray(reply[0].array_agg);
            }
            else {
                console.log(response.statusText)
            }
        }

        getWishlistFromDB();
        //IM USING SELECTED WISHLIST TO TRIGGER REFETCH TO GET UPDATED ARRAYS FROM DB
        //SLOW ASF NEED TO OPTIMISE
    }, [selectedWishlist])

    return <>
        <WishlistContext.Provider
            value={{
                currentItemBrand,
                currentItemName,
                currentItemImage,
                selectedWishlist,
                setCurrentItemBrand,
                setCurrentItemName,
                setCurrentItemImage,
                setSelectedWishlist,
                showModal,
                setShowModal,
                wishListArray,
                setWishListArray,
                currentItemID,
                setCurrentItemID,
                update,
                setUpdate
            }}
        >
            {children}
            <WishlistModal
                wishListArray={wishListArray}
                currentItemBrand={currentItemBrand}
                currentItemImage={currentItemImage}
                currentItemName={currentItemName}
                showModal={showModal}
                setShowModal={setShowModal}
                currentItemID={currentItemID}
                setSelectedWishlist={setSelectedWishlist}
                update={update}
            />
        </WishlistContext.Provider>
    </>
}