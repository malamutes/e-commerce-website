"use client";

//NEED TO DO BACKEND FOR THIS COMPONENT TOO
const notificationCardMap: { [key: string]: string } = {
    'Order Confirmation': "You will be notified when an order is confirmed by a customer.",
    'Order Cancelled': "You will be notified when an order is cancelled by a customer.",
    'Order Delivered': "You will be notified when an order is marked as delivered.",
    'Email Notification': "You will receive updates and alerts via email.",
}

const innerBorderClass = `border-2 border-gray-300 rounded-lg 2xs:mt-[15px] mt-[5px]`;

interface SettingsSubGridProps {
    subGridTitle: string,
    subGridInputFields: string[],
    subGridChildren?: React.ReactNode,
    subGridInputFieldType?: string
}


function SettingsSubGrid(props: SettingsSubGridProps) {
    return <>
        <div className="mt-[50px]">
            <span className="font-bold text-gray-700">
                {props.subGridTitle}
            </span>


            <div className={`border-2 border-gray-300 2xs:p-5 p-2.5
                        rounded-lg mt-[25px] flex flex-col 
                        min-h-[375px] justify-center`}>
                {props.subGridInputFields.map((field, index) => (
                    <div key={index} className="mb-[25px]">
                        <span>
                            <label htmlFor={field} >{field}</label>
                        </span>

                        <div className={innerBorderClass}>
                            <input
                                className='bg-transparent w-full h-full p-2.5 rounded-lg'
                                id="name"
                                type={props.subGridInputFieldType ?? "text"}
                                required
                            />
                        </div>
                    </div>
                ))}
                {props.subGridChildren && props.subGridChildren}
            </div>
        </div>
    </>
}

export default function Settings() {
    return <>
        <div className="bg-gray-200 flex flex-col pb-[25px] pt-[25px]">
            <div className="sm:p-[25px] p-[15px] mb-[-25px]">
                <span className="text-xl font-bold sm:pl-[25px]">
                    Settings
                </span>
            </div>

            <form>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-10 w-5/6 mx-auto">
                    <SettingsSubGrid subGridTitle="Edit Profile" subGridInputFields={['Your Name', 'Your Email', 'Phone No.']} />

                    <SettingsSubGrid subGridTitle="Edit Business Profile"
                        subGridInputFields={['Business Name', 'Business Type']} subGridChildren={
                            <div className="mb-[25px]">
                                <span>
                                    <label htmlFor="businessLocation" >Business Location</label>
                                </span>

                                <div className={innerBorderClass}>
                                    <select
                                        className='bg-transparent w-full h-full p-2.5 rounded-lg'
                                        id="name"
                                        required
                                    >
                                        <option >asd</option>
                                    </select>
                                </div>
                            </div>} />

                    <SettingsSubGrid subGridTitle="Change Password"
                        subGridInputFields={['Current Password', 'New Password', 'Confirm New Password']}
                        subGridInputFieldType="password" />

                    <div className="mt-[50px]">
                        <span className="font-bold text-gray-700 ">
                            Notification Settings
                        </span>

                        <div className="border-2 border-gray-300 2xs:p-5
                        rounded-lg mt-[25px] flex flex-col 
                        min-h-[375px] justify-center">
                            {Object.keys(notificationCardMap).map((field, index) => (
                                <div key={index} className="p-2.5 border-2 
                                            border-gray-300 rounded-lg m-2 flex md:flex-row flex-col justify-between 
                                            items-center md:text-start text-center">
                                    <div className="flex flex-col">
                                        <p className="font-bold text-sm">
                                            {field}
                                        </p>

                                        <span className="text-xs">
                                            {notificationCardMap[field]}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-4 md:mt-[0px] mt-[5px]">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer" />
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
                </div >

                <div className="flex justify-end mt-[25px]">
                    <button className="pt-3 pb-3 pl-10 pr-10 bg-blue-700 rounded-full w-fit text-white">SAVE</button>
                </div>
            </form>

        </div>
    </>
}