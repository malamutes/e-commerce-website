"use client";


//if i get router not mounted need to change from next/next or whatever to next/navigation
import Overview from "./components/Overview";
import Orders from "./components/Orders";
import Sales from "./components/Sales";
import Settings from "./components/Settings";
import Products from "./components/Products";
import Operations from "./components/Operations";
import AddProduct from "./components/AddProduct";

export default function ProducerDashboard() {

    /*
    const searchParams = useSearchParams();

    let currentTab = "Overview"

    if (searchParams) {
        currentTab = searchParams.get('tab') ?? "";
    }
        */

    const tabComponentMap: { [key: string]: React.ReactNode } = {
        'Overview': <Overview />,
        'Orders': <Orders />,
        'Sales': <Sales />,
        'Settings': <Settings />,
        'Products': <Products />,
        'Operations': <Operations />,
        'AddProduct': <AddProduct />

    };

    return <>
        <div className={`max-h-[750px] overflow-y-auto`}>
            {tabComponentMap['Overview']}
        </div>

    </>
}