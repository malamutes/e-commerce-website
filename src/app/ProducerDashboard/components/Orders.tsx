"use client";


export default function Orders() {
    return <>

        <div className="flex flex-row w-5/6 mx-auto">
            {['Completed', 'Shipped', 'Pending', 'Refunded', 'Cancelled'].map((status, index) => (
                < div key={index}
                    className="bg-gray-400 p-5 hover:bg-gray-200 cursor-pointer" >
                    <span>
                        {status}
                    </span>
                </div>

            ))}
        </div >
    </>
}