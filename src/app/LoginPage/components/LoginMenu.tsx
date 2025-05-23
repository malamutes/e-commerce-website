'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faGithubSquare } from '@fortawesome/free-brands-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { GlobalLoginTypeContext } from '@/app/Contexts/GlobalLoginPromptContext';
import LoginError from './LoginSignupError';
import { PasswordValidator } from './PasswordValidator';
import { FullScreenLoadingComponent } from '@/app/components/LoadingComponent';
import { AssociatedWishlistsWithProduct } from '@/app/Contexts/GlobalWishlistTrackerContextWrapper';
import { GlobalWishlistTrackerContext } from '@/app/Contexts/GlobalWishlistTrackerContext';
import { useSession } from 'next-auth/react';
import { WishlistContext } from '@/app/Contexts/WishlistModalContext';

export default function LoginMenu() {
    const { logIn, setLogIn } = useContext(GlobalLoginTypeContext)

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [fName, setFName] = useState("");
    const [lName, setLName] = useState("");

    const [showErrorSignIn, setShowErrorSignIn] = useState(false);

    const router = useRouter();

    const { setAllWishlistedItems } = useContext(GlobalWishlistTrackerContext);
    const { setWishListArray } = useContext(WishlistContext);

    const [lengthValid, setLengthValid] = useState(false);
    const [lowercaseValid, setLowercaseValid] = useState(false);
    const [uppercaseValid, setUppercaseValid] = useState(false);
    const [numberValid, setNumberValid] = useState(false);
    const [specialCharValid, setSpecialCharValid] = useState(false);

    const [showFullScreenLoading, setShowFullScreenLoading] = useState(false);

    //regex stuff done using chat
    const finalPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>\/])[A-Za-z\d!@#$%^&*(),.?":{}|<>\/]{8,24}$/;
    const lengthRegex = /^.{8,24}$/;
    const lowercaseRegex = /(?=.*[a-z])/;
    const uppercaseRegex = /(?=.*[A-Z])/;
    const numberRegex = /(?=.*\d)/;
    const specialCharRegex = /(?=.*[!@#$%^&*(),.?":{}|<>\/])/;

    const handlePasswordChange = (password: string) => {
        setPassword(password);

        // Instant feedback regex checks
        setLengthValid(lengthRegex.test(password));
        setLowercaseValid(lowercaseRegex.test(password));
        setUppercaseValid(uppercaseRegex.test(password));
        setNumberValid(numberRegex.test(password));
        setSpecialCharValid(specialCharRegex.test(password));
    };

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            if (session?.user.google_id) {
                console.log("USER SIGNED IN WITH GOOGLE");
                if (session.user.newUser) {
                    router.push('/SignUpPage');
                }
                else {
                    //for logged in user
                    router.push('/');
                }
            }
            else if (session.user.github_id) {
                console.log("USER SIGNED IN WITH GITHUB");
                if (session.user.newUser) {
                    router.push('/SignUpPage');
                }
                else {
                    router.push('/')
                }
            }
            else if (session.user.discord_id) {
                console.log("USER SIGNED IN WITH DSICORD");
                if (session.user.newUser) {
                    router.push('/SignUpPage');
                }
                else {
                    router.push('/')
                }
            }
        }

    }, [status]);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setShowFullScreenLoading(true);

        console.log(email, password)
        const loginResult = await signIn('credentials', {
            redirect: false,
            userEmail: email,
            userPassword: password,
        });


        if (loginResult?.ok) {
            const getCurrentlyWishlistedItems = async () => {
                const response = await fetch(`/api/Wishlist?requestType=getWishlistedItems`, {
                    method: "GET",
                    headers: {
                        'Accept': 'application/json'
                    }
                })

                if (response.ok) {
                    const reply: AssociatedWishlistsWithProduct[] = await response.json()
                    console.log("WISHLIST: ", reply)
                    //console.log("WISHLSITED ITEMS IN GLOBAL TRACEKR", reply);
                    setAllWishlistedItems((new Map(reply.map((item) => [item.product_id, item.associated_wishlists]))));

                    const wishlistResponse = await fetch(`/api/Wishlist?requestType=Modal`, {
                        method: "GET",
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (wishlistResponse.ok) {
                        const wishlistReply = await wishlistResponse.json()
                        console.log("GETTING WISHLISTED ARRAYS", wishlistReply)
                        if (wishlistReply.length !== 0) {
                            setWishListArray(wishlistReply[0].array_agg);
                        }
                        else {
                            setWishListArray([]);
                        }

                    }
                    else {
                        console.log(response.statusText)
                    }

                }
                else {
                    //alert("DIDNT WORK TO GET WISHLISTED ITEMS IN TRACKER CONTEXT")
                }
            }

            console.log(loginResult, "LOGIN RESULT");
            await getCurrentlyWishlistedItems();
            router.push('/');
        }
        else {
            setEmail("");
            setPassword("");
            setShowErrorSignIn(true);
        }
        setShowFullScreenLoading(false);
    }

    const handleSignUpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (finalPasswordRegex.test(password)) {

                setShowFullScreenLoading(true);

                console.log("ASDSADSADA");
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
                        //alert("Could not sign in!")
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
                setShowFullScreenLoading(false);
            }
            else {
                alert("Double Check password requirements please")
            }
        }
        catch (error) {
            console.error(error, "Issues with creating account");
        }
    }

    const handleGoogleSignIn = async () => {
        setShowFullScreenLoading(true);
        await signIn('google', { redirect: false });
        setShowFullScreenLoading(false);
    }

    const handleDiscordSignIn = async () => {
        setShowFullScreenLoading(true);
        await signIn('discord', { redirect: false });
        setShowFullScreenLoading(false);
    }

    const handleGithubSignIn = async () => {
        setShowFullScreenLoading(true);
        await signIn('github', { redirect: false });
        setShowFullScreenLoading(false);
    }

    return <>
        <div >
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

                                <form className='w-10/12'
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

                                    <span className='font-bold italic text-gray-600 mt-3 block text-sm cursor-pointer hover:underline'
                                        onClick={() => { alert("NOT ADDED SINCE WE NEED EMAIL INTERACTION") }}
                                    >
                                        Forgot Password?
                                    </span>

                                    <button className='bg-black text-white pt-2 pb-2 pl-5 pr-5 rounded-full 
                                mt-7 w-fit block mx-auto'
                                        type='submit'
                                    >SIGN IN</button>
                                </form>


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

                                <div className="flex 3xs:flex-row flex-col justify-center gap-5 p-5">
                                    <div className="flex flex-col items-center p-5 bg-black text-white w-[100px] h-[100px]
                                    rounded-full cursor-pointer hover:brightness-150 transition-all duration-300 " onClick={handleGithubSignIn}>
                                        <FontAwesomeIcon icon={faGithubSquare} size="2x" />
                                        <span className="mt-2 text-sm">Github</span>
                                    </div>

                                    <div className="flex flex-col items-center p-5 bg-red-900 text-white w-[100px] h-[100px]
                                    rounded-full cursor-pointer hover:brightness-150 transition-all duration-300" onClick={handleGoogleSignIn}>
                                        <FontAwesomeIcon icon={faGoogle} size="2x" />
                                        <span className="mt-2 text-sm">Google</span>
                                    </div>

                                    <div className="flex flex-col items-center p-5 bg-blue-800 text-white w-[100px] h-[100px]
                                    rounded-full cursor-pointer hover:brightness-150 transition-all duration-300 " onClick={handleDiscordSignIn}>
                                        <FontAwesomeIcon icon={faDiscord} size="2x" />
                                        <span className="mt-2 text-sm">Discord</span>
                                    </div>
                                </div>

                                <span className='font-bold italic text-gray-600 text-center block text-sm'>
                                    *Log in with authentications OR*
                                </span>

                                <span className='font-bold italic text-gray-600 text-center block text-sm'>
                                    *A sample user account is: david.jones63@gmail.com, D@v1dJ0n3s!*
                                </span>
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
                                <form className='flex lg:flex-col flex-col justify-between w-10/12'
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

                                        <div className='w-1/12 lg:block hidden'></div>

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

                                </form>

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

                                <div className="flex 3xs:flex-row flex-col justify-center gap-5 p-5">
                                    <div className="flex flex-col items-center p-5 bg-black text-white w-[100px] h-[100px]
                                    rounded-full cursor-pointer hover:brightness-150 transition-all duration-300" onClick={handleGithubSignIn} >
                                        <FontAwesomeIcon icon={faGithubSquare} size="2x" />
                                        <span className="mt-2 text-sm">Github</span>
                                    </div>

                                    <div className="flex flex-col items-center p-5 bg-red-900 text-white w-[100px] h-[100px]
                                    rounded-full cursor-pointer hover:brightness-150 transition-all duration-300 " onClick={handleGoogleSignIn}>
                                        <FontAwesomeIcon icon={faGoogle} size="2x" />
                                        <span className="mt-2 text-sm">Google</span>
                                    </div>

                                    <div className="flex flex-col items-center p-5 bg-blue-800 text-white w-[100px] h-[100px]
                                    rounded-full cursor-pointer hover:brightness-150 transition-all duration-300" onClick={handleDiscordSignIn}>
                                        <FontAwesomeIcon icon={faDiscord} size="2x" />
                                        <span className="mt-2 text-sm">Discord</span>
                                    </div>
                                </div>

                                <span className='font-bold italic text-gray-600 text-center block text-sm'>
                                    *Log in with authentications OR*
                                </span>

                                <span className='font-bold italic text-gray-600 text-center block text-sm'>
                                    *A sample user account is: david.jones63@gmail.com, D@v1dJ0n3s!*
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <FullScreenLoadingComponent
            show={showFullScreenLoading}
            setShow={setShowFullScreenLoading}
        />
    </>
}