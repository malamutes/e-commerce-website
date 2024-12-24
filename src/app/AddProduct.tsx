import React, { useState } from 'react';

export default function AddProduct() {
    // State to store name and price
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Send this data to your backend

        const response = await fetch('/api/addProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productName: productName,
                productPrice: parseFloat(productPrice),
            }),
        });

        const data = await response.json();
        console.log(data);
        // Reset form after submission (optional)
        setProductName('');
        setProductPrice('');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Product Name:</label>
                    <input
                        id="name"
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="price">Product Price:</label>
                    <input
                        id="price"
                        type="number"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className='bg-blue-500'>Add Product</button>
            </form>
        </div>
    );
}
