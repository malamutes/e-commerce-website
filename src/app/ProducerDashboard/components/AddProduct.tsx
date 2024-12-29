import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { clothingCategory, clothingColours, clothingSizes, sexCategory } from '@/app/CollectionTypes';

export default function AddProduct() {

    const router = useRouter();

    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productType, setProductType] = useState('');
    const [productAudience, setProductAudience] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productColor, setProductColor] = useState<string[]>([]);
    const [productSize, setProductSize] = useState<string[]>([]);
    const [productDetails, setProductDetails] = useState('');

    const fieldLabelClass = "m-2";

    const [colorDropdownOpen, setColorDropdownOpen] = useState(false);

    const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
                productColor: productColor,
                productDetails: productDetails,
                productSize: productSize
            }),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Product added successfully");
            router.push(`/ProducerDashboard?tab=Products`);
        }
        else {
            alert("Problem adding product.")
        }
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const justSelectedColor = e.target.value;
        setProductColor((productColor) => {
            // If the color is already selected, remove it
            if (productColor.includes(justSelectedColor)) {
                return productColor.filter(color => color !== justSelectedColor);  // Filter out the color
            }
            // If it's not selected, add it
            return [...productColor, justSelectedColor];  // Add the new color to the array
        });
    };


    const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const justSelectedSize = e.target.value;
        setProductSize((productSize) => {
            // If the Size is already selected, remove it
            if (productSize.includes(justSelectedSize)) {
                return productSize.filter(Size => Size !== justSelectedSize);  // Filter out the Size
            }
            // If it's not selected, add it
            return [...productSize, justSelectedSize];  // Add the new color to the array
        });
    };


    return (
        <div >
            <form onSubmit={handleSubmit}
                className='flex flex-col p-5'
            >
                <label htmlFor="name" className={fieldLabelClass}>Product Name:</label>
                <input
                    className='border-2 border-black'
                    id="name"
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                />
                <label htmlFor="price" className={fieldLabelClass}>Product Price:</label>
                <input
                    className='border-2 border-black'
                    id="price"
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    required
                />
                <label htmlFor="description" className={fieldLabelClass}>Product Description:</label>
                <textarea
                    className='border-2 border-black'
                    id="description"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    required
                    rows={5}
                    cols={100}
                />

                <label htmlFor="details" className={fieldLabelClass}>Product Details:</label>
                <textarea
                    className='border-2 border-black'
                    id="details"
                    value={productDetails}
                    onChange={(e) => setProductDetails(e.target.value)}
                    required
                    rows={5}
                    cols={100}
                />

                <label htmlFor="productType" className={fieldLabelClass}>Select Product Type:</label>
                <select id="productType" name="productType" className="border-2 border-black"
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}>
                    <option value="" disabled>Select Product Type</option>
                    {clothingCategory.map((clothingType) => (
                        <option key={clothingType} value={clothingType}>{clothingType}</option>
                    ))}
                </select>

                <label htmlFor="productAudience" className={fieldLabelClass}>Select Product Audience:</label>
                <select id="productAudience" name="productAudience" className="border-2 border-black"
                    value={productAudience}
                    onChange={(e) => setProductAudience(e.target.value)}>
                    <option value="" disabled>Select Product Audience</option>
                    {sexCategory.map((clothingAudience) => (
                        <option key={clothingAudience} value={clothingAudience}>{clothingAudience}</option>
                    ))}
                </select>

                <label htmlFor="productColor" className={fieldLabelClass}>Select Product Colour(s):</label>
                <div>
                    <div className='border-2 border-black p-1' onClick={() =>
                        setColorDropdownOpen(colorDropdownOpen => !colorDropdownOpen)}>
                        Select color(s):
                    </div>
                    <div className={`${colorDropdownOpen ? "block" : "hidden"} bg-gray-200 p-2 `}>
                        {clothingColours.map((color) => (
                            <div key={color} className='flex flex-row'>
                                <input
                                    type="checkbox"
                                    id={color}
                                    value={color}
                                    checked={productColor.includes(color)}
                                    onChange={handleColorChange}
                                    className="mr-2"
                                />
                                <label htmlFor={color}>{color}</label>
                            </div>
                        ))}
                    </div>

                    <label htmlFor="productSize" className={fieldLabelClass}>Select Product Size(s):</label>
                    <div className='border-2 border-black p-1' onClick={() =>
                        setSizeDropdownOpen(sizeDropdownOpen => !sizeDropdownOpen)}>
                        Select size(s):
                    </div>

                    <div className={`${sizeDropdownOpen ? "block" : "hidden"} bg-gray-200 p-2 `}>
                        {clothingSizes.map((size) => (
                            <div key={size} className='flex flex-row'>
                                <input
                                    type="checkbox"
                                    id={size}
                                    value={size}
                                    checked={productSize.includes(size)}
                                    onChange={handleSizeChange}
                                    className="mr-2"
                                />
                                <label htmlFor={size}>{size}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className='bg-blue-500 mt-5 p-2 w-fit'>Add Product</button>
            </form>
        </div>
    );
}
