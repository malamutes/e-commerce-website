'use client';

import Form from 'next/form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons/faXTwitter';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { GlobalLoginTypeContext } from '@/app/(Contexts)/GlobalLoginPromptContext';
import LoginError, { PasswordValidator } from './LoginSignupError';

export default function LoginMenu() {
    const { logIn, setLogIn } = useContext(GlobalLoginTypeContext)

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [fName, setFName] = useState("");
    const [lName, setLName] = useState("");

    const [showErrorSignIn, setShowErrorSignIn] = useState(false);

    const router = useRouter();

    const [lengthValid, setLengthValid] = useState(false);
    const [lowercaseValid, setLowercaseValid] = useState(false);
    const [uppercaseValid, setUppercaseValid] = useState(false);
    const [numberValid, setNumberValid] = useState(false);
    const [specialCharValid, setSpecialCharValid] = useState(false);

    //regex stuff done using chat
    const finalPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,24}$/;
    const lengthRegex = /^.{8,24}$/;
    const lowercaseRegex = /(?=.*[a-z])/;
    const uppercaseRegex = /(?=.*[A-Z])/;
    const numberRegex = /(?=.*\d)/;
    const specialCharRegex = /(?=.*[!@#$%^&*(),.?":{}|<>])/;


    const handlePasswordChange = (password: string) => {
        setPassword(password);

        // Instant feedback regex checks
        setLengthValid(lengthRegex.test(password));
        setLowercaseValid(lowercaseRegex.test(password));
        setUppercaseValid(uppercaseRegex.test(password));
        setNumberValid(numberRegex.test(password));
        setSpecialCharValid(specialCharRegex.test(password));
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const loginResult = await signIn('credentials', {
            redirect: false,
            userEmail: email,
            userPassword: password,
        });

        if (loginResult?.ok) {
            router.push('/');
        }
        else {
            setEmail("");
            setPassword("");
            setShowErrorSignIn(true);
        }
    }

    const handleSignUpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (finalPasswordRegex.test(password)) {
                const response = await fetch('/api/userSignUp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName: fName,
                        lastName: lName,
                        email: email,
                        password: password
                    })
                })

                const reply = await response.json();

                if (response.ok) {
                    const loginResult = await signIn('credentials', {
                        redirect: false,
                        userEmail: email,
                        userPassword: password,
                    });

                    if (loginResult?.ok) {
                        console.log("Sign in successful!");
                        router.push('/SignUpPage');
                    }
                    else {
                        console.log("Status Code", loginResult?.status);
                        console.log("Error:", loginResult?.error);
                        alert("Could not sign in!")
                    }

                }

                else {
                    console.log("Cant sign up.");
                    console.log("reply:", reply);
                    //router.push('/ErrorPage');
                }

                setFName("");
                setLName("");
                setEmail("");
                setPassword("");
            }
        }
        catch (error) {
            console.error(error, "Issues with creating account");
        }
    }

    return <>
        <div className='bg-gray-100'>
            <div className="flex flex-col justify-center items-center
                lg:container mx-auto sm:pr-[50px] sm:pl-[50px] lg:pr-0 lg:pl-0 
                pr-[15px] pl-[25px] min-w-[270px]">
                <div className='flex flex-row lg:w-5/6 w-full'>
                    <div className={`w-1/2  ${logIn ? "bg-gray-400" : "bg-black "} 
            text-${logIn ? "black" : "white"} p-5 cursor-pointer`}
                        onClick={() => setLogIn(false)}>
                        <h1 className="text-lg font-semibold text-center">
                            FIRST TIME?
                        </h1>
                    </div>

                    <div className={`w-1/2  ${logIn ? "bg-black" : "bg-gray-400"} 
            text-${logIn ? "white" : "black"}  p-5 cursor-pointer`}
                        onClick={() => setLogIn(true)}>
                        <h1 className={`text-lg font-semibold text-center`}>
                            SIGN IN HERE!
                        </h1>
                    </div>

                </div>

                <div className="lg:w-5/6 w-full h-fit bg-gray-200 p-[3.75%] ">
                    <div className={`${logIn ? "block" : "hidden"}`}>
                        <h1 className="text-lg font-semibold ">
                            SIGN IN
                        </h1>

                        <div className='flex lg:flex-row flex-col justify-between 
                        lg:items-start items-center
                        '>
                            <div className='flex flex-col lg:w-1/2 w-full items-center'>
                                <h1 className="text-2xl font-bold mt-1 ml-auto mr-auto">
                                    ... with Email
                                </h1>

                                <Form action="text" className='w-10/12'
                                    onSubmit={handleLoginSubmit}>

                                    <LoginError
                                        show={showErrorSignIn}
                                        setShow={setShowErrorSignIn}
                                    />

                                    <label htmlFor="email" className="block text-lg font-medium mb-2 mt-5">Email</label>
                                    <input name="Email" type='email'
                                        className='border-solid border-[1.5px] 
                                        border-gray-300 p-2.5 w-full mb-5'
                                        placeholder='Email'
                                        value={email}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                                        required={true}
                                    />


                                    <label htmlFor="password" className="block text-lg font-medium mb-2">Password</label>
                                    <input name="Password" type='password'
                                        className='border-solid border-[1.5px]
                                        border-gray-300 p-2.5 w-full'
                                        placeholder='Password'
                                        value={password}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                                        required={true}
                                    />

                                    <button className='bg-black text-white pt-2 pb-2 pl-5 pr-5 rounded-full 
                                mt-7 w-fit block mx-auto'
                                        type='submit'
                                    >SIGN IN</button>
                                </Form>


                            </div>

                            <div className="h-[250px] border-l-2 border-black mt-10 w-[5px] lg:block hidden"></div>

                            <div className='flex flex-row items-center mt-[25px] w-full justify-center lg:hidden '>
                                <div className="border-b-2 border-black w-2/5"></div>
                                <span className='mx-5 font-light text-xl italic'>
                                    OR
                                </span>
                                <div className="border-b-2 border-black w-2/5"></div>
                            </div>

                            <div className='flex flex-col lg:w-1/2 w-full items-center'>
                                <h1 className="text-2xl font-bold mt-1 ml-auto mr-auto">
                                    ... with Socials
                                </h1>

                                <div className=' p-2.5 w-5/6 text-white bg-blue-900 
                                    flex justify-between items-center cursor-pointer 
                                    hover:bg hover:brightness-150 transition-all duration-300
                                    mb-5 mt-10 gap-3' >
                                    Sign in with Facebook
                                    <FontAwesomeIcon icon={faFacebookF} />
                                </div>

                                <div className=' p-2.5 w-5/6 text-white bg-red-900
                                    flex justify-between items-center cursor-pointer 
                                    hover:bg hover:brightness-150 transition-all duration-300
                                    mb-5 gap-3' >
                                    Sign in with Google
                                    <div>
                                        <FontAwesomeIcon icon={faGoogle} />
                                    </div>

                                </div>

                                <div className=' p-2.5 w-5/6 text-white bg-cyan-600
                                    flex justify-between items-center cursor-pointer 
                                    hover:bg hover:brightness-150 transition-all duration-300
                                    mb-5 gap-3' >
                                    Sign in with Twitter
                                    <FontAwesomeIcon icon={faXTwitter} />
                                </div>


                            </div>
                        </div>
                    </div>

                    <div className={`${logIn ? "hidden" : "block"}`}>
                        <h1 className="text-lg font-semibold ">
                            SIGN UP
                        </h1>

                        <div className='flex lg:flex-row flex-col lg:items-start items-center justify-between '>
                            <div className='flex flex-col lg:w-1/2 w-full items-center'>
                                <h1 className="text-2xl font-bold mt-1 ml-auto mr-auto">
                                    ... with Email
                                </h1>
                                <Form action="text" className='flex lg:flex-col flex-col justify-between w-10/12'
                                    onSubmit={handleSignUpSubmit}>
                                    <div className='flex lg:flex-row flex-col'>
                                        <div className='flex flex-col w-auto'>
                                            <label htmlFor="firstName"
                                                className="block text-lg font-medium mt-5">
                                                First Name</label>
                                            <input name="First Name" type='text' id='firstName'
                                                className='border-solid border-[1.5px] 
                                            border-gray-300 p-2.5 w-full '
                                                placeholder='First Name'
                                                required={true}
                                                value={fName}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFName(event.target.value)}
                                            />
                                        </div>

                                        <div className='w-1/12 lg:block hidden'>

                                        </div>

                                        <div className='flex flex-col w-auto'>
                                            <label htmlFor="lastName"
                                                className="block text-lg font-medium mt-5">
                                                Last Name</label>
                                            <input name="last Name" type='text' id='lastName'
                                                className='border-solid border-[1.5px] 
                                            border-gray-300 p-2.5 w-full '
                                                placeholder='Last Name'
                                                required={true}
                                                value={lName}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLName(event.target.value)}
                                            />
                                        </div>
                                    </div>


                                    <div>
                                        <label htmlFor="email" className="block text-lg font-medium mb-2 mt-5">Email</label>
                                        <input name="Email" type='email'
                                            className='border-solid border-[1.5px] 
                                        border-gray-300 p-2.5 w-full mb-5'
                                            placeholder='Email'
                                            required={true}
                                            value={email}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                                        />


                                        <label htmlFor="password" className="block text-lg font-medium mb-2">Password</label>
                                        <input name="Password" type='password'
                                            className='border-solid border-[1.5px]
                                        border-gray-300 p-2.5 w-full'
                                            placeholder='Password'
                                            required={true}
                                            value={password}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handlePasswordChange(event.target.value)}

                                        />
                                        <PasswordValidator
                                            lengthValid={lengthValid}
                                            lowercaseValid={lowercaseValid}
                                            uppercaseValid={uppercaseValid}
                                            numberValid={numberValid}
                                            specialCharValid={specialCharValid}
                                        />
                                    </div>

                                    <button className='bg-black text-white pt-3 pb-3 pl-5 pr-5 rounded-full mt-7 
                                    lg:w-fit w-full ml-auto mr-auto'
                                        type='submit'
                                    >REGISTER</button>

                                </Form>

                            </div>

                            <div className="h-[350px] border-l-2 border-black mt-10 w-[5px] lg:block hidden"></div>

                            <div className='flex flex-row items-center mt-[25px] w-full justify-center lg:hidden'>
                                <div className="border-b-2 border-black w-2/5"></div>
                                <span className='mx-5 font-light text-xl italic'>
                                    OR
                                </span>
                                <div className="border-b-2 border-black w-2/5"></div>
                            </div>


                            <div className='flex flex-col lg:w-1/2 w-full items-center'>
                                <h1 className="text-2xl font-bold mt-1 ml-auto mr-auto">
                                    ... with Socials
                                </h1>

                                <div className=' p-2.5 w-5/6 text-white bg-blue-900 
                                    flex justify-between items-center cursor-pointer 
                                    hover:bg hover:brightness-150 transition-all duration-300
                                    mb-2.5 mt-10 gap-3' >
                                    Sign up with Facebook
                                    <FontAwesomeIcon icon={faFacebookF} />
                                </div>

                                <div className=' p-2.5 w-5/6 text-white bg-red-900
                                    flex justify-between items-center cursor-pointer 
                                    hover:bg hover:brightness-150 transition-all duration-300
                                    mb-2.5 mt-10 gap-3' >
                                    Sign up with Google
                                    <div>
                                        <FontAwesomeIcon icon={faGoogle} />
                                    </div>

                                </div>

                                <div className=' p-2.5 w-5/6 text-white bg-cyan-600
                                    flex justify-between items-center cursor-pointer 
                                    hover:bg hover:brightness-150 transition-all duration-300
                                    mb-2.5 mt-10 gap-3' >
                                    Sign up with Twitter
                                    <FontAwesomeIcon icon={faXTwitter} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}