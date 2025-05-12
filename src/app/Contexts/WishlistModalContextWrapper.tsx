"use client";

import { useContext, useEffect, useState } from "react"
import { WishlistContext } from "./WishlistModalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark, faSave } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { GlobalWishlistTrackerContext } from "./GlobalWishlistTrackerContext";
import { faCircle } from "@fortawesome/free-regular-svg-icons/faCircle";
import { FullScreenLoadingComponent } from "../components/LoadingComponent";
import Lottie from "lottie-react";
import checkmark from '@/assets/CheckMark.json';

interface WishlistModalProps {
    showModal: boolean,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    currentItemBrand: string;
    currentItemName: string;
    currentItemImage: string | null;
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
    const [showFullScreenLoading, setShowFullScreenLoading] = useState(false);

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
        setShowFullScreenLoading(true);
        const newSet = new Set(currentlySelectedWishlists);
        let sendNewListName = "";
        if (newListSelected === true) {
            newSet.add(newListName);
        };

        sendNewListName = newListName;

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
        setShowFullScreenLoading(false);
    }

    const handleCloseModal = () => {
        props.setShowModal(false);
        setShowCreateList(false)
    }


    const handleUpdateWishlists = async () => {
        setShowFullScreenLoading(true);
        const newSet = new Set(currentlySelectedWishlists);
        let sendNewListName = "";
        if (newListSelected === true) {
            newSet.add(newListName);
        };

        sendNewListName = newListName;
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
            //const reply = await response.json()
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
        setShowFullScreenLoading(false);
    }

    return <>
        <div className={`w-screen h-screen bg-black opacity-50
            left-0 top-0 ${props.showModal ? "fixed" : "hidden"}`}
            onClick={() => handleCloseModal()} style={{ zIndex: 40 }}>

        </div>

        <div className={`${props.showModal ? "fixed" : "hidden"} w-screen h-screen top-0 left-0 flex 
        items-center justify-center pointer-events-none`}
            style={{ zIndex: 40 }}>
            <div className="bg-white sm:w-[500px] w-4/5 min-w-[260px] p-5 rounded-xl flex flex-col pointer-events-auto relative gap-5">
                <div className="absolute right-0 top-0 -translate-y-[40px]
                text-[30px] cursor-pointer flex flex-row items-center gap-2">
                    <span className="text-[15px] text-white font-bold">
                        CLOSE
                    </span>
                    <FontAwesomeIcon icon={faCircleXmark}
                        onClick={() => handleCloseModal()}
                        style={{ filter: 'invert(1)' }} />
                </div>

                <div className="flex flex-row justify-between" >
                    <div className="flex xs:flex-row flex-col xs:text-start text-center 
                    gap-3 p-3 rounded-2xl items-center" style={{
                            boxShadow: `0 4px 6px rgba(0, 0, 0, 0.25),
                     0 1px 3px rgba(0, 0, 0, 0.25)` }}>
                        <div className="max-w-[60px] rounded-full overflow-hidden">
                            {props.currentItemImage ? (<Image src={props.currentItemImage} alt={props.currentItemImage}
                                width={500} height={500} />) : (null)}
                        </div>

                        <div>
                            <span className="font-bold">{props.currentItemName}</span> <br />
                            <span className="italic text-gray-600">{props.currentItemBrand}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-row font-bold text-[18px]">
                        Add item to a wishlist!
                    </div>
                    <div className="flex flex-col gap-3 max-h-[500px] overflow-auto p-1.5">
                        {
                            props.wishListArray.map((wishList) => (
                                <div key={wishList} className="flex flex-row justify-between items-center rounded-xl p-2" style={{
                                    boxShadow: `0 4px 6px rgba(0, 0, 0, 0.25),
                             2.5px -1px 3px rgba(0, 0, 0, 0.1)` }}>
                                    <span key={wishList} className="text-gray-700 truncate">
                                        {wishList}
                                    </span>

                                    <div className={'w-[40px] h-[40px] cursor-pointer grid place-items-center'}
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
                                        {currentlySelectedWishlists.has(wishList)
                                            ? (
                                                <Lottie animationData={checkmark} loop={false} className="w-[40px] h-[40px] scale-[1.25] " />

                                            )
                                            : (
                                                <FontAwesomeIcon icon={faCircle} className="text-[22.5px]" />
                                            )}
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                </div>

                <div className={`${showCreateList ? "flex" : "hidden"} flex-col gap-3 p-2`}>
                    <div className="flex flex-row gap-3 items-center">
                        <input
                            className="bg-gray-200 p-3 w-full"
                            value={newListName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewListName(e.target.value)}
                        />
                        <div className={'w-[35px] h-[35px] grid place-items-center'}
                            onClick={() => setNewListSelected(newListSelected => !newListSelected)}>
                            {newListSelected
                                ? (
                                    <FontAwesomeIcon icon={faCircleCheck} className="text-[25px]" />
                                )
                                : (
                                    <FontAwesomeIcon icon={faCircle} className="text-[25px]" />
                                )}
                        </div>
                    </div>

                    <div className="hover:underline text-red-600 font-bold 
                    text-md w-fit cursor-pointer "
                        onClick={() => setShowCreateList(false)}>
                        Cancel
                    </div>
                </div>


                <div className="flex 2xs:flex-row flex-col 2xs:gap-0 gap-3 items-center ">
                    <button className="p-3 bg-black text-white rounded-full font-bold text-sm 2xs:mr-3
                     w-fit disabled:bg-gray-200 transition-all duration-300
                        hover:ring-[2.5px] hover:ring-black hover:ring-offset-[3px] hover:bg-white hover:text-black"
                        onClick={() => { setShowCreateList(true); setNewListSelected(true) }}
                        disabled={showCreateList === true}
                    >CREATE NEW LIST</button>

                    {props.update
                        ?
                        (<div className="p-3 bg-black text-white rounded-full 
                            font-bold text-sm w-fit cursor-pointer flex flex-row gap-2 items-center
                            whitespace-nowrap transition-all duration-300
                        hover:ring-[2.5px] hover:ring-black hover:ring-offset-[3px] hover:bg-white hover:text-black"
                            onClick={handleUpdateWishlists}>UPDATE LIST
                            <FontAwesomeIcon icon={faSave} className="text-[20px]" />
                        </div>)
                        :
                        (<div className="p-3 bg-black text-white rounded-full 
                            font-bold text-sm w-fit cursor-pointer flex flex-row gap-2 items-center
                            whitespace-nowrap transition-all duration-300
                        hover:ring-[2.5px] hover:ring-black hover:ring-offset-[3px] hover:bg-white hover:text-black"
                            onClick={handleAddToWishlists}>ADD TO LIST
                            <FontAwesomeIcon icon={faSave} className="text-[20px] " />
                        </div>)}
                </div>
            </div>
        </div>
        <FullScreenLoadingComponent
            show={showFullScreenLoading}
            setShow={setShowFullScreenLoading}
            zIndex={50}
        />
    </>
}

export default function WishlistContextWrapper({ children }: { children: React.ReactNode }) {
    const [currentItemBrand, setCurrentItemBrand] = useState<string>("");
    const [currentItemName, setCurrentItemName] = useState<string>("");
    const [currentItemImage, setCurrentItemImage] = useState<string | null>(null);
    const [currentItemID, setCurrentItemID] = useState<string>("");
    const [selectedWishlist, setSelectedWishlist] = useState<Set<string>>(new Set());
    const [showModal, setShowModal] = useState<boolean>(false);
    const [wishListArray, setWishListArray] = useState<string[]>([])
    const [update, setUpdate] = useState<boolean>(false);

    useEffect(() => {
        const getWishlistFromDB = async () => {
            const response = await fetch(`/api/Wishlist?requestType=Modal`, {
                method: "GET",
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const reply = await response.json()
                console.log("GETTING WISHLISTED ARRAYS", reply)
                if (reply.length !== 0) {
                    setWishListArray(reply[0].array_agg);
                }
                else {
                    setWishListArray([]);
                }

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