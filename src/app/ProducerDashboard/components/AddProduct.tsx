import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { clothingCategory, sexCategory } from '@/app/CollectionTypes';
import AddProductVariantComponent from './AddProductVariantComponent';
import { customAlphabet } from 'nanoid';


export interface productVariantInterface {
    [size: string]: {
        [colour: string]: number
    }
}

export default function AddProduct() {

    const router = useRouter();

    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productType, setProductType] = useState('');
    const [productAudience, setProductAudience] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productDetails, setProductDetails] = useState('');
    const [productVariant, setProductVariant] = useState<productVariantInterface>({});

    const fieldLabelClass = "m-2 font-bold mt-5";
    const inputFieldClass = "border-2 border-gray-500 p-3 rounded-xl"

    const [showVariantForm, setShowVariantForm] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const generateSerial = customAlphabet('0123456789', 6);

        const response = await fetch('/api/Collections/Products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productName: productName,
                productPrice: parseFloat(productPrice),
                productType: productType,
                productAudience: productAudience,
                productDescription: productDescription,
                productDetails: productDetails,
                productVariant: productVariant,
                productID: generateSerial()
            }),
        });

        if (response.ok) {
            alert("Product added successfully");
            router.push(`/ProducerDashboard?tab=Products`);
        }
        else {
            alert("Problem adding product.")
        }
    };

    useEffect(() => {
        console.log("ASHDUISAHIUHIUASIUDH", productVariant);
    }, [productVariant])

    return (
        <div >
            <span className="pl-4 text-xl font-bold pt-3 block">
                Add Product Form
            </span>
            <form onSubmit={handleSubmit}
                className='flex flex-col pl-5 pb-5 pr-5'
            >
                <label htmlFor="name" className={fieldLabelClass}>Product Name:</label>
                <input
                    className={inputFieldClass}
                    id="name"
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                />
                <label htmlFor="price" className={fieldLabelClass}>Product Price:</label>
                <input
                    className={inputFieldClass}
                    id="price"
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    required
                />
                <label htmlFor="description" className={fieldLabelClass}>Product Description:</label>
                <textarea
                    className={inputFieldClass}
                    id="description"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    required
                    rows={5}
                    cols={100}
                />

                <label htmlFor="details" className={fieldLabelClass}>Product Details:</label>
                <textarea
                    className={inputFieldClass}
                    id="details"
                    value={productDetails}
                    onChange={(e) => setProductDetails(e.target.value)}
                    required
                    rows={5}
                    cols={100}
                />

                <label htmlFor="productType" className={fieldLabelClass}>Select Product Type:</label>
                <select id="productType" name="productType" className="border-2 border-black p-3 rounded-xl"
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}>
                    <option value="" disabled>Select Product Type</option>
                    {clothingCategory.map((clothingType) => (
                        <option key={clothingType} value={clothingType}>{clothingType}</option>
                    ))}
                </select>

                <label htmlFor="productAudience" className={fieldLabelClass}>Select Product Audience:</label>
                <select id="productAudience" name="productAudience" className="border-2 border-black p-3 rounded-xl"
                    value={productAudience}
                    onChange={(e) => setProductAudience(e.target.value)}>
                    <option value="" disabled>Select Product Audience</option>
                    {sexCategory.map((clothingAudience) => (
                        <option key={clothingAudience} value={clothingAudience}>{clothingAudience}</option>
                    ))}
                </select>

                <span className='font-bold italic text-gray-600 mt-5'>
                    *ADDING IMAGES FEATURE TBA, NEED EXTERNAL CDN*
                </span>
                <div className='flex flex-col'>
                    <span className={fieldLabelClass}>
                        Variant Form
                    </span>
                    <span className={`w-fit rounded-xl font-bold p-3 text-md bg-black text-white cursor-pointer ${showVariantForm ? "hidden" : "block"}`}
                        onClick={() => setShowVariantForm(true)}
                    >SHOW FORM</span>
                    <AddProductVariantComponent
                        show={showVariantForm}
                        setShow={setShowVariantForm}
                        productVariant={productVariant}
                        setProductVariant={setProductVariant}
                    />

                    <div className='mt-5'>
                        <span className={fieldLabelClass}>
                            Current Variants
                        </span>
                        {Object.keys(productVariant).map((size) => (
                            <div key={size} className='pl-3 pt-1'>
                                <p className='font-bold'>{size}</p>
                                {Object.keys(productVariant[size]).map((variant, index) => (
                                    <div key={index}>
                                        <span className='italic'>{variant}, </span> <span className='text-gray-700'>QTY: {productVariant[size][variant]}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                </div>


                <button type="submit" className='bg-blue-500 mt-5 p-4 w-full text-white text-lg font-bold rounded-xl'>Add Product</button>
            </form>
        </div>
    );
}
