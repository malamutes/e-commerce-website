"use client";

const notificationCardMap: { [key: string]: string } = {
    'Order Confirmation': "You will be notified when an order is confirmed by a customer.",
    'Order Cancelled': "You will be notified when an order is cancelled by a customer.",
    'Order Delivered': "You will be notified when an order is marked as delivered.",
    'Email Notification': "You will receive updates and alerts via email.",
}

export default function Settings() {
    return <>
        <div className="bg-gray-200 flex flex-col pb-[25px] pt-[25px]">
            <div className="p-[25px]">
                <span className="text-xl font-bold pl-[25px]">
                    Settings
                </span>
            </div>

            <form>
                <div className="flex flex-row gap-4 w-5/6 mx-auto ">
                    <div className="flex flex-col w-1/2">
                        <div >
                            <span className="font-bold text-gray-700 text-">
                                Edit Profile
                            </span>


                            <div className="border-2 border-gray-300 p-5
                    rounded-lg mt-[25px] flex flex-col">

                                {['Your Name', 'Your Email', 'Phone No.'].map((field, index) => (
                                    <div key={index} className="mb-[25px]">
                                        <span>
                                            <label htmlFor={field} >{field}</label>
                                        </span>

                                        <div className="border-2 
                            border-gray-300 rounded-lg mt-[15px]">
                                            <input
                                                className='bg-transparent w-full h-full p-2.5 rounded-lg'
                                                id="name"
                                                type="text"
                                                required
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-[25px] flex-grow">
                            <span className="font-bold text-gray-700 ">
                                Edit Business Profile
                            </span>

                            <div className="border-2 border-gray-300 p-5
                            rounded-lg mt-[25px] flex flex-col flex-grow ">

                                {['Business Name',
                                    'Business Type',].map((field, index) => (
                                        <div key={index} className="mb-[25px]">
                                            <span>
                                                <label htmlFor={field} >{field}</label>
                                            </span>

                                            <div className="border-2 
                            border-gray-300 rounded-lg mt-[15px]">
                                                <input
                                                    className='bg-transparent w-full h-full p-2.5 rounded-lg'
                                                    id="name"
                                                    type="text"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    ))}


                                <div >
                                    <div className="mb-[25px]">
                                        <span>
                                            <label htmlFor="businessLocation" >Business Location</label>
                                        </span>

                                        <div className="border-2 
                                        border-gray-300 rounded-lg mt-[15px]">
                                            <select
                                                className='bg-transparent w-full h-full p-2.5 rounded-lg'
                                                id="name"
                                                required
                                            >
                                                <option >asd</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="flex flex-col w-1/2 ml-[15px] ">
                        <div >
                            <span className="font-bold text-gray-700 text-">
                                Change Password
                            </span>

                            <div className="border-2 border-gray-300 p-5
                            rounded-lg mt-[25px] flex flex-col">

                                {['Current Password', 'New Password', 'Confirm New Password'].map((field, index) => (
                                    <div className="mb-[25px]" key={index}>
                                        <span>
                                            <label htmlFor={field}>{field}</label>
                                        </span>

                                        <div className="border-2 
                                   border-gray-300 rounded-lg mt-[15px]">
                                            <input
                                                className='bg-transparent w-full h-full p-2.5 rounded-lg'
                                                id="name"
                                                type="password"
                                                required
                                            />
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>

                        <div className="mt-[25px] flex-grow flex flex-col ">
                            <span className="font-bold text-gray-700 ">
                                Notification Settings
                            </span>

                            <div className="border-2 border-gray-300 p-5
                            rounded-lg mt-[25px] flex flex-col">

                                {Object.keys(notificationCardMap).map((field, index) => (
                                    <div key={index} className="p-2.5 border-2 
                                            border-gray-300 rounded-lg m-2 flex flex-row justify-between items-center">
                                        <div className="flex flex-col">
                                            <p className="font-bold text-sm">
                                                {field}
                                            </p>

                                            <span className="text-xs">
                                                {notificationCardMap[field]}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                />
                                                <div
                                                    className="w-11 h-6 bg-gray-300 rounded-full peer 
                                                    peer-checked:bg-blue-600 
                                                    peer-focus:ring-2 peer-focus:ring-blue-300 transition-colors">
                                                </div>
                                                <div
                                                    className="absolute w-5 h-5 bg-white rounded-full transform 
                                                    peer-checked:translate-x-5 left-0 top-0.5 transition-transform">
                                                </div>
                                            </label>
                                        </div>

                                    </div>
                                ))}

                            </div>


                        </div>

                        <div className="flex justify-end mt-[25px]">
                            <button className="pt-3 pb-3 pl-10 pr-10 bg-blue-700 rounded-full w-fit text-white">SAVE</button>
                        </div>

                    </div>
                </div >

            </form>

        </div>
    </>
}