export const shippingMethods: { [key: string]: number } = {
    'Standard Shipping (3 - 7 business days)': 10,
    'Express Shipping (2 - 4 business days)': 15,
    'Priority Shipping (1 - 2 business days)': 30,
}

export type ShippingMethodPair<T, U> = {
    shippingMethod: T;
    shippingPrice: U;
};