export interface Product {
    product_name: string;
    product_price: number;
    product_id: number;
    [key: string]: any;
}

export interface User {
    user_id: number,
    user_first_name: string,
    user_last_name: string,
    user_email: string,
    user_password: string
}