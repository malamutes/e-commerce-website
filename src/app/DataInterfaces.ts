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

interface UserOrderHistoryDetailsItem {
    product_id: string,
    sku: string,
    price: number,
    quantity: number,
    combination: string[]
}

interface UserOrderHistoryDetails {
    orders_id: string,
    orders_shipping_method: string,
    orders_order_time: Date,
    orders_total_price: number,
    orders_shipping_price: number,
    orders_shipping_address: AddressInterface,
    orders_items_array: UserOrderHistoryDetailsItem[]
}

interface ProducerOrderHistoryItem {
    product_id: string,
    product_name: string,
    product_type: string,
    product_audience: string,
    product_images: string[],
    orders_id: string,
    orders_items_variant_sku: string,
    orders_items_price: string,
    orders_items_status: string,
    orders_items_count: number,
    orders_items_variant_combination: string[]
}

export type {
    AddressInterface, DBAddressInterface,
    UserOrderHistory, UserOrderHistoryDetails, UserOrderHistoryDetailsItem,
    ProducerOrderHistoryItem
};