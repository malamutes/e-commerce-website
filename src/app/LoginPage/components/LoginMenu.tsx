'use client';

import Form from 'next/form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons/faXTwitter';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useState } from 'react';

export default function LoginMenu() {
    const [newUserMenu, setNewUserMenu] = useState(false);

    return <>
        <div className="h-screen flex flex-col justify-center items-center">
            <div className='flex flex-row w-8/12'>
                <div className={`w-1/2  ${newUserMenu ? "bg-black" : "bg-gray-400 "} 
                    text-${newUserMenu ? "white" : "black"} p-5 cursor-pointer`}
                    onClick={() => setNewUserMenu(true)}>
                    <h1 className="text-2xl font-semibold text-center">
                        FIRST TIME?
                    </h1>
                </div>

                <div className={`w-1/2  ${newUserMenu ? "bg-gray-400" : "bg-black"} 
                    text-${newUserMenu ? "black" : "white"}  p-5 cursor-pointer`}
                    onClick={() => setNewUserMenu(false)}>
                    <h1 className={`text-2xl font-semibold text-center`}>
                        SIGN IN HERE!
                    </h1>
                </div>

            </div>

            <div className="w-8/12 h-fit bg-gray-200 pl-[90px] pr-[90px] pt-[45px] pb-[50px]">
                <div className={`${newUserMenu ? "hidden" : "block"}`}>
                    <h1 className="text-2xl font-semibold ">
                        SIGN IN
                    </h1>

                    <div className='flex flex-row justify-between'>
                        <div className='flex flex-col w-fit'>
                            <h1 className="text-2xl font-bold mt-5 ml-auto mr-auto">
                                ... with Email
                            </h1>
                            <Form action="text" >
                                <label htmlFor="email" className="block text-lg font-medium mb-2 mt-5">Email</label>
                                <input name="Email" type='email'
                                    className='border-solid border-[1.5px] 
                        border-gray-300 p-2.5 w-[450px] mb-5'
                                    placeholder='Email' />


                                <label htmlFor="password" className="block text-lg font-medium mb-2">Password</label>
                                <input name="Password" type='password'
                                    className='border-solid border-[1.5px]
                         border-gray-300 p-2.5 w-[450px]'
                                    placeholder='Password' />

                            </Form>

                            <button className='bg-black text-white pt-2 pb-2 pl-5 pr-5 rounded-full mt-7 w-fit ml-auto mr-auto'>SIGN IN</button>
                        </div>

                        <div className="h-50 border-l-2 border-black mt-10"></div>

                        <div className='flex flex-col w-fit '>
                            <h1 className="text-2xl font-bold mt-5 ml-auto mr-auto">
                                ... with Socials
                            </h1>

                            <div className=' p-2.5 w-[450px] text-white bg-blue-900 
                        flex justify-between items-center cursor-pointer 
                        hover:bg hover:brightness-150 transition-all duration-300
                        mb-5 mt-10' >
                                Sign in with Facebook
                                <FontAwesomeIcon icon={faFacebookF} />
                            </div>

                            <div className=' p-2.5 w-[450px] text-white bg-red-900
                        flex justify-between items-center cursor-pointer 
                        hover:bg hover:brightness-150 transition-all duration-300
                        mb-5' >
                                Sign in with Google
                                <div>
                                    <FontAwesomeIcon icon={faGoogle} />
                                </div>

                            </div>

                            <div className=' p-2.5 w-[450px] text-white bg-cyan-600
                        flex justify-between items-center cursor-pointer 
                        hover:bg hover:brightness-150 transition-all duration-300
                        mb-5' >
                                Sign in with Twitter
                                <FontAwesomeIcon icon={faXTwitter} />
                            </div>


                        </div>
                    </div>
                </div>

                <div className={`${newUserMenu ? "block" : "hidden"}`}>
                    <h1 className="text-2xl font-semibold ">
                        SIGN UP
                    </h1>

                    <div className='flex flex-row justify-between'>
                        <div className='flex flex-col w-fit '>
                            <h1 className="text-2xl font-bold mt-5 ml-auto mr-auto">
                                ... with Email
                            </h1>
                            <Form action="text" className='flex flex-row justify-between'>
                                <div className='flex flex-col'>
                                    <label htmlFor="firstName"
                                        className="block text-lg font-medium mt-5">
                                        First Name</label>
                                    <input name="First Name" type='text' id='firstName'
                                        className='border-solid border-[1.5px] 
                        border-gray-300 p-2.5 w-[200px] '
                                        placeholder='First Name' />
                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor="firstName"
                                        className="block text-lg font-medium mt-5">
                                        First Name</label>
                                    <input name="First Name" type='text' id='firstName'
                                        className='border-solid border-[1.5px] 
                        border-gray-300 p-2.5 w-[200px] '
                                        placeholder='Last Name' />
                                </div>



                            </Form>
                            <Form action="text" >
                                <label htmlFor="email" className="block text-lg font-medium mb-2 mt-5">Email</label>
                                <input name="Email" type='email'
                                    className='border-solid border-[1.5px] 
                        border-gray-300 p-2.5 w-[450px] mb-5'
                                    placeholder='Email' />


                                <label htmlFor="password" className="block text-lg font-medium mb-2">Password</label>
                                <input name="Password" type='password'
                                    className='border-solid border-[1.5px]
                         border-gray-300 p-2.5 w-[450px]'
                                    placeholder='Password' />

                            </Form>

                            <button className='bg-black text-white pt-2 pb-2 pl-5 pr-5 rounded-full mt-7 w-fit  ml-auto mr-auto'>REGISTER</button>
                        </div>

                        <div className="h-50 border-l-2 border-black mt-10"></div>

                        <div className='flex flex-col w-fit '>
                            <h1 className="text-2xl font-bold mt-5 ml-auto mr-auto">
                                ... with Socials
                            </h1>

                            <div className=' p-2.5 w-[450px] text-white bg-blue-900 
                        flex justify-between items-center cursor-pointer 
                        hover:bg hover:brightness-150 transition-all duration-300
                        mb-2.5 mt-10' >
                                Sign up with Facebook
                                <FontAwesomeIcon icon={faFacebookF} />
                            </div>

                            <div className=' p-2.5 w-[450px] text-white bg-red-900
                        flex justify-between items-center cursor-pointer 
                        hover:bg hover:brightness-150 transition-all duration-300
                        mb-2.5 mt-10' >
                                Sign up with Google
                                <div>
                                    <FontAwesomeIcon icon={faGoogle} />
                                </div>

                            </div>

                            <div className=' p-2.5 w-[450px] text-white bg-cyan-600
                        flex justify-between items-center cursor-pointer 
                        hover:bg hover:brightness-150 transition-all duration-300
                        mb-2.5 mt-10' >
                                Sign up with Twitter
                                <FontAwesomeIcon icon={faXTwitter} />
                            </div>


                        </div>
                    </div>
                </div>


            </div>
        </div>
    </>
}