interface AddressInterface {
    firstName: string;
    lastName: string;
    phone: string;
    addressName: string;
    addressLineOne: string;
    addressLineTwo?: string; // Optional as it may not always be provided
    country: string;
    stateProvince: string;
    city: string;
    zipCode: string;
}

interface DBAddressInterface { [key: string]: AddressInterface };

interface UserOrderHistory {
    user_id: string,
    orders_id: string,
    orders_order_time: Date,
    orders_total_price: number,
    orders_order_status: string,
    orders_image: string[]
}

export type { AddressInterface, DBAddressInterface, UserOrderHistory };