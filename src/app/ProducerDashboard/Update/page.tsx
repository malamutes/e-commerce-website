"use client";

import { clothingCategory, sexCategory } from "@/app/CollectionTypes";
import LoadingComponent from "@/app/components/LoadingComponent";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateProductPage() {
    const params = useSearchParams();

    const [salePrice, setSalePrice] = useState(0);
    const [onSale, setOnSale] = useState(false)
    const [updatePrice, setUpdatePrice] = useState(0);
    const [removeSale, setRemoveSale] = useState(false);
    const [productType, setProductType] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productDetails, setProductDetails] = useState("");
    const [productAudience, setProductAudience] = useState("");
    const [productName, setProductName] = useState("");
    const [loadingUI, setLoadingUI] = useState(true);

    console.log(params?.get('productID'));

    const getProductPrices = async () => {
        const response = await fetch(`/api/Producer?productID=${params?.get('productID')}`, {
            method: "GET",
            headers: {
                'accept': 'application/json'
            },
        })

        if (response.ok) {
            const reply = await response.json();
            console.log(reply);
            setSalePrice(reply[0].product_sale_price);
            setUpdatePrice(reply[0].product_price);
            setProductType(reply[0].product_type);
            setProductDescription(reply[0].product_description);
            setProductDetails(reply[0].product_details);
            setProductAudience(reply[0].product_audience);
            setProductName(reply[0].product_name)
            setLoadingUI(false);
        }
    }

    useEffect(() => {
        getProductPrices();

    }, [params])

    const handleUpdateProductPricesSubmit = async () => {
        setLoadingUI(true);
        const response = await fetch(`/api/Producer?request=UpdateProductPrices`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productID: params?.get('productID'),
                salePrice: salePrice,
                updatePrice: updatePrice,
                onSale: onSale,
                removeSale: removeSale
            })
        })

        if (response.ok) {

        }
        else {
            alert("COULDN'T UPDATE PRICES");
            console.log(response.statusText, response.status);
        }
        setLoadingUI(false);
    }

    const handleUpdateProductDetailsSubmit = async () => {
        setLoadingUI(true);
        const response = await fetch(`/api/Producer?request=UpdateProductDetails`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productID: params?.get('productID'),
                productAudience: productAudience,
                productType: productType,
                productDescription: productDescription,
                productDetails: productDetails,
                productName: productName
            })
        })

        if (response.ok) {

        }
        else {
            alert("COULDN'T UPDATE DETAILS");
            console.log(response.statusText, response.status);
        }
        setLoadingUI(false);
    }

    return <>
        <div className="bg-gray-200 max-h-[600px] overflow-auto">
            {loadingUI
                ?
                (
                    <LoadingComponent
                        width="100"
                        height="100"
                        minHeight="min-h-[1000px]"
                    />
                )
                :
                (
                    <div className="flex flex-col">
                        <form onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            handleUpdateProductPricesSubmit();
                        }}
                            className="flex flex-col gap-5 p-5"
                        >
                            <label className="font-bold text-2xl">Update Price</label>
                            <div className="flex 3xs:flex-row flex-col gap-5 3xs:items-center">
                                <label className="font-bold">Update Regular Price :</label>
                                <input
                                    placeholder="Update Price"
                                    type="number"
                                    value={updatePrice}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setUpdatePrice(Number(event.target.value)) }}
                                    className="p-3 rounded-xl border-2 border-gray-500"
                                />
                            </div>

                            <div className="flex 3xs:flex-row flex-col gap-5 3xs:items-center">
                                <label className="font-bold">Set Sale Price :</label>
                                <input
                                    disabled={removeSale === true}
                                    placeholder="Set Sale Price"
                                    type="number"
                                    value={salePrice}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setSalePrice(Number(event.target.value)) }}
                                    className="p-3 rounded-xl border-2 border-gray-500 disabled:text-gray-400"
                                />
                            </div>


                            <div className="flex flex-row gap-5">
                                <button type="button" className={`p-3 rounded-full ${removeSale ? "bg-black text-white" : "bg-white text-black"}
                border-2 border-black`}
                                    onClick={() => { setRemoveSale(removeSale => !removeSale); setOnSale(false) }}>Remove Sale</button>


                                <button type="button" disabled={removeSale === true}
                                    className={`p-3 rounded-full disabled:text-gray-200 disabled:border-gray-400 ${onSale ? "bg-black text-white" : "bg-white text-black"}
                border-2 border-black`}
                                    onClick={() => { setOnSale(true) }}>SET ON Sale</button>
                            </div>


                            <button type="submit" className="bg-black text-white w-fit p-5 rounded-full" >UPDATE PRICES</button>

                        </form>

                        <form
                            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                                event.preventDefault();
                                handleUpdateProductDetailsSubmit();
                            }}
                            className="flex flex-col gap-5 p-5"
                        >
                            <label className="font-bold text-2xl">Update Product Details</label>

                            <div className="flex 3xs:flex-row flex-col gap-5 items-center">

                                <div className="flex flex-col w-full gap-3">
                                    <label className="font-bold">Product Type:</label>
                                    <select
                                        value={productType}
                                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                                            setProductType(event.target.value)
                                        }
                                        className="p-3 rounded-xl border-2 border-gray-500 w-full"
                                    >
                                        {clothingCategory.map((category) => (
                                            <option value={category} key={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>


                                <div className="flex flex-col w-full gap-3">
                                    <label className="font-bold">Product Audience:</label>
                                    <select
                                        value={productAudience}
                                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                                            setProductAudience(event.target.value)
                                        }
                                        className="p-3 rounded-xl border-2 border-gray-500 w-full"
                                    >
                                        {sexCategory.map((category) => (
                                            <option value={category} key={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-bold">Product Name:</label>
                                <input
                                    placeholder="Enter product name"
                                    value={productName}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                        setProductName(event.target.value)
                                    }
                                    className="p-3 rounded-xl border-2 border-gray-500 w-full "
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-bold">Product Description:</label>
                                <textarea
                                    placeholder="Enter product description"
                                    value={productDescription}
                                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        setProductDescription(event.target.value)
                                    }
                                    className="p-3 rounded-xl border-2 border-gray-500 w-full h-32 resize-none"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-bold">Product Details:</label>
                                <textarea
                                    placeholder="Enter product details"
                                    value={productDetails}
                                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        setProductDetails(event.target.value)
                                    }
                                    className="p-3 rounded-xl border-2 border-gray-500 w-full h-32 resize-none"
                                />
                            </div>

                            <button type="submit" className="bg-black text-white w-fit p-5 rounded-full">
                                UPDATE DETAILS
                            </button>
                        </form>
                    </div>
                )}

        </div>


    </>
}