"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateProductPage() {
    const params = useSearchParams();

    const [salePrice, setSalePrice] = useState(0);
    const [onSale, setOnSale] = useState(false)
    const [updatePrice, setUpdatePrice] = useState(0);
    const [removeSale, setRemoveSale] = useState(false);

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
        }
    }

    useEffect(() => {
        getProductPrices();

    }, [params])

    const handleUpdateProductSubmit = async () => {
        const response = await fetch(`/api/Producer?request=UpdateProduct`, {
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

        }
    }

    return <>
        <form onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleUpdateProductSubmit();
        }}
            className="flex flex-col gap-5"
        >
            <label >Update Price</label>
            <input
                placeholder="Update Price"
                type="number"
                value={updatePrice}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setUpdatePrice(Number(event.target.value)) }}
            />

            <label >Set Sale Price</label>
            <input
                disabled={removeSale === true}
                placeholder="Set Sale Price"
                type="number"
                value={salePrice}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setSalePrice(Number(event.target.value)) }}
            />

            <button className={`p-5 m-5 ${removeSale ? "bg-black text-white" : "bg-white text-black"}
         border-2 border-black`}
                onClick={() => { setRemoveSale(removeSale => !removeSale); setOnSale(false) }}>Remove Sale</button>


            <button disabled={removeSale === true}
                className={`p-5 m-5 ${onSale ? "bg-black text-white" : "bg-white text-black"}
                border-2 border-black`}
                onClick={() => setOnSale(onSale => !onSale)}>SET ON Sale</button>

            <button type="submit" >SUBMIT</button>

        </form>
    </>
}