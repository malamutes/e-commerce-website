"use client";

interface OperationsComponentProps {
    title: string;
    description: string;
    apiLink: string;
    quickData: string;
}

function OperationsComponent(props: OperationsComponentProps) {
    return (
        <div className="bg-gray-200 rounded-xl flex flex-col gap-3 p-5">
            <span className="text-2xl font-bold">
                {props.title}
            </span>
            <span className="text-lg italic">
                {props.description}
            </span>
            <span className="text-sm text-gray-600">
                Quick Overview: {props.quickData}
            </span>
            <a href={props.apiLink} className="text-blue-500 hover:underline">
                View {props.title} API.
            </a>
        </div>
    );
}

export default function Operations() {
    return (
        <div className="bg-gray-300 3xs:p-10 2xs:p-5 p-3 flex flex-col gap-5">
            <div>
                <p className="text-2xl font-bold">
                    Operations
                </p>
                <p className="italic font-bold">
                    Dashboard for Operations APIs
                </p>
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 3xs:p-5 p-2">
                <OperationsComponent
                    title="Shipping Costs"
                    description="Total shipping expenses, average shipping cost per order."
                    apiLink="/shipping-api"
                    quickData="$15,230 total this month; Average: $5.30/order"
                />
                <OperationsComponent
                    title="Trucking/ Logistics Expenses"
                    description="Track trucking costs, delivery routes, fuel, and driver compensation."
                    apiLink="/trucking-api"
                    quickData="12 routes, $7,420 spent on fuel, $3,200 on driver pay"
                />
                <OperationsComponent
                    title="Warehouse Operations"
                    description="Track warehouse costs, including rent, utilities, and storage fees."
                    apiLink="/warehouse-api"
                    quickData="Total: $10,000/month; Rent: $7,000, Utilities: $2,000"
                />
                <OperationsComponent
                    title="Packaging Costs"
                    description="Manage packaging materials costs, average per-item cost, and waste."
                    apiLink="/packaging-api"
                    quickData="$2,530 spent; $0.25/item on average"
                />
                <OperationsComponent
                    title="Operational Efficiency"
                    description="Cost-per-delivery, total operational cost, and delivery time efficiency."
                    apiLink="/efficiency-api"
                    quickData="Cost-per-delivery: $8.50; Avg. time: 3.2 days"
                />
                <OperationsComponent
                    title="Vendor/ Contractor Payments"
                    description="Manage vendor payments, outstanding invoices, and contractor services."
                    apiLink="/vendor-api"
                    quickData="$5,600 paid to vendors; $1,200 in outstanding invoices"
                />
            </div>
        </div>

    );
}
