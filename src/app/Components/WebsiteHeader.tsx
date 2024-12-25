'use client';

import Image from "next/image";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function WebsiteHeader() {
    const iconSize = "25px";
    const iconClass = "xs:mx-1.5 mx-1 cursor-pointer transition-transform duration-250 hover:scale-110";
    const headers = ['Products', 'Trending', 'Best Sellers', 'New'];

    return <>
        <div className="fixed bg-gray-300 w-screen pt-1.5 pb-1.5">
            {/* header bar for more than 1280px i.e. xl and hidden on lesser screen*/}
            <div className="hidden lg:block max-w-[2000px] mx-auto">
                <div className=" flex flex-row justify-between xl:w-4/5 lg:w-11/12 mx-auto ">
                    <Link href={"/"}>
                        <Image src={"/Logo.png"} alt="WebsiteLogo"
                            width={100} height={100} className="ml-5" />
                    </Link>


                    <div className="flex flex-row ">
                        {headers.map((headline, index) => (
                            <div key={index} className="flex flex-row items-center xl:mx-4 lg:mx-3">
                                <span >
                                    {headline}
                                </span>
                                <FontAwesomeIcon icon={faAngleDown}
                                    size="1x"
                                    className={iconClass} />
                            </div>


                        ))}
                    </div>

                    <div className="flex flex-row items-center">
                        <form action={"/search"} method="GET" className="mr-5">

                            <input type="text" name="query"
                                placeholder="Search Brands or Products"
                                required
                                className="p-2.5"
                            >

                            </input>

                        </form>

                        <div>
                            <Link href={"/LoginPage"}>
                                <FontAwesomeIcon icon={faUser}
                                    style={{ fontSize: iconSize }}
                                    className={iconClass}

                                />
                            </Link>

                            <FontAwesomeIcon icon={faBookmark}
                                style={{ fontSize: iconSize }}
                                className={iconClass} />

                            <FontAwesomeIcon icon={faShoppingCart}
                                style={{ fontSize: iconSize }}
                                className={iconClass} />

                        </div>
                    </div>
                </div>
            </div>

            <div className="block lg:hidden">
                <div className=" flex flex-row justify-between w-11/12 mx-auto">

                    <div className="flex flex-row items-center justify-start w-1/3 ">
                        <div>
                            <FontAwesomeIcon icon={faBars}
                                style={{ fontSize: iconSize }}
                                className={iconClass} />

                            <FontAwesomeIcon icon={faMagnifyingGlass}
                                style={{ fontSize: iconSize }}
                                className={iconClass} />
                        </div>
                    </div>

                    <Link href={"/"}>
                        <Image src={"/Logo.png"} alt="WebsiteLogo"
                            width={100} height={100} />
                    </Link>


                    <div className="flex flex-row items-center justify-end xs:w-1/3 xxs:w-5/12">
                        <div>
                            <Link href={"/LoginPage"}>
                                <FontAwesomeIcon icon={faUser}
                                    style={{ fontSize: iconSize }}
                                    className={iconClass}

                                />
                            </Link>

                            <FontAwesomeIcon icon={faBookmark}
                                style={{ fontSize: iconSize }}
                                className={iconClass} />

                            <FontAwesomeIcon icon={faShoppingCart}
                                style={{ fontSize: iconSize }}
                                className={iconClass} />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </>
}